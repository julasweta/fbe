import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateCartItemDto } from './dto/cart-item.dto';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Оновити товар у кошику' })
  updateCartItem(@Param('id') id: number, @Body() dto: UpdateCartItemDto) {
    return this.cartItemService.updateCartItem(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити товар з кошика' })
  removeCartItem(@Param('id') id: number) {
    return this.cartItemService.removeCartItem(id);
  }
}
