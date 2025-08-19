import {
  Body,
  Controller,
  Delete,
  Get,
  Post,  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AddToCartDto } from './dto/cart.dto';
import { Request } from 'express';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Отримати кошик користувача' })
  @ApiResponse({ status: 200, description: 'Повертає кошик користувача' })
  getUserCart(@Req() req: Request) {
    console.log('user req - ', req.user);
    return this.cartService.getCartByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @ApiOperation({ summary: 'Додати товар у кошик' })
  addToCart(@Body() dto: AddToCartDto) {
    return this.cartService.addToCart(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('clear')
  @ApiOperation({ summary: 'Очистити кошик користувача' })
  @ApiResponse({
    status: 200,
    description: 'Видаляє всі товари з кошика користувача',
  })
  clearCart(@Req() req: Request) {
    return this.cartService.clearCart(req.user.id);
  }
}
