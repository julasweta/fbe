import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('categories') // Групує всі методи цього контролера в swagger під "categories"
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Створити категорію' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Категорія створена успішно' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі категорії' })
  @ApiResponse({
    status: 200,
    description: 'Список категорій',
    isArray: true,
    type: CreateCategoryDto, // або окремий CategoryDto якщо є
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати категорію за id' })
  @ApiParam({ name: 'id', type: Number, description: 'ID категорії' })
  @ApiResponse({
    status: 200,
    description: 'Категорія знайдена',
    type: CreateCategoryDto, // або окремий CategoryDto якщо є
  })
  @ApiResponse({ status: 404, description: 'Категорія не знайдена' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit category by id' })
  @ApiParam({ name: 'id', type: Number, description: 'ID категорії' })
  @ApiResponse({
    status: 200,
    description: 'Категорія знайдена',
    type: CreateCategoryDto, // або окремий CategoryDto якщо є
  })
  @ApiResponse({ status: 404, description: 'Категорія не знайдена' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити категорію за id' })
  @ApiParam({ name: 'id', type: Number, description: 'ID категорії' })
  @ApiResponse({ status: 200, description: 'Категорія видалена' })
  @ApiResponse({ status: 404, description: 'Категорія не знайдена' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
