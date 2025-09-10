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
exports.UpdateLanguageDto = exports.CreateLanguageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateLanguageDto {
    code;
    name;
}
exports.CreateLanguageDto = CreateLanguageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uk', description: 'Код мови (ISO 639-1)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateLanguageDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Українська', description: 'Назва мови' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateLanguageDto.prototype, "name", void 0);
class UpdateLanguageDto {
    code;
    name;
}
exports.UpdateLanguageDto = UpdateLanguageDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uk', description: 'Код мови (ISO 639-1)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLanguageDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Українська', description: 'Назва мови' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLanguageDto.prototype, "name", void 0);
//# sourceMappingURL=languages.dto.js.map