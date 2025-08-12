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
} from 'class-validator';
import { ProductImageDto } from '../../images/dto/images.dto';
import { ProductTranslationDto } from '../../product-translations/dto/product-translation.dto';
import { CreateProductFeatureDto } from '../../product-feature/dto/create-product-feature.dto';
import { ESize, EColor } from '@prisma/client';

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
}
