import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';
import { TelegramService } from '../telegram/telegram.service';
import { OrderItemDto } from '../order-item/dto/order-item.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService,
  ) {}

  async getOrderById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                translations: true,
                images: true,
                variants: { include: { images: true } },
              },
            },
          },
        },
      },
    });
  }

  async getOrders(
    userId?: number,
    showAll?: boolean,
    filters?: { orderId?: number; dateFrom?: string; dateTo?: string },
    page: number = 1,
    limit: number = 10, // Ліміт за замовчуванням
  ) {
    const where: any = {};
    if (!showAll && userId) where.userId = userId;
    if (filters?.orderId) where.id = filters.orderId;
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom).toISOString();
      }
      if (filters.dateTo) {
        where.createdAt.lte = new Date(
          filters.dateTo + 'T23:59:59.999Z',
        ).toISOString();
      }
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                translations: true,
                images: true,
                variants: { include: { images: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit, // Пропускаємо записи для пагінації
      take: limit, // Ліміт записів на сторінку
    });
  }

  async createOrder(dto: CreateOrderDto) {
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
            priceSale: item.priceSale ? Number(item.priceSale) : null, // Безпечно
          })),
        },
      },
      include: { items: true },
    });

    const itemsForTelegram: OrderItemDto[] = order.items.map((i) => ({
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
    } catch (err) {
      console.error(
        '❌ Не вдалось відправити замовлення у Telegram:',
        err.message,
      );
    }

    return order;
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    // Перевіряємо чи існує замовлення
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Замовлення з ID ${id} не знайдено`);
    }

    // Оновлюємо статус замовлення
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                translations: true,
                images: true,
                variants: { include: { images: true } },
              },
            },
          },
        },
      },
    });

    return updatedOrder;
  }
}
