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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const telegram_service_1 = require("../telegram/telegram.service");
let OrderService = class OrderService {
    prisma;
    telegramService;
    constructor(prisma, telegramService) {
        this.prisma = prisma;
        this.telegramService = telegramService;
    }
    async getOrderById(id) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });
    }
    async createOrder(dto) {
        const order = await this.prisma.order.create({
            data: {
                userId: dto.userId ?? null,
                guestName: dto.guestName,
                guestPhone: dto.guestPhone,
                guestEmail: dto.guestEmail,
                guestAddress: dto.guestAddress,
                novaPostBranch: dto.novaPostBranch,
                novaPostCity: dto.novaPostCity,
                paymentMethod: dto.paymentMethod,
                items: {
                    create: dto.items.map((item) => ({
                        productId: item.productId ?? null,
                        quantity: item.quantity,
                        price: item.price,
                        finalPrice: item.finalPrice,
                        name: item.name,
                        image: item.image,
                        color: item.color,
                        size: item.size,
                        priceSale: Number(item.priceSale),
                    })),
                },
            },
            include: { items: true },
        });
        const itemsForTelegram = order.items.map((i) => ({
            productId: i.productId ?? undefined,
            quantity: +i.quantity,
            price: +i.price,
            finalPrice: +i.finalPrice,
            name: i.name ?? '',
            image: i.image ?? undefined,
            color: i.color ?? undefined,
            size: i.size ?? undefined,
            priceSale: i.priceSale ?? undefined,
        }));
        try {
            await this.telegramService.sendOrderNotification({
                user: {
                    id: order.userId ?? undefined,
                    name: order.guestName ?? '',
                    phone: order.guestPhone ?? '',
                    email: order.guestEmail ?? '',
                    address: order.guestAddress ?? '',
                    novaPostCity: order.novaPostCity ?? '',
                    novaPostBranch: order.novaPostBranch ?? '',
                },
                items: itemsForTelegram,
                paymentMethod: order.paymentMethod,
            });
        }
        catch (err) {
            console.error('❌ Не вдалось відправити замовлення у Telegram:', err.message);
        }
        return order;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegram_service_1.TelegramService])
], OrderService);
//# sourceMappingURL=order.service.js.map