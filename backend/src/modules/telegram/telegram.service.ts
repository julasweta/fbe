import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OrderItemDto } from '../order-item/dto/order-item.dto';
import { UserForTelegram } from '../users/dto/base-user.dto';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class TelegramService {
  private readonly chatIds: string[];

  constructor(private readonly http: HttpService) {
    console.log('Telegram chatIds:', this.chatIds);

    // Беремо всі chat_id з .env (через кому)
    this.chatIds = process.env.TELEGRAM_CHAT_IDS
      ? process.env.TELEGRAM_CHAT_IDS.split(',').map((id) => id.trim())
      : [];
  }

  async sendOrderNotification(data: {
    user: UserForTelegram;
    items: OrderItemDto[] | undefined;
    paymentMethod: PaymentMethod;
  }) {
    const payment =
      data.paymentMethod === PaymentMethod.COD
        ? 'Оплата при отриманні'
        : 'Оплата онлайн карткою';

    const message = `
📦 НОВЕ ЗАМОВЛЕННЯ
👤 name:    ${data.user.name} 
☎️ phone:   ${data.user.phone}
📧 email:   ${data.user.email}
🏠 ${data.user.address}, ${data.user.novaPostCity},
 № NovaPost ${data.user.novaPostBranch}
💳 Оплата: ${payment}

🛒 Товари:
${
  data.items &&
  data.items
    .map(
      (i: OrderItemDto) => `• ID: ${i.productId}
   Назва: ${i.name}
   Колір: ${i.color}
   Розмір: ${i.size}
   К-сть: ${i.quantity}
   Ціна: ${i.price} грн
   Ціна зі знижкою: ${i.priceSale}
   Остаточна ціна: ${i.finalPrice} грн
   Фото: ${i.image}`,
    )
    .join('\n\n')
}
    `;

    await this.broadcastMessage(message);
  }

  async sendContactMessage(data: {
    name: string;
    email: string;
    message: string;
    imageUrl?: string;
  }) {
    const text = `
📩 НОВЕ ПОВІДОМЛЕННЯ З ФОРМИ
👤 Ім’я: ${data.name}
📧 Email: ${data.email}
📝 Повідомлення:
${data.message}
    `;

    await this.broadcastMessage(text);

    if (data.imageUrl) {
      await this.broadcastPhoto(data.imageUrl, `Фото від ${data.name}`);
    }
  }

  async messagesFromCustomer(data: any) {
    const text = `
👤 Ім’я: ${data.name}
📧 Email: ${data.email}
📝 Повідомлення:
${data.message}
    `;

    await this.broadcastMessage(text);
  }

  // 🔹 Відправка тексту всім chat_id
  private async broadcastMessage(text: string) {
    for (const chatId of this.chatIds) {
      try {
        await firstValueFrom(
          this.http.post(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              chat_id: chatId,
              text,
              parse_mode: 'HTML',
            },
          ),
        );
      } catch (err) {
        console.error(
          `❌ Помилка відправки повідомлення в Telegram (chat_id=${chatId}):`,
          err.response?.data || err.message,
        );
      }
    }
  }

  // 🔹 Відправка фото всім chat_id
  private async broadcastPhoto(photoUrl: string, caption?: string) {
    for (const chatId of this.chatIds) {
      try {
        await firstValueFrom(
          this.http.post(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
            {
              chat_id: chatId,
              photo: photoUrl,
              caption,
            },
          ),
        );
      } catch (err) {
        console.error(
          `❌ Помилка відправки фото в Telegram (chat_id=${chatId}):`,
          err.response?.data || err.message,
        );
      }
    }
  }
}
