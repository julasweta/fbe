import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Product Variants')
@Controller('product-variants')
export class ProductVariantController {
  constructor(private readonly service: ProductVariantService) {}

  @Post()
  @ApiOperation({ summary: 'Створити варіант продукту' })
  @ApiResponse({ status: 201, description: 'Варіант створено' })
  create(@Body() dto: CreateProductVariantDto) {
    if (!dto.productId) {
      throw new BadRequestException(
        'productId обов’язковий для створення варіанту',
      );
    }
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі варіанти (опціонально по productId)' })
  findAll(@Query('productId') productId?: string) {
    return this.service.findAll(productId ? Number(productId) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати варіант за ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити варіант продукту' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductVariantDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити варіант продукту' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
