import { ProductImageService } from './product-image.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
export declare class ProductImageController {
    private readonly service;
    constructor(service: ProductImageService);
    create(dto: CreateProductImageDto): Promise<{
        id: number;
        url: string;
        altText: string | null;
        variantId: number | null;
        productId: number;
    }>;
    findAll(variantId: string): Promise<{
        id: number;
        url: string;
        altText: string | null;
        variantId: number | null;
        productId: number;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        url: string;
        altText: string | null;
        variantId: number | null;
        productId: number;
    }>;
    update(id: string, dto: UpdateProductImageDto): Promise<{
        id: number;
        url: string;
        altText: string | null;
        variantId: number | null;
        productId: number;
    }>;
    remove(id: string): Promise<{
        id: number;
        url: string;
        altText: string | null;
        variantId: number | null;
        productId: number;
    }>;
}
