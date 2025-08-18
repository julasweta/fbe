import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  async getOrderById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true } // тільки OrderItem, без product
    });
  }


  async createOrder(dto: CreateOrderDto) {
    return await this.prisma.order.create({
      data: {
        userId: dto.userId ?? null,
        guestName: dto.guestName,
        guestPhone: dto.guestPhone,
        guestEmail: dto.guestEmail,
        guestAddress: dto.guestAddress,
        novaPostBranch: dto.novaPostBranch,
        novaPostCity: dto.novaPostCity,
        paymentMethod: dto.paymentMethod,
        
        // TODO: додай paymentMethod у Prisma модель Order, бо зараз його там немає!
        items: {
          create: dto.items.map(item => ({
            productId: item.productId ?? null,
            quantity: item.quantity,
            price: item.price,
            finalPrice: item.finalPrice,
            name: item.name,
            image: item.image,
          })),
        },
      },
      include: { items: true }, // щоб одразу вертати товари
    });
  }

}
