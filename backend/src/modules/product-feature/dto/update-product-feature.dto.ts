import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdateProductFeatureDto {
  @ApiPropertyOptional({
    example: 'Invisible scrunch seam',
    description: 'Окремий пункт опису товару',
  })
  @IsString()
  @MinLength(1)
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({ example: 1, description: 'Порядок відображення' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  order?: number;
}
