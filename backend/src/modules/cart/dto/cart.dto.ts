import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, ValidateNested} from 'class-validator';
import { CreateCartItemDto } from '../../cart-item/dto/cart-item.dto';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ApiProperty({ example: 1 })
  @IsInt()
    @IsOptional()
  userId?: number;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID сесії гостя' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({ type: [CreateCartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCartItemDto)
  items: CreateCartItemDto[];
}


