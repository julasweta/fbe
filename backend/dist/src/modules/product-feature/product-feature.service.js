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
exports.ProductFeaturesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let ProductFeaturesService = class ProductFeaturesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(productId, dto) {
        return await this.prisma.productFeature.create({
            data: {
                productId,
                text: dto.text,
                order: dto.order,
            },
        });
    }
    async findAll(productId) {
        return await this.prisma.productFeature.findMany({
            where: { productId },
            orderBy: { order: 'asc' },
        });
    }
    async findOne(id) {
        const feature = await this.prisma.productFeature.findUnique({
            where: { id },
        });
        if (!feature)
            throw new common_1.NotFoundException('Feature not found');
        return feature;
    }
    async update(id, dto) {
        return await this.prisma.productFeature.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        return await this.prisma.productFeature.delete({ where: { id } });
    }
};
exports.ProductFeaturesService = ProductFeaturesService;
exports.ProductFeaturesService = ProductFeaturesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductFeaturesService);
//# sourceMappingURL=product-feature.service.js.map