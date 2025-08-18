import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AddToCartDto } from './dto/cart.dto';
import { UpdateCartItemDto } from '../cart-item/dto/cart-item.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Отримати кошик користувача' })
  @ApiResponse({ status: 200, description: 'Повертає кошик користувача' })
  getUserCart(@Query('userId') userId: number) {
    return this.cartService.getCartByUserId(userId);
  }



  //@UseGuards(JwtAuthGuard)
  @Post('add')
  @ApiOperation({ summary: 'Додати товар у кошик' })
  addToCart(@Body() dto: AddToCartDto) {
    return this.cartService.addToCart(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Оновити товар у кошику' })
  updateCartItem(@Param('id') id: number, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateCartItem(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити товар з кошика' })
  removeCartItem(@Param('id') id: number) {
    return this.cartService.removeCartItem(id);
  }
}

