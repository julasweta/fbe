import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateProductFeatureDto {
  @ApiProperty({ example: 'Invisible scrunch seam' })
  @IsString()
  @MinLength(1)
  text: string;

  @ApiProperty({ example: 'Invisible scrunch seam' })
  @IsString()
  @MinLength(1)
  @IsOptional()
  textEn: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  order?: number;
}
