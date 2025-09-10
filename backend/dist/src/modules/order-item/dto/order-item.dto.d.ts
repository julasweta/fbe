export declare class OrderItemDto {
    productId?: number;
    quantity: number;
    price: number;
    finalPrice: number;
    name: string;
    image?: string;
    color?: string;
    size?: string;
    priceSale?: number;
}
export declare class OrderItemResponseDto {
    id: number;
    productId: number;
    name: string;
    image?: string | null;
    price: number;
    quantity: number;
}
