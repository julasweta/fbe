export declare class ProductImageDto {
    url: string;
    altText?: string;
}
export declare class CreateProductImageDto {
    url: string;
    altText?: string;
    variantId?: number;
    productId: number;
}
