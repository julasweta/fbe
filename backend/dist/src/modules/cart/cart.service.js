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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCartByUserId(userId) {
        return this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });
    }
    async addToCart(dto) {
        if (!dto.userId && !dto.sessionId) {
            throw new common_1.BadRequestException('Потрібно передати або userId, або sessionId');
        }
        const cart = await this.prisma.cart.upsert({
            where: dto.userId ? { userId: dto.userId } : { sessionId: dto.sessionId },
            update: {},
            create: {
                userId: dto.userId ?? null,
                sessionId: dto.sessionId ?? null,
            },
        });
        const item = dto.item;
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: item.productId,
                color: item.color,
                size: item.size,
            },
        });
        let result;
        if (existingItem) {
            result = await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + item.quantity },
            });
        }
        else {
            result = await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    priceSale: item.priceSale,
                },
            });
        }
        return {
            cartId: cart.id,
            item: result,
        };
    }
    async clearCart(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            throw new Error('Cart not found');
        }
        return this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map