import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({ example: 'uk', description: 'Код мови (ISO 639-1)' })
  @IsString()
  @MinLength(2)
  code: string;

  @ApiProperty({ example: 'Українська', description: 'Назва мови' })
  @IsString()
  @MinLength(1)
  name: string;
}

export class UpdateLanguageDto {
  @ApiPropertyOptional({ example: 'uk', description: 'Код мови (ISO 639-1)' })
  @IsString()
  @MinLength(2)
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ example: 'Українська', description: 'Назва мови' })
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;
}
