import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Dress', description: 'Name Category' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiProperty({ example: 'dress', description: 'Slug for SEO' })
  @IsOptional()
  @IsString()
  slug?: string;
}
