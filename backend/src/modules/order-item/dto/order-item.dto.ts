import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class OrderItemDto {
  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  productId?: number;

  @ApiProperty({ example: 2 })
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 199.99 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 159.99 })
  @IsPositive()
  finalPrice: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priceSale?: number;



}

export class OrderItemResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() productId: number;
  @ApiProperty() name: string;
  @ApiPropertyOptional() image?: string | null;
  @ApiProperty() price: number;
  @ApiProperty() quantity: number;

}


