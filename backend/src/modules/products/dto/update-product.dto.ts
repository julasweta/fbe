import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MinLength, IsOptional, IsNumber, IsPositive } from "class-validator";

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'SKU-12345', description: 'Унікальний код продукту' })
  @IsString()
  @MinLength(1)
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ example: 100.00, description: 'Ціна продукту' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 80.00, description: 'Ціна зі знижкою' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  priceSale?: number;
}
