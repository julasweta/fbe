import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService, PrismaService],
})
export class CartItemModule {}
