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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantController = void 0;
const common_1 = require("@nestjs/common");
const product_variant_service_1 = require("./product-variant.service");
const create_product_variant_dto_1 = require("./dto/create-product-variant.dto");
const update_product_variant_dto_1 = require("./dto/update-product-variant.dto");
const swagger_1 = require("@nestjs/swagger");
let ProductVariantController = class ProductVariantController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        if (!dto.productId) {
            throw new common_1.BadRequestException('productId обов’язковий для створення варіанту');
        }
        return this.service.create(dto);
    }
    findAll(productId) {
        return this.service.findAll(productId ? Number(productId) : undefined);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, data) {
        return this.service.update(id, data);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.ProductVariantController = ProductVariantController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Створити варіант продукту' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Варіант створено' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_variant_dto_1.CreateProductVariantDto]),
    __metadata("design:returntype", void 0)
], ProductVariantController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Отримати всі варіанти (опціонально по productId)' }),
    __param(0, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductVariantController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Отримати варіант за ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductVariantController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Оновити варіант продукту' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_product_variant_dto_1.UpdateProductVariantDto]),
    __metadata("design:returntype", void 0)
], ProductVariantController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Видалити варіант продукту' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductVariantController.prototype, "remove", null);
exports.ProductVariantController = ProductVariantController = __decorate([
    (0, swagger_1.ApiTags)('Product Variants'),
    (0, common_1.Controller)('product-variants'),
    __metadata("design:paramtypes", [product_variant_service_1.ProductVariantService])
], ProductVariantController);
//# sourceMappingURL=product-variant.controller.js.map