import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUrl, IsString, IsOptional } from 'class-validator';

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

export class CreateProductImageDto extends ProductImageDto {}
