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
exports.UpdateProductDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const update_product_translation_dto_1 = require("../../product-translations/dto/update-product-translation.dto");
const update_product_feature_dto_1 = require("../../product-feature/dto/update-product-feature.dto");
class UpdateProductVariantDto {
    color;
    sizes;
    price;
    priceSale;
    stock;
    description;
    images;
    productId;
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.EColor }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductVariantDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.ESize, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateProductVariantDto.prototype, "sizes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateProductVariantDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateProductVariantDto.prototype, "priceSale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateProductVariantDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductVariantDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateProductVariantDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateProductVariantDto.prototype, "productId", void 0);
class UpdateProductDto {
    sku;
    price;
    priceSale;
    categoryId;
    collectionId;
    translations;
    features;
    variants;
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: 80.0,
        description: 'Ціна зі знижкою',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "priceSale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "collectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [update_product_translation_dto_1.UpdateProductTranslationDto], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => update_product_translation_dto_1.UpdateProductTranslationDto),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "translations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [update_product_feature_dto_1.UpdateProductFeatureDto], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => update_product_feature_dto_1.UpdateProductFeatureDto),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UpdateProductVariantDto], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateProductVariantDto),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "variants", void 0);
//# sourceMappingURL=update-product.dto.js.map