import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductFeatureDto } from '../../product-feature/dto/create-product-feature.dto';

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

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsArray()
  collectionIds?: number[];
}
