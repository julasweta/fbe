import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCollectionDto {
  @ApiProperty({ example: 'Summer Collection', description: 'Назва колекції' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Колекція літнього одягу',
    description: 'Опис колекції',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'summer-collection', description: 'Slug для SEO' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL зображення колекції',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
