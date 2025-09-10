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
exports.CartItemController = void 0;
const common_1 = require("@nestjs/common");
const cart_item_service_1 = require("./cart-item.service");
const jwt_auth_guard_1 = require("../../guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const cart_item_dto_1 = require("./dto/cart-item.dto");
let CartItemController = class CartItemController {
    cartItemService;
    constructor(cartItemService) {
        this.cartItemService = cartItemService;
    }
    updateCartItem(id, dto) {
        return this.cartItemService.updateCartItem(id, dto);
    }
    removeCartItem(id) {
        return this.cartItemService.removeCartItem(id);
    }
};
exports.CartItemController = CartItemController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Оновити товар у кошику' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, cart_item_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", void 0)
], CartItemController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Видалити товар з кошика' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CartItemController.prototype, "removeCartItem", null);
exports.CartItemController = CartItemController = __decorate([
    (0, common_1.Controller)('cart-item'),
    __metadata("design:paramtypes", [cart_item_service_1.CartItemService])
], CartItemController);
//# sourceMappingURL=cart-item.controller.js.map