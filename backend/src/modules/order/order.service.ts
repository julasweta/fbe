import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService,
  ) {}

  async getOrderById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true }, // тільки OrderItem, без product
    });
  }

  async createOrder(dto: CreateOrderDto) {
    // 1. Створюємо замовлення в базі
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
      include: { items: true }, // вертаємо одразу замовлення з товарами
    });
    // 2. Відправка у Telegram (якщо потрібна)
    try {
      await this.telegramService.sendOrderNotification({
        user: {
          id: order.userId,
          name: order.guestName,
          phone: order.guestPhone,
          email: order.guestEmail,
          address: order.guestAddress,
          novaPostBranch: order.novaPostBranch,
          novaPostCity: order.novaPostCity,
        },
        items: order.items,
        paymentMethod: order.paymentMethod,
      });
    } catch (err) {
      console.error(
        '❌ Не вдалось відправити замовлення у Telegram:',
        err.message,
      );
      // але саме замовлення в базі лишається
    }

    return order;
  }
}
