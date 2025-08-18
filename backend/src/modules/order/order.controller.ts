import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Отримати замовлення' })
  @ApiResponse({ status: 200, description: 'Повертає дані замовлення' })
  getOrder(@Param('id') id: number) {
    return this.orderService.getOrderById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити замовлення (гостьове або користувача)' })
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }
}
