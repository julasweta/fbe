import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OrderItemDto } from '../order-item/dto/order-item.dto';
import { UserForTelegram } from '../users/dto/base-user.dto';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class TelegramService {
  constructor(private readonly http: HttpService) { }

  async sendOrderNotification(data: {
    user: UserForTelegram;
    items: OrderItemDto[] | undefined;
    paymentMethod: PaymentMethod;
  }) {

    const payment = (data.paymentMethod === PaymentMethod.COD) ? 'Оплата при отриманні' : 'Оплата онлайн карткою';

    const message = `
📦 НОВЕ ЗАМОВЛЕННЯ
👤 name:    ${data.user.name} 
☎️ phone:   ${data.user.phone}
📧 email:   ${data.user.email}
🏠 ${data.user.address}, ${data.user.novaPostCity},
 № NovaPost ${data.user.novaPostBranch}
💳 Оплата: ${payment}

🛒 Товари:
${data.items && data.items
        .map(
          (i: OrderItemDto) =>
            `• ID: ${i.productId}
   Назва: ${i.name}
   Колір: ${i.color}
   Розмір: ${i.size}
   К-сть: ${i.quantity}
   Ціна: ${i.price} грн
   Ціна зі знижкою: ${i.priceSale}
   Остаточна ціна: ${i.finalPrice} грн
   Фото: ${i.image}`,
        )
        .join('\n\n')}
  `;

    try {
      await firstValueFrom(
        this.http.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
          },
        ),
      );
    } catch (err) {
      console.error('❌ Помилка Telegram:', err.response?.data || err.message);
    }
  }
}
