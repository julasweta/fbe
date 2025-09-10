import { CartItemService } from './cart-item.service';
import { UpdateCartItemDto } from './dto/cart-item.dto';
export declare class CartItemController {
    private readonly cartItemService;
    constructor(cartItemService: CartItemService);
    updateCartItem(id: number, dto: UpdateCartItemDto): Promise<{
        id: number;
        size: string | null;
        name: string;
        productId: number;
        color: string | null;
        price: number;
        priceSale: number | null;
        image: string | null;
        quantity: number;
        cartId: number;
    }>;
    removeCartItem(id: number): Promise<{
        id: number;
        size: string | null;
        name: string;
        productId: number;
        color: string | null;
        price: number;
        priceSale: number | null;
        image: string | null;
        quantity: number;
        cartId: number;
    }>;
}
