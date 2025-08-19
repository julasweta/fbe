import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  OrderItemDto,
  OrderItemResponseDto,
} from '../../order-item/dto/order-item.dto';
import { OrderStatus } from '@prisma/client';

export enum PaymentMethod {
  COD = 'COD', // оплата при отриманні
  CARD = 'CARD', // оплата карткою онлайн (поки без процесингу)
}

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 42, nullable: true })
  @IsOptional()
  @IsInt()
  userId?: number | null;

  @ApiPropertyOptional({ example: 'Іван Петренко' })
  @ValidateIf((o) => !o.userId)
  @IsString()
  @MinLength(2)
  guestName?: string;

  @ApiPropertyOptional({ example: '+380501234567' })
  @ValidateIf((o) => !o.userId)
  @IsString()
  guestPhone?: string;

  @ApiPropertyOptional({ example: 'guest@example.com' })
  @ValidateIf((o) => !o.userId)
  @IsEmail()
  guestEmail?: string;

  @ApiPropertyOptional({ example: 'м. Київ, вул. Хрещатик, 1' })
  @ValidateIf((o) => !o.userId)
  @IsOptional()
  @IsString()
  guestAddress?: string;

  @ApiProperty({ example: 'Київ' })
  @IsString()
  novaPostCity: string;

  @ApiProperty({ example: 'Відділення №12 (вул. Січових Стрільців, 10)' })
  @IsString()
  novaPostBranch: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.COD })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty()
  @IsInt()
  finalPrice: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  novaPostCity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  novaPostBranch?: string;
}

export class OrderResponseDto {
  @ApiProperty() id: number;

  @ApiPropertyOptional({ nullable: true })
  userId?: number | null;

  @ApiPropertyOptional() guestName?: string | null;
  @ApiPropertyOptional() guestPhone?: string | null;
  @ApiPropertyOptional() guestEmail?: string | null;
  @ApiPropertyOptional() guestAddress?: string | null;

  @ApiProperty() novaPostCity: string;
  @ApiProperty() novaPostBranch: string;

  @ApiProperty({ enum: OrderStatus }) status: OrderStatus;

  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];
}
