import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
  constructor(private readonly http: HttpService) { }

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
${data.items.map(i => `• ${i.name} x${i.quantity} = ${i.finalPrice} грн`).join("\n")}
    `;

    await this.http.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }
    ).toPromise();
  }
}

