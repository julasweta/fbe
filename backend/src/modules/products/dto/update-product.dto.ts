import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductFeatureDto } from '../../product-feature/dto/create-product-feature.dto';
import { CreateProductTranslationDto } from '../../product-translations/dto/product-translation.dto';
import { CreateProductVariantDto } from '../../product-variant/dto/create-product-variant.dto';

export class UpdateProductDto {
  // інші поля...

  @ApiPropertyOptional({
    type: [CreateProductFeatureDto], // замість UpdateProductFeatureDto
    description: 'Оновлення пунктів опису продукту (повне перезаписування)',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductFeatureDto)
  @IsOptional()
  features?: CreateProductFeatureDto[];

  @ApiProperty()
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty()
  @IsOptional()
  collectionId?: number;

  @ApiProperty({ type: [CreateProductTranslationDto] })
  translations: CreateProductTranslationDto[];

  @ApiProperty({ type: [CreateProductVariantDto] })
  variants: CreateProductVariantDto[];
}
