import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ProductImageDto } from '../../images/dto/images.dto';
import { ProductTranslationDto } from '../../product-translations/dto/product-translation.dto';
import { CreateProductFeatureDto } from '../../product-feature/dto/create-product-feature.dto';

export enum ESize {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export enum EColor {
  RED = 'RED',
  BLUE = 'BLUE',
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
}

export class CreateProductDto {
  @ApiProperty({ example: 'SKU-12345', description: 'Унікальний код продукту' })
  @IsString()
  @MinLength(1)
  sku: string;

  @ApiProperty({ example: 100.0, description: 'Ціна продукту' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 80.0, description: 'Ціна зі знижкою' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  priceSale: number;

  @ApiProperty({
    type: [ProductImageDto],
    description: 'Зображення продукту',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @ArrayNotEmpty()
  images: ProductImageDto[];

  @ApiProperty({
    type: [ProductTranslationDto],
    description: 'Переклади продукту',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  @ArrayNotEmpty()
  translations: ProductTranslationDto[];

  @ApiProperty({
    type: [CreateProductFeatureDto],
    description: 'Список пунктів опису продукту',
    example: [
      { text: 'Invisible scrunch seam', order: 1 },
      { text: 'No front seam', order: 2 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductFeatureDto)
  features: CreateProductFeatureDto[];

  @ApiProperty({
    enum: ESize,
    isArray: true,
    example: [ESize.S, ESize.M, ESize.L],
    description: 'Доступні розміри продукту',
  })
  @IsArray()
  @IsEnum(ESize, { each: true })
  sizes: ESize[];

  @ApiProperty({
    enum: EColor,
    isArray: true,
    example: [EColor.RED, EColor.BLACK, EColor.BLUE],
    description: 'Доступні кольори продукту',
  })
  @IsArray()
  @IsEnum(EColor, { each: true })
  colors: EColor[];

  @ApiProperty()
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  collectionIds?: number[];
}
