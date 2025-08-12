import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({ example: 'Summer Collection', description: 'Назва колекції' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Колекція літнього одягу', description: 'Опис колекції' })
  @IsOptional()
  @IsString()
  description?: string;
}
