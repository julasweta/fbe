import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddToCartDto } from './dto/cart.dto';
import { CartItem } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCartByUserId(userId: number) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  async addToCart(dto: AddToCartDto) {
    if (!dto.userId && !dto.sessionId) {
      throw new BadRequestException(
        'Потрібно передати або userId, або sessionId',
      );
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

    let result: CartItem;

    if (existingItem) {
      result = await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + item.quantity },
      });
    } else {
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

  async clearCart(userId: number) {
    // знаходимо кошик користувача
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    // видаляємо всі товари з цього кошика
    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}
