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
exports.UpdateCartItemDto = exports.CreateCartItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCartItemDto {
    productId;
    name;
    image;
    color;
    size;
    price;
    priceSale;
    quantity;
}
exports.CreateCartItemDto = CreateCartItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 11, description: 'ID товару' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCartItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Футболка Oversize', description: 'Назва товару' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://cdn.example.com/products/11.jpg',
        description: 'URL картинки товару',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Червоний', description: 'Колір товару' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'L', description: 'Розмір товару' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCartItemDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 799.99, description: 'Ціна товару' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCartItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 699.99, description: 'Акційна ціна' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCartItemDto.prototype, "priceSale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 2,
        description: 'Кількість товару',
        minimum: 1,
        maximum: 99,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(99),
    __metadata("design:type", Number)
], CreateCartItemDto.prototype, "quantity", void 0);
class UpdateCartItemDto {
    quantity;
}
exports.UpdateCartItemDto = UpdateCartItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Кількість товару' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateCartItemDto.prototype, "quantity", void 0);
//# sourceMappingURL=cart-item.dto.js.map