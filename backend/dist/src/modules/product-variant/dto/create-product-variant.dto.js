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
exports.CreateProductVariantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const images_dto_1 = require("../../images/dto/images.dto");
class CreateProductVariantDto {
    productId;
    color;
    sizes;
    price;
    priceSale;
    stock;
    images;
    description;
}
exports.CreateProductVariantDto = CreateProductVariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID продукту' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BLACK', enum: client_1.EColor, description: 'Колір' }),
    (0, class_validator_1.IsEnum)(client_1.EColor),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['S', 'M', 'L'],
        enum: client_1.ESize,
        isArray: true,
        description: 'Доступні розміри',
    }),
    (0, class_validator_1.IsEnum)(client_1.ESize, { each: true }),
    __metadata("design:type", Array)
], CreateProductVariantDto.prototype, "sizes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, description: 'Ціна' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 900,
        description: 'Ціна зі знижкою',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "priceSale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15, description: 'Загальна кількість на складі' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [images_dto_1.ProductImageDto],
        description: 'Масив зображень для варіанту',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => images_dto_1.ProductImageDto),
    __metadata("design:type", Array)
], CreateProductVariantDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "description", void 0);
//# sourceMappingURL=create-product-variant.dto.js.map