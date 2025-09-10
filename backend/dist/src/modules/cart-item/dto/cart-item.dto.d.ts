export declare class CreateCartItemDto {
    productId: number;
    name: string;
    image?: string;
    color?: string;
    size?: string;
    price: number;
    priceSale?: number;
    quantity: number;
}
export declare class UpdateCartItemDto {
    quantity?: number;
}
