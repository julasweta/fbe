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
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  create(@Body() dto: CreateCollectionDto) {
    return this.collectionService.create(dto);
  }

  @Get()
  findAll() {
    return this.collectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.collectionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit collection by id' })
  @ApiParam({ name: 'id', type: Number, description: 'ID колекції' })
  @ApiResponse({
    status: 200,
    description: 'Колекція знайдена',
    type: CreateCollectionDto, // або окремий CategoryDto якщо є
  })
  @ApiResponse({ status: 404, description: 'Колекція не знайдена' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCollectionDto,
  ) {
    return this.collectionService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.collectionService.remove(id);
  }
}
