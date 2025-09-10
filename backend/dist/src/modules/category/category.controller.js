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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const swagger_1 = require("@nestjs/swagger");
let CategoryController = class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    create(dto) {
        return this.categoryService.create(dto);
    }
    findAll() {
        return this.categoryService.findAll();
    }
    findOne(id) {
        return this.categoryService.findOne(id);
    }
    update(id, data) {
        return this.categoryService.update(id, data);
    }
    remove(id) {
        return this.categoryService.remove(id);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Створити категорію' }),
    (0, swagger_1.ApiBody)({ type: create_category_dto_1.CreateCategoryDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Категорія створена успішно' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Отримати всі категорії' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список категорій',
        isArray: true,
        type: create_category_dto_1.CreateCategoryDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Отримати категорію за id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID категорії' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Категорія знайдена',
        type: create_category_dto_1.CreateCategoryDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Категорія не знайдена' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Edit category by id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID категорії' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Категорія знайдена',
        type: create_category_dto_1.CreateCategoryDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Категорія не знайдена' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Видалити категорію за id' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID категорії' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Категорія видалена' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Категорія не знайдена' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "remove", null);
exports.CategoryController = CategoryController = __decorate([
    (0, swagger_1.ApiTags)('categories'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map