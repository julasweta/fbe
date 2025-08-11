import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, MinLength, IsNumber, IsPositive, IsArray, ValidateNested, ArrayNotEmpty } from "class-validator";
import { ProductImageDto } from "../../images/dto/images.dto";
import { ProductTranslationDto } from "../../product-translations/dto/product-translation.dto";

export class CreateProductDto {
  @ApiProperty({ example: 'SKU-12345', description: 'Унікальний код продукту' })
  @IsString()
  @MinLength(1)
  sku: string;

  @ApiProperty({ example: 100.00, description: 'Ціна продукту' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 80.00, description: 'Ціна зі знижкою' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  priceSale: number;

  @ApiProperty({
    type: [ProductImageDto],
    description: 'Зображення продукту',
    example: [
      { url: 'https://example.com/image1.jpg', altText: 'Зображення 1' }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @ArrayNotEmpty()
  images: ProductImageDto[];

  @ApiProperty({
    type: [ProductTranslationDto],
    description: 'Переклади продукту',
    example: [
      {
        name: 'Ноутбук',
        description: 'Потужний ноутбук для роботи та ігор',
        languageId: 1
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  @ArrayNotEmpty()
  translations: ProductTranslationDto[];
}
