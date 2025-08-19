import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateCartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartItemService {
  constructor(private prisma: PrismaService) {}

  async updateCartItem(id: number, dto: UpdateCartItemDto) {
    return await this.prisma.cartItem.update({
      where: { id },
      data: dto,
    });
  }

  async removeCartItem(id: number) {
    return this.prisma.cartItem.delete({ where: { id } });
  }
}
