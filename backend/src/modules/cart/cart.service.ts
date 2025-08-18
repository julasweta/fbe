import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddToCartDto } from './dto/cart.dto';
import { UpdateCartItemDto } from '../cart-item/dto/cart-item.dto';
import { CartItem } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) { }

  async getCartByUserId(userId: number) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });
  }



  async addToCart(dto: AddToCartDto) {
    if (!dto.userId && !dto.sessionId) {
      throw new BadRequestException('Потрібно передати або userId, або sessionId');
    }

    const cart = await this.prisma.cart.upsert({
      where: dto.userId
        ? { userId: dto.userId }
        : { sessionId: dto.sessionId },
      update: {},
      create: {
        userId: dto.userId ?? null,
        sessionId: dto.sessionId ?? null,
      },
    });

    const results: CartItem[] = [];

    for (const item of dto.items) {
      const existingItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: item.productId,
          color: item.color,
          size: item.size,
        },
      });

      if (existingItem) {
        const updated = await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
        results.push(updated);
      } else {
        const created = await this.prisma.cartItem.create({
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
        results.push(created);
      }
    }

    return {
      cartId: cart.id,
      items: results,
    };
  }




  async updateCartItem(id: number, dto: UpdateCartItemDto) {
    return this.prisma.cartItem.update({
      where: { id },
      data: dto
    });
  }

  async removeCartItem(id: number) {
    return this.prisma.cartItem.delete({ where: { id } });
  }
}
