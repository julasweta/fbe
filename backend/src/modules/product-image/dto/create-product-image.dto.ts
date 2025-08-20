import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ example: 'https://site.com/image.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 'Фронтальний вигляд', required: false })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  variantId: number;

  @ApiProperty()
  productId: number; // 👈 обовʼязковий
}
