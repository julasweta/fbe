import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MinLength, IsOptional, IsNumber, IsPositive } from "class-validator";

export class ProductTranslationDto {
  @ApiProperty({ example: 'Ноутбук Gaming', description: 'Назва продукту' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ example: 'Потужний ноутбук для роботи та ігор', description: 'Опис продукту' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, description: 'ID мови' })
  @IsNumber()
  @IsPositive()
  languageId: number;
}

export class CreateProductTranslationDto extends ProductTranslationDto { }