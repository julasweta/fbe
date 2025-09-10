import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class ProductTranslationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ProductTranslationCreateInput): Promise<{
        id: number;
        description: string | null;
        name: string;
        languageId: number;
        productId: number;
    }>;
    findAll(): Promise<({
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
        language: {
            id: number;
            name: string;
            code: string;
        };
    } & {
        id: number;
        description: string | null;
        name: string;
        languageId: number;
        productId: number;
    })[]>;
    findOne(id: number): Promise<{
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
        language: {
            id: number;
            name: string;
            code: string;
        };
    } & {
        id: number;
        description: string | null;
        name: string;
        languageId: number;
        productId: number;
    }>;
    update(id: number, data: Prisma.ProductTranslationUpdateInput): Promise<{
        id: number;
        description: string | null;
        name: string;
        languageId: number;
        productId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        description: string | null;
        name: string;
        languageId: number;
        productId: number;
    }>;
}
