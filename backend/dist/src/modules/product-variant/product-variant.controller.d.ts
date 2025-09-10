import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
export declare class ProductVariantController {
    private readonly service;
    constructor(service: ProductVariantService);
    create(dto: CreateProductVariantDto): Promise<{
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
        images: {
            id: number;
            url: string;
            altText: string | null;
            variantId: number | null;
            productId: number;
        }[];
    } & {
        id: number;
        description: string | null;
        productId: number;
        color: import("@prisma/client").$Enums.EColor;
        sizes: import("@prisma/client").$Enums.ESize[];
        price: number | null;
        priceSale: number | null;
        stock: number;
    }>;
    findAll(productId?: string): Promise<({
        images: {
            id: number;
            url: string;
            altText: string | null;
            variantId: number | null;
            productId: number;
        }[];
    } & {
        id: number;
        description: string | null;
        productId: number;
        color: import("@prisma/client").$Enums.EColor;
        sizes: import("@prisma/client").$Enums.ESize[];
        price: number | null;
        priceSale: number | null;
        stock: number;
    })[]>;
    findOne(id: number): Promise<{
        images: {
            id: number;
            url: string;
            altText: string | null;
            variantId: number | null;
            productId: number;
        }[];
    } & {
        id: number;
        description: string | null;
        productId: number;
        color: import("@prisma/client").$Enums.EColor;
        sizes: import("@prisma/client").$Enums.ESize[];
        price: number | null;
        priceSale: number | null;
        stock: number;
    }>;
    update(id: number, data: UpdateProductVariantDto): Promise<{
        images: {
            id: number;
            url: string;
            altText: string | null;
            variantId: number | null;
            productId: number;
        }[];
    } & {
        id: number;
        description: string | null;
        productId: number;
        color: import("@prisma/client").$Enums.EColor;
        sizes: import("@prisma/client").$Enums.ESize[];
        price: number | null;
        priceSale: number | null;
        stock: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        description: string | null;
        productId: number;
        color: import("@prisma/client").$Enums.EColor;
        sizes: import("@prisma/client").$Enums.ESize[];
        price: number | null;
        priceSale: number | null;
        stock: number;
    }>;
}
