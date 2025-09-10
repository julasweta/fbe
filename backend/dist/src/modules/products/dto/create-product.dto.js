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
exports.CreateProductDto = exports.EColor = exports.ESize = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const product_translation_dto_1 = require("../../product-translations/dto/product-translation.dto");
const create_product_feature_dto_1 = require("../../product-feature/dto/create-product-feature.dto");
const create_product_variant_dto_1 = require("../../product-variant/dto/create-product-variant.dto");
const class_transformer_1 = require("class-transformer");
var ESize;
(function (ESize) {
    ESize["XS"] = "XS";
    ESize["S"] = "S";
    ESize["M"] = "M";
    ESize["L"] = "L";
    ESize["XL"] = "XL";
    ESize["XXL"] = "XXL";
})(ESize || (exports.ESize = ESize = {}));
var EColor;
(function (EColor) {
    EColor["RED"] = "RED";
    EColor["BLUE"] = "BLUE";
    EColor["BLACK"] = "BLACK";
    EColor["WHITE"] = "WHITE";
    EColor["GREEN"] = "GREEN";
    EColor["YELLOW"] = "YELLOW";
    EColor["ORANGE"] = "ORANGE";
    EColor["PURPLE"] = "PURPLE";
    EColor["PINK"] = "PINK";
})(EColor || (exports.EColor = EColor = {}));
class CreateProductDto {
    sku;
    price;
    priceSale;
    categoryId;
    collectionId;
    translations;
    features;
    variants;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 80.0, description: 'Ціна зі знижкою' }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "priceSale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "collectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [product_translation_dto_1.CreateProductTranslationDto] }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => product_translation_dto_1.CreateProductTranslationDto),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "translations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [create_product_feature_dto_1.CreateProductFeatureDto] }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_product_feature_dto_1.CreateProductFeatureDto),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [create_product_variant_dto_1.CreateProductVariantDto] }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_product_variant_dto_1.CreateProductVariantDto),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "variants", void 0);
//# sourceMappingURL=create-product.dto.js.map