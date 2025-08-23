import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateProductTranslationDto {
  @ApiPropertyOptional({
    example: 'Ноутбук Gaming Pro',
    description: 'Назва продукту',
  })
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Професійний ноутбук для геймерів',
    description: 'Опис продукту',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, description: 'ID мови' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  languageId?: number;
}
