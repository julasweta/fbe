import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUrl, Max, Min } from 'class-validator';


export class CreateCartItemDto {
  @ApiProperty({ example: 11, description: 'ID товару' })
  @IsInt()
  productId: number;

  @ApiProperty({ example: 'Футболка Oversize', description: 'Назва товару' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/products/11.jpg',
    description: 'URL картинки товару',
  })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({ example: 'Червоний', description: 'Колір товару' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'L', description: 'Розмір товару' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ example: 799.99, description: 'Ціна товару' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 699.99, description: 'Акційна ціна' })
  @IsOptional()
  @IsNumber()
  priceSale?: number;

  @ApiProperty({ example: 2, description: 'Кількість товару', minimum: 1, maximum: 99 })
  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 3, description: 'Кількість товару' })
  @IsOptional()
  @IsPositive()
  quantity?: number;
}

