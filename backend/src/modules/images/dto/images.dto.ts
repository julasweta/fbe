import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUrl, IsString, IsOptional, IsInt } from 'class-validator';

export class ProductImageDto {
  @ApiProperty({
    example: 'https://example.com/image1.jpg',
    description: 'URL зображення',
  })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({
    example: 'Зображення ноутбука',
    description: 'Альтернативний текст',
  })
  @IsString()
  @IsOptional()
  altText?: string;
}

export class CreateProductImageDto {
  @ApiProperty({
    example: 'https://example.com/image1.jpg',
    description: 'URL зображення',
  })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({
    example: 'Зображення ноутбука',
    description: 'Альтернативний текст',
  })
  @IsString()
  @IsOptional()
  altText?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID варіанту продукту (якщо картинка прив’язана до варіанта)',
  })
  @IsInt()
  @IsOptional()
  variantId?: number;

  @ApiProperty({
    example: 1,
    description: 'ID продукту, до якого належить зображення',
  })
  @IsInt()
  productId: number;
}
