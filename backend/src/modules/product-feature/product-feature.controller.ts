import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateProductFeatureDto } from './dto/create-product-feature.dto';
import { UpdateProductFeatureDto } from './dto/update-product-feature.dto';
import { ProductFeaturesService } from './product-feature.service';

@ApiTags('Product Features')
@Controller('products/:productId/features')
export class ProductFeaturesController {
  constructor(private readonly service: ProductFeaturesService) {}

  @Post()
  @ApiOperation({ summary: 'Додати пункт опису до товару' })
  create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateProductFeatureDto,
  ) {
    return this.service.create(productId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі пункти опису товару' })
  findAll(@Param('productId', ParseIntPipe) productId: number) {
    return this.service.findAll(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати один пункт опису' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити пункт опису' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductFeatureDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити пункт опису' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
