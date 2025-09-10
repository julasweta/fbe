import { CartService } from './cart.service';
import { AddToCartDto } from './dto/cart.dto';
import { Request } from 'express';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getUserCart(req: Request): Promise<({
        items: ({
            product: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                sizes: import("@prisma/client").$Enums.ESize[];
                price: number;
                priceSale: number | null;
                sku: string;
                categoryId: number | null;
                collectionId: number | null;
                colors: import("@prisma/client").$Enums.EColor[];
            };
        } & {
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
        })[];
    } & {
        id: number;
        updatedAt: Date;
        userId: number | null;
        sessionId: string | null;
        guestId: string | null;
    }) | null>;
    addToCart(dto: AddToCartDto): Promise<{
        cartId: number;
        item: {
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
        };
    }>;
    clearCart(req: Request): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
