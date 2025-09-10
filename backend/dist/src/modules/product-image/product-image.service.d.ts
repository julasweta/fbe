import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductImageDto } from '../images/dto/images.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
export declare class ProductImageService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductImageDto): Promise<{
        id: number;
        url: string;
        altText: string | null;
        variantId: number | null;
        productId: number;
    }>;
    findAllByVariant(variantId: number): Promise<{
        id: number;
        url: string;
        altText: string | null;
        variantId: number | null;
        productId: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        url: string;
        altText: string | null;
        variantId: number | null;
        productId: number;
    }>;
    update(id: number, dto: UpdateProductImageDto): Promise<{
        id: number;
        url: string;
        altText: string | null;
        variantId: number | null;
        productId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        url: string;
        altText: string | null;
        variantId: number | null;
        productId: number;
    }>;
}
