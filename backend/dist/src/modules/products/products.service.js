"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const XLSX = __importStar(require("xlsx"));
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const { translations, features, categoryId, collectionId, variants, ...rest } = dto;
        const product = await this.prisma.product.create({
            data: {
                ...rest,
                category: categoryId ? { connect: { id: categoryId } } : undefined,
                collection: collectionId
                    ? { connect: { id: collectionId } }
                    : undefined,
                translations: translations
                    ? {
                        create: translations.map((t) => ({
                            name: t.name,
                            description: t.description ?? null,
                            language: { connect: { id: t.languageId } },
                        })),
                    }
                    : undefined,
                features: features
                    ? {
                        create: features.map((f) => ({
                            text: f.text,
                            order: f.order ?? null,
                        })),
                    }
                    : undefined,
                variants: variants
                    ? {
                        create: variants.map((v) => ({
                            color: v.color,
                            sizes: v.sizes,
                            price: v.price ?? null,
                            priceSale: v.priceSale ?? null,
                            stock: v.stock ?? 0,
                        })),
                    }
                    : undefined,
            },
            include: {
                variants: true,
            },
        });
        if (variants && product.variants) {
            for (let i = 0; i < variants.length; i++) {
                const variantDto = variants[i];
                const createdVariant = product.variants[i];
                if (variantDto.images && variantDto.images.length > 0) {
                    await this.prisma.productImage.createMany({
                        data: variantDto.images.map((img) => ({
                            url: img.url,
                            altText: img.altText ?? null,
                            variantId: createdVariant.id,
                            productId: product.id,
                        })),
                    });
                }
            }
        }
        return this.prisma.product.findUnique({
            where: { id: product.id },
            include: this.defaultInclude(),
        });
    }
    async findAll(params) {
        const limit = params.limit ?? 20;
        const offset = params.page ? (params.page - 1) * limit : (params.skip ?? 0);
        const where = {};
        if (params.category)
            where.category = { slug: params.category };
        if (params.collection)
            where.collection = { slug: params.collection };
        const [data, count] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                skip: offset,
                take: limit,
                where,
                include: this.defaultInclude(),
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data,
            count,
            page: params.page || Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(count / limit),
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: this.defaultInclude(),
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async update(id, dto) {
        const { translations, features, categoryId, collectionId, variants, ...rest } = dto;
        await this.prisma.product.update({
            where: { id },
            data: {
                ...rest,
                category: categoryId !== undefined
                    ? categoryId
                        ? { connect: { id: categoryId } }
                        : { disconnect: true }
                    : undefined,
                collection: collectionId
                    ? { connect: { id: collectionId } }
                    : undefined,
            },
        });
        if (translations && translations.length > 0) {
            await this.prisma.productTranslation.deleteMany({
                where: { productId: id },
            });
            await this.prisma.productTranslation.createMany({
                data: translations.map((t) => ({
                    name: t.name || '',
                    description: t.description ?? null,
                    languageId: t.languageId || 1,
                    productId: id,
                })),
            });
        }
        if (features && features.length > 0) {
            await this.prisma.productFeature.deleteMany({
                where: { productId: id },
            });
            await this.prisma.productFeature.createMany({
                data: features.map((f) => ({
                    text: f.text || '',
                    order: f.order ?? null,
                    productId: id,
                })),
            });
        }
        if (variants) {
            await this.prisma.productImage.deleteMany({
                where: { productId: id },
            });
            await this.prisma.productVariant.deleteMany({
                where: { productId: id },
            });
            if (variants.length > 0) {
                const validVariants = variants.filter((v) => v.color);
                if (validVariants.length > 0) {
                    const createdVariants = await Promise.all(validVariants.map((v) => this.prisma.productVariant.create({
                        data: {
                            product: { connect: { id } },
                            color: v.color,
                            sizes: v.sizes || [],
                            price: v.price ?? null,
                            priceSale: v.priceSale ?? null,
                            stock: v.stock ?? 0,
                            description: v.description ?? null,
                        },
                    })));
                    for (let i = 0; i < validVariants.length; i++) {
                        const variantDto = validVariants[i];
                        const createdVariant = createdVariants[i];
                        if (variantDto.images && variantDto.images.length > 0) {
                            await this.prisma.productImage.createMany({
                                data: variantDto.images.map((img) => ({
                                    url: img.url || '',
                                    altText: img.altText ?? null,
                                    variantId: createdVariant.id,
                                    productId: id,
                                })),
                            });
                        }
                    }
                }
            }
        }
        return this.prisma.product.findUnique({
            where: { id },
            include: this.defaultInclude(),
        });
    }
    async remove(id) {
        await this.prisma.productImage.deleteMany({ where: { productId: id } });
        await this.prisma.productTranslation.deleteMany({
            where: { productId: id },
        });
        await this.prisma.productFeature.deleteMany({ where: { productId: id } });
        await this.prisma.productVariant.deleteMany({ where: { productId: id } });
        await this.prisma.cartItem.deleteMany({ where: { productId: id } });
        await this.prisma.orderItem.deleteMany({ where: { productId: id } });
        return this.prisma.product.delete({ where: { id } });
    }
    defaultInclude() {
        return {
            translations: { include: { language: true } },
            features: true,
            category: true,
            collection: true,
            variants: { include: { images: true } },
        };
    }
    async importProductsFromFile(file) {
        try {
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);
            console.log('Excel rows:', rows);
            const arraysEqualIgnoreOrder = (a, b) => {
                if (a.length !== b.length)
                    return false;
                const sortedA = [...a].sort();
                const sortedB = [...b].sort();
                return sortedA.every((v, i) => v === sortedB[i]);
            };
            for (const [index, row] of rows.entries()) {
                console.log(`\nProcessing row ${index + 1}:`, row);
                const sku = String(row.sku);
                const variantData = {
                    color: row.variantColor,
                    sizes: row.variantSizes?.split(',').map((s) => s.trim()) || [],
                    stock: Number(row.stock ?? row.stock) || 0,
                    price: Number(row.price),
                    priceSale: row.priceSale ? Number(row.priceSale) : null,
                    description: row.description,
                    variantDescription: row.variantDescription,
                    images: row.variantImages
                        ? row.variantImages
                            .split(/\s*\|\s*/)
                            .map((u) => u.trim())
                            .filter((u) => /^https?:\/\//i.test(u))
                            .map((u) => ({ url: u, altText: null }))
                        : [],
                };
                let product = await this.prisma.product.findUnique({
                    where: { sku },
                    include: {
                        variants: { include: { images: true } },
                        translations: true,
                        features: true,
                    },
                });
                if (!product) {
                    console.log('Product does not exist. Creating new product...');
                    try {
                        product = await this.prisma.product.create({
                            data: {
                                sku,
                                price: 0,
                                priceSale: 0,
                                category: row.categoryId
                                    ? { connect: { id: Number(row.categoryId) } }
                                    : undefined,
                                collection: row.collectionId
                                    ? { connect: { id: Number(row.collectionId) } }
                                    : undefined,
                                translations: row.name
                                    ? {
                                        create: [
                                            {
                                                name: row.name,
                                                description: row.description || null,
                                                language: { connect: { id: 1 } },
                                            },
                                        ],
                                    }
                                    : undefined,
                                features: row.features
                                    ? {
                                        create: row.features.split('|').map((feature, index) => ({
                                            text: feature.trim(),
                                            order: index + 1,
                                        })),
                                    }
                                    : undefined,
                                variants: {
                                    create: [
                                        {
                                            color: variantData.color,
                                            sizes: variantData.sizes,
                                            price: variantData.price,
                                            priceSale: variantData.priceSale,
                                            stock: variantData.stock,
                                            description: variantData.variantDescription,
                                        },
                                    ],
                                },
                            },
                            include: {
                                variants: { include: { images: true } },
                                translations: true,
                                features: true,
                            },
                        });
                        console.log('Created product:', product.sku, 'with id:', product.id);
                    }
                    catch (error) {
                        console.error('Error creating product:', error);
                        continue;
                    }
                }
                else {
                    console.log('Product exists. Updating...');
                    try {
                        product = await this.prisma.product.update({
                            where: { id: product.id },
                            data: {
                                category: row.categoryId
                                    ? { connect: { id: Number(row.categoryId) } }
                                    : undefined,
                                collection: row.collectionId
                                    ? { connect: { id: Number(row.collectionId) } }
                                    : undefined,
                                translations: row.name
                                    ? {
                                        upsert: {
                                            where: {
                                                productId_languageId: {
                                                    productId: product.id,
                                                    languageId: 1,
                                                },
                                            },
                                            update: {
                                                name: row.name,
                                                description: row.description || null,
                                            },
                                            create: {
                                                name: row.name,
                                                description: row.description || null,
                                                language: { connect: { id: 1 } },
                                            },
                                        },
                                    }
                                    : undefined,
                                features: row.features
                                    ? {
                                        deleteMany: {},
                                        create: row.features.split('|').map((feature, index) => ({
                                            text: feature.trim(),
                                            order: index + 1,
                                        })),
                                    }
                                    : undefined,
                            },
                            include: {
                                variants: { include: { images: true } },
                                translations: true,
                                features: true,
                            },
                        });
                        console.log('Updated product:', product.id);
                    }
                    catch (error) {
                        console.error('Error updating product:', error);
                    }
                }
                if (!product)
                    continue;
                let existingVariant = product.variants.find((v) => v.color === variantData.color &&
                    arraysEqualIgnoreOrder(v.sizes, variantData.sizes));
                if (existingVariant) {
                    console.log('Updating existing variant:', existingVariant.id);
                    try {
                        existingVariant = await this.prisma.productVariant.update({
                            where: { id: existingVariant.id },
                            data: {
                                stock: variantData.stock,
                                price: variantData.price,
                                priceSale: variantData.priceSale,
                                description: variantData.variantDescription,
                            },
                            include: { images: true },
                        });
                    }
                    catch (error) {
                        console.error('Error updating variant:', error);
                    }
                }
                else {
                    console.log('Creating new variant for product:', sku);
                    try {
                        existingVariant = await this.prisma.productVariant.create({
                            data: {
                                productId: product.id,
                                color: variantData.color,
                                sizes: variantData.sizes,
                                price: variantData.price,
                                priceSale: variantData.priceSale,
                                stock: variantData.stock,
                                description: variantData.variantDescription,
                            },
                            include: { images: true },
                        });
                        console.log('Created variant id:', existingVariant.id);
                    }
                    catch (error) {
                        console.error('Error creating variant:', error);
                        continue;
                    }
                }
                if (variantData.images.length > 0) {
                    try {
                        const existingImageUrls = existingVariant.images?.map((img) => img.url) || [];
                        const newImages = variantData.images.filter((img) => !existingImageUrls.includes(img.url));
                        if (newImages.length > 0) {
                            await this.prisma.productImage.createMany({
                                data: newImages.map((img) => ({
                                    url: img.url,
                                    altText: img.altText,
                                    variantId: existingVariant.id,
                                    productId: product.id,
                                })),
                            });
                            console.log('Added new images for variant');
                        }
                    }
                    catch (error) {
                        console.error('Error creating images:', error);
                    }
                }
            }
            console.log('\nImport finished successfully!');
            try {
                const products = await this.prisma.product.findMany({
                    include: { variants: true },
                });
                for (const product of products) {
                    if (product.variants.length > 0) {
                        const prices = product.variants
                            .map((v) => v.price)
                            .filter((p) => p !== null && p > 0);
                        const salePrices = product.variants
                            .map((v) => v.priceSale)
                            .filter((p) => p !== null && p > 0);
                        if (prices.length > 0) {
                            const minPrice = Math.min(...prices);
                            const minSalePrice = salePrices.length > 0 ? Math.min(...salePrices) : null;
                            await this.prisma.product.update({
                                where: { id: product.id },
                                data: { price: minPrice, priceSale: minSalePrice },
                            });
                            console.log(`Updated product ${product.sku} base price to ${minPrice}`);
                        }
                    }
                }
            }
            catch (error) {
                console.error('Error updating product base prices:', error);
            }
        }
        catch (error) {
            console.error('Unexpected error during import:', error);
            throw error;
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map