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
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('import')
  @ApiOperation({ summary: 'Імпорт продуктів з Excel файлу' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Excel файл для імпорту продуктів',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // для завантаження файлу у Swagger
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importProducts(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('Файл не передано');
    return this.productsService.importProductsFromFile(file);
  }

  @Get('export')
  @ApiOperation({ summary: 'Експорт продуктів у Excel' })
  async exportProducts(@Res() res: Response) {
    return this.productsService.exportProductsToExcel(res);
  }


  @Get('export-google')
  @ApiOperation({
    summary: 'Експорт товарів у форматі Google Merchant Center',
    description:
      'Генерує XLSX файл із товарами та їхніми варіантами для завантаження у Google Merchant Center.',
  })
  @ApiResponse({
    status: 200,
    description: 'XLSX файл з товарами',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Помилка при генерації Google Merchant фіду',
  })
  async exportGoogle(@Res() res: Response) {
    try {
      await this.productsService.exportProductsToGoogle(res);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Помилка при генерації Google Merchant фіду',
      });
    }
  }

  @Post()
  @ApiOperation({ summary: 'Створити новий продукт' })
  @ApiBody({
    type: CreateProductDto,
  })
  @ApiResponse({ status: 201, description: 'Продукт успішно створено' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Кількість елементів',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Пропустити N елементів',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер сторінки',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Фільтр по категорії',
  })
  @ApiQuery({
    name: 'collection',
    required: false,
    type: String,
    description: 'Фільтр по колекції',
  })
  @Get()
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
