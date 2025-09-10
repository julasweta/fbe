import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateCartItemDto } from './dto/cart-item.dto';
export declare class CartItemService {
    private prisma;
    constructor(prisma: PrismaService);
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
