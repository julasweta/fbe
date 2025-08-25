import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OrderItemDto } from '../order-item/dto/order-item.dto';
import { UserForTelegram } from '../users/dto/base-user.dto';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class TelegramService {
  constructor(private readonly http: HttpService) {}

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

    await this.sendMessage(message);
  }

  // ✅ Новий метод для "Зв'яжіться з нами"
  async sendContactMessage(data: {
    name: string;
    email: string;
    message: string;
    imageUrl?: string; // опціонально
  }) {
    const text = `
📩 НОВЕ ПОВІДОМЛЕННЯ З ФОРМИ
👤 Ім’я: ${data.name}
📧 Email: ${data.email}
📝 Повідомлення:
${data.message}
    `;

    // Відправляємо текстове повідомлення
    await this.sendMessage(text);

    // Якщо є фото — відправляємо окремо
    if (data.imageUrl) {
      await this.sendPhoto(data.imageUrl, `Фото від ${data.name}`);
    }
  }

  // 🔹 Хелпер для відправки тексту
  private async sendMessage(text: string) {
    try {
      await firstValueFrom(
        this.http.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'HTML',
          },
        ),
      );
    } catch (err) {
      console.error(
        '❌ Помилка відправки повідомлення в Telegram:',
        err.response?.data || err.message,
      );
    }
  }

  // 🔹 Хелпер для відправки фото
  private async sendPhoto(photoUrl: string, caption?: string) {
    try {
      await firstValueFrom(
        this.http.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
          {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            photo: photoUrl,
            caption,
          },
        ),
      );
    } catch (err) {
      console.error(
        '❌ Помилка відправки фото в Telegram:',
        err.response?.data || err.message,
      );
    }
  }

  async messagesFromCustomer(data: any) {
    const text = `
👤 Ім’я: ${data.name}
📧 Email: ${data.email}
📝 Повідомлення:
${data.message}
    `;

    await this.sendMessage(text);
  }
}
