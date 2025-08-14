import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Створити новий продукт' })
  @ApiBody({
    type: CreateProductDto,
  })
  @ApiResponse({ status: 201, description: 'Продукт успішно створено' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Отримати всі продукти з пагінацією та фільтром по категорії',
  })
  findAll(
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
    @Query('page') page?: string,
    @Query('category') category?: string,
    @Query('collection') collection?: string,
  ) {
    return this.productsService.findAll({
      limit: limit && !isNaN(+limit) ? parseInt(limit, 10) : undefined,
      skip: skip && !isNaN(+skip) ? parseInt(skip, 10) : undefined,
      page: page && !isNaN(+page) ? parseInt(page, 10) : undefined,
      category: category && category !== 'undefined' ? category : undefined,
      collection:
        collection && collection !== 'undefined' ? collection : undefined,
    });
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
