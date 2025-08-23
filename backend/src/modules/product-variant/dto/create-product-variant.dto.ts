import { ApiProperty } from '@nestjs/swagger';
import { EColor, ESize } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductImageDto } from '../../images/dto/images.dto';

export class CreateProductVariantDto {
  @ApiProperty({ example: 1, description: 'ID продукту' })
  @IsInt()
  @IsOptional()
  productId?: number;

  @ApiProperty({ example: 'BLACK', enum: EColor, description: 'Колір' })
  @IsEnum(EColor)
  color: EColor;

  @ApiProperty({
    example: ['S', 'M', 'L'],
    enum: ESize,
    isArray: true,
    description: 'Доступні розміри',
  })
  @IsEnum(ESize, { each: true })
  sizes: ESize[];

  @ApiProperty({ example: 1000, description: 'Ціна' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 900,
    description: 'Ціна зі знижкою',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  priceSale?: number;

  @ApiProperty({ example: 15, description: 'Загальна кількість на складі' })
  @IsInt()
  stock: number;

  @ApiProperty({
    type: [ProductImageDto],
    description: 'Масив зображень для варіанту',
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}
