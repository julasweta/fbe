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
exports.ProductTranslationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let ProductTranslationsService = class ProductTranslationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return await this.prisma.productTranslation.create({ data });
    }
    async findAll() {
        return await this.prisma.productTranslation.findMany({
            include: { product: true, language: true },
        });
    }
    async findOne(id) {
        const translation = await this.prisma.productTranslation.findUnique({
            where: { id },
            include: { product: true, language: true },
        });
        if (!translation)
            throw new common_1.NotFoundException('Translation not found');
        return translation;
    }
    async update(id, data) {
        return await this.prisma.productTranslation.update({ where: { id }, data });
    }
    async remove(id) {
        return await this.prisma.productTranslation.delete({ where: { id } });
    }
};
exports.ProductTranslationsService = ProductTranslationsService;
exports.ProductTranslationsService = ProductTranslationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductTranslationsService);
//# sourceMappingURL=product-translations.service.js.map