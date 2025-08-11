import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ApiOperation({ summary: 'Створити новий продукт' })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      example: {
        summary: 'Приклад створення продукту',
        value: {
          sku: 'SKU-12345',
          price: 100,
          priceSale: 80,
          images: [
            { url: 'https://example.com/image1.jpg', altText: 'Зображення 1' },
            { url: 'https://example.com/image2.jpg', altText: 'Зображення 2' }
          ],
          translations: [
            {
              name: 'Ноутбук',
              description: 'Потужний ноутбук для роботи та ігор',
              languageId: 1
            }
          ]
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Продукт успішно створено' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі продукти' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати продукт за ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити продукт' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити продукт' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}

