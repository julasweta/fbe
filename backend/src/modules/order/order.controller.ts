import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
  UnauthorizedException,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  UpdateOrderTrackingDto,
} from './dto/order.dto';
import { Request } from 'express';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all') // Другим: /orders/all
  @ApiOperation({ summary: 'Отримати всі замовлення' })
  @ApiResponse({ status: 200, description: 'Список замовлень' })
  async getOrders(
    @Req() req: Request,
    @Query('showAll') showAll?: string,
    @Query('orderId') orderId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      orderId: orderId ? +orderId : undefined,
      dateFrom: dateFrom ? dateFrom : undefined,
      dateTo: dateTo ? dateTo : undefined,
    };
    const isShowAll = showAll === 'true';
    const pageNum = page ? +page : 1;
    const limitNum = limit ? +limit : 10;

    return this.orderService.getOrders(
      req.user.id ? +req.user.id : undefined,
      isShowAll,
      filters,
      pageNum,
      limitNum,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Отримати одне замовлення за ID' })
  @ApiResponse({ status: 200, description: 'Замовлення' })
  async getOrderById(@Param('id') idStr: string, @Req() req: Request) {
    const id = +idStr;

    if (req.user.id && req.user.role !== 'ADMIN') {
      const order = await this.orderService.getOrderById(id);
      if (order && order.userId !== +req.user.id) {
        throw new UnauthorizedException('Доступ заборонено');
      }
    }
    return this.orderService.getOrderById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити замовлення' })
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Оновити статус замовлення' })
  @ApiResponse({ status: 200, description: 'Статус замовлення оновлено' })
  async updateOrderStatus(
    @Param('id') idStr: string,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req: Request,
  ) {
    const id = +idStr;

    // Перевіряємо права доступу - тільки адміни можуть оновлювати статус
    if (req.user.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'Тільки адміністратори можуть оновлювати статус замовлень',
      );
    }

    return await this.orderService.updateOrderStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('tracknumber/:id')
  @ApiOperation({
    summary: 'Оновити номер посилки для конкретного товару замовлення',
  })
  @ApiResponse({ status: 200, description: 'Номер посилки оновлено' })
  async updateOrderTracking(
    @Param('id') idStr: string,
    @Body() dto: UpdateOrderTrackingDto,
    @Req() req: Request,
  ) {
    const id = +idStr;

    // Перевірка прав доступу (тільки адмін може оновлювати)
    if (req.user.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'Тільки адміністратори можуть оновлювати номер посилки',
      );
    }

    const res = await this.orderService.updateOrderTracking(
      id,
      dto.trackingNumber,
    );
    return res;
  }
}
