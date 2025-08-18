import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OrderItemDto } from '../order-item/dto/order-item.dto';

@Injectable()
export class TelegramService {
  constructor(private readonly http: HttpService) {}

  async sendOrderNotification(data: {
    user: any;
    items: any[];
    paymentMethod: string;
  }) {
    const message = `
📦 НОВЕ ЗАМОВЛЕННЯ
👤 ${data.user.name} (${data.user.phone})
📧 ${data.user.email}
🏠 ${data.user.address}, ${data.user.novaPostCity}, ${data.user.novaPostBranch}
💳 Оплата: ${data.paymentMethod}

🛒 Товари:
${data.items
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
      const res = await firstValueFrom(
        this.http.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
          },
        ),
      );

      console.log('✅ Відправлено у Telegram:', res.data);
    } catch (err) {
      console.error('❌ Помилка Telegram:', err.response?.data || err.message);
    }
  }
}
