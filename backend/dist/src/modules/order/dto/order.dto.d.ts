import { OrderItemDto, OrderItemResponseDto } from '../../order-item/dto/order-item.dto';
import { OrderStatus } from '@prisma/client';
export declare enum PaymentMethod {
    COD = "COD",
    CARD = "CARD"
}
export declare class CreateOrderDto {
    userId?: number | null;
    guestName?: string;
    guestPhone?: string;
    guestEmail?: string;
    guestAddress?: string;
    novaPostCity: string;
    novaPostBranch: string;
    paymentMethod: PaymentMethod;
    items: OrderItemDto[];
    finalPrice: number;
}
declare const UpdateOrderDto_base: import("@nestjs/common").Type<Partial<CreateOrderDto>>;
export declare class UpdateOrderDto extends UpdateOrderDto_base {
    status?: OrderStatus;
    paymentMethod?: PaymentMethod;
    novaPostCity?: string;
    novaPostBranch?: string;
}
export declare class OrderResponseDto {
    id: number;
    userId?: number | null;
    guestName?: string | null;
    guestPhone?: string | null;
    guestEmail?: string | null;
    guestAddress?: string | null;
    novaPostCity: string;
    novaPostBranch: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    items: OrderItemResponseDto[];
}
export {};
