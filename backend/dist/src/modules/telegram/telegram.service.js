"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const client_1 = require("@prisma/client");
let TelegramService = class TelegramService {
    http;
    chatIds;
    constructor(http) {
        this.http = http;
        console.log('Telegram chatIds:', this.chatIds);
        this.chatIds = process.env.TELEGRAM_CHAT_IDS
            ? process.env.TELEGRAM_CHAT_IDS.split(',').map((id) => id.trim())
            : [];
    }
    async sendOrderNotification(data) {
        const payment = data.paymentMethod === client_1.PaymentMethod.COD
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
${data.items &&
            data.items
                .map((i) => `• ID: ${i.productId}
   Назва: ${i.name}
   Колір: ${i.color}
   Розмір: ${i.size}
   К-сть: ${i.quantity}
   Ціна: ${i.price} грн
   Ціна зі знижкою: ${i.priceSale}
   Остаточна ціна: ${i.finalPrice} грн
   Фото: ${i.image}`)
                .join('\n\n')}
    `;
        await this.broadcastMessage(message);
    }
    async sendContactMessage(data) {
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
    async messagesFromCustomer(data) {
        const text = `
👤 Ім’я: ${data.name}
📧 Email: ${data.email}
📝 Повідомлення:
${data.message}
    `;
        await this.broadcastMessage(text);
    }
    async broadcastMessage(text) {
        for (const chatId of this.chatIds) {
            try {
                await (0, rxjs_1.firstValueFrom)(this.http.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    chat_id: chatId,
                    text,
                    parse_mode: 'HTML',
                }));
            }
            catch (err) {
                console.error(`❌ Помилка відправки повідомлення в Telegram (chat_id=${chatId}):`, err.response?.data || err.message);
            }
        }
    }
    async broadcastPhoto(photoUrl, caption) {
        for (const chatId of this.chatIds) {
            try {
                await (0, rxjs_1.firstValueFrom)(this.http.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                    chat_id: chatId,
                    photo: photoUrl,
                    caption,
                }));
            }
            catch (err) {
                console.error(`❌ Помилка відправки фото в Telegram (chat_id=${chatId}):`, err.response?.data || err.message);
            }
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map