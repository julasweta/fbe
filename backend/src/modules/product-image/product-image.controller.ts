import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@ApiTags('Product Images')
@Controller('product-images')
export class ProductImageController {
  constructor(private readonly service: ProductImageService) {}

  @Post()
  @ApiOperation({ summary: 'Додати зображення до варіанта продукту' })
  @ApiResponse({ status: 201, description: 'Зображення додано' })
  create(@Body() dto: CreateProductImageDto) {
    return this.service.create(dto);
  }

  @Get('variant/:variantId')
  @ApiOperation({ summary: 'Отримати всі зображення для конкретного варіанта' })
  findAll(@Param('variantId') variantId: string) {
    return this.service.findAllByVariant(+variantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати конкретне зображення' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити зображення' })
  update(@Param('id') id: string, @Body() dto: UpdateProductImageDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити зображення' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
