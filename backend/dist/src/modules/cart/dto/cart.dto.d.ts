import { CreateCartItemDto } from '../../cart-item/dto/cart-item.dto';
export declare class AddToCartDto {
    userId?: number;
    sessionId?: string;
    item: CreateCartItemDto;
}
