import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductDto): Promise<({
        collection: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string | null;
            imageUrl: string | null;
        } | null;
        category: {
            id: number;
            name: string;
            slug: string | null;
            parentId: number | null;
            imageUrl: string | null;
        } | null;
        translations: ({
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
        })[];
        features: {
            order: number | null;
            id: number;
            text: string;
            productId: number;
        }[];
        variants: ({
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
        })[];
    } & {
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
    }) | null>;
    findAll(params: {
        limit?: number;
        skip?: number;
        page?: number;
        category?: string;
        collection?: string;
    }): Promise<{
        data: ({
            collection: {
                id: number;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string | null;
                imageUrl: string | null;
            } | null;
            category: {
                id: number;
                name: string;
                slug: string | null;
                parentId: number | null;
                imageUrl: string | null;
            } | null;
            translations: ({
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
            })[];
            features: {
                order: number | null;
                id: number;
                text: string;
                productId: number;
            }[];
            variants: ({
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
            })[];
        } & {
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
        })[];
        count: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        collection: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string | null;
            imageUrl: string | null;
        } | null;
        category: {
            id: number;
            name: string;
            slug: string | null;
            parentId: number | null;
            imageUrl: string | null;
        } | null;
        translations: ({
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
        })[];
        features: {
            order: number | null;
            id: number;
            text: string;
            productId: number;
        }[];
        variants: ({
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
        })[];
    } & {
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
    }>;
    update(id: number, dto: UpdateProductDto): Promise<({
        collection: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string | null;
            imageUrl: string | null;
        } | null;
        category: {
            id: number;
            name: string;
            slug: string | null;
            parentId: number | null;
            imageUrl: string | null;
        } | null;
        translations: ({
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
        })[];
        features: {
            order: number | null;
            id: number;
            text: string;
            productId: number;
        }[];
        variants: ({
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
        })[];
    } & {
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
    }) | null>;
    remove(id: number): Promise<{
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
    }>;
    private defaultInclude;
    importProductsFromFile(file: Express.Multer.File): Promise<void>;
}
