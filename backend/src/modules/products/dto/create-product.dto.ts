import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  ValidateNested,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { CreateProductTranslationDto } from '../../product-translations/dto/product-translation.dto';
import { CreateProductFeatureDto } from '../../product-feature/dto/create-product-feature.dto';
import { CreateProductVariantDto } from '../../product-variant/dto/create-product-variant.dto';
import { Type } from 'class-transformer';

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
  ORANGE = 'ORANGE',
  PURPLE = 'PURPLE',
  PINK = 'PINK',
}

export class CreateProductDto {
  /* @ApiProperty()
    @IsOptional()
  id?: number;  */

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 80.0, description: 'Ціна зі знижкою' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  priceSale?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty()
  @IsOptional()
  collectionId?: number;

  @ApiProperty({ type: [CreateProductTranslationDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateProductTranslationDto)
  translations: CreateProductTranslationDto[];

  @ApiProperty({ type: [CreateProductFeatureDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateProductFeatureDto)
  features: CreateProductFeatureDto[];

  @ApiProperty({ type: [CreateProductVariantDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}
