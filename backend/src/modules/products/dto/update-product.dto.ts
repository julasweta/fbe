import { IsOptional, IsString, IsNumber, ValidateNested,  IsPositive, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { EColor, ESize } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateProductTranslationDto } from '../../product-translations/dto/update-product-translation.dto';
import { UpdateProductFeatureDto } from '../../product-feature/dto/update-product-feature.dto';

class UpdateProductVariantDto {
  @ApiProperty({ required: false, enum: EColor })
  @IsOptional()
  color?: EColor;

  @ApiProperty({ required: false, enum: ESize, isArray: true })
  @IsOptional()
  sizes?: ESize[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  priceSale?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  stock?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  images?: any[]; // можете замінити на правильний тип для зображень

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  productId?: number;
}

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @ApiProperty({ required: false, example: 80.0, description: 'Ціна зі знижкою' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  priceSale?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  collectionId?: number;

  @ApiProperty({ type: [UpdateProductTranslationDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductTranslationDto)
  translations?: UpdateProductTranslationDto[];

  @ApiProperty({ type: [UpdateProductFeatureDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductFeatureDto)
  features?: UpdateProductFeatureDto[];

  @ApiProperty({ type: [UpdateProductVariantDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductVariantDto)
  variants?: UpdateProductVariantDto[];
}