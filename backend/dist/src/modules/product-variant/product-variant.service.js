"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let ProductVariantService = class ProductVariantService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.productVariant.create({
            data: {
                color: dto.color,
                sizes: dto.sizes,
                price: dto.price ?? null,
                priceSale: dto.priceSale ?? null,
                stock: dto.stock ?? 0,
                product: { connect: { id: dto.productId } },
                images: dto.images
                    ? {
                        create: dto.images.map((img) => ({
                            url: img.url,
                            altText: img.altText ?? null,
                            product: { connect: { id: dto.productId } },
                        })),
                    }
                    : undefined,
            },
            include: { images: true, product: true },
        });
    }
    async findAll(productId) {
        return await this.prisma.productVariant.findMany({
            where: productId ? { productId } : {},
            include: { images: true },
        });
    }
    async findOne(id) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id },
            include: { images: true },
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Product variant with ID ${id} not found`);
        }
        return variant;
    }
    async update(id, dto) {
        return await this.prisma.productVariant.update({
            where: { id },
            data: {
                color: dto.color,
                sizes: dto.sizes,
                price: dto.price,
                priceSale: dto.priceSale,
                stock: dto.stock,
                images: dto.images
                    ? {
                        deleteMany: {},
                        create: dto.images.map((img) => ({
                            url: img.url,
                            altText: img.altText,
                            product: { connect: { id: id } },
                        })),
                    }
                    : undefined,
            },
            include: { images: true },
        });
    }
    async remove(id) {
        return await this.prisma.productVariant.delete({
            where: { id },
        });
    }
};
exports.ProductVariantService = ProductVariantService;
exports.ProductVariantService = ProductVariantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductVariantService);
//# sourceMappingURL=product-variant.service.js.map