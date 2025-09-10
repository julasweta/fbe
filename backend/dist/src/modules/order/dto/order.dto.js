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
exports.OrderResponseDto = exports.UpdateOrderDto = exports.CreateOrderDto = exports.PaymentMethod = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const order_item_dto_1 = require("../../order-item/dto/order-item.dto");
const client_1 = require("@prisma/client");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["COD"] = "COD";
    PaymentMethod["CARD"] = "CARD";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
class CreateOrderDto {
    userId;
    guestName;
    guestPhone;
    guestEmail;
    guestAddress;
    novaPostCity;
    novaPostBranch;
    paymentMethod;
    items;
    finalPrice;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 42, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateOrderDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Іван Петренко' }),
    (0, class_validator_1.ValidateIf)((o) => !o.userId),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "guestName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+380501234567' }),
    (0, class_validator_1.ValidateIf)((o) => !o.userId),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "guestPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'guest@example.com' }),
    (0, class_validator_1.ValidateIf)((o) => !o.userId),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "guestEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'м. Київ, вул. Хрещатик, 1' }),
    (0, class_validator_1.ValidateIf)((o) => !o.userId),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "guestAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Київ' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "novaPostCity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Відділення №12 (вул. Січових Стрільців, 10)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "novaPostBranch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PaymentMethod, example: PaymentMethod.COD }),
    (0, class_validator_1.IsEnum)(PaymentMethod),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [order_item_dto_1.OrderItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => order_item_dto_1.OrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "finalPrice", void 0);
class UpdateOrderDto extends (0, swagger_1.PartialType)(CreateOrderDto) {
    status;
    paymentMethod;
    novaPostCity;
    novaPostBranch;
}
exports.UpdateOrderDto = UpdateOrderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.OrderStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.OrderStatus),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: PaymentMethod }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PaymentMethod),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "novaPostCity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "novaPostBranch", void 0);
class OrderResponseDto {
    id;
    userId;
    guestName;
    guestPhone;
    guestEmail;
    guestAddress;
    novaPostCity;
    novaPostBranch;
    status;
    createdAt;
    updatedAt;
    items;
}
exports.OrderResponseDto = OrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "guestName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "guestPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "guestEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "guestAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "novaPostCity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "novaPostBranch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.OrderStatus }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [order_item_dto_1.OrderItemResponseDto] }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "items", void 0);
//# sourceMappingURL=order.dto.js.map