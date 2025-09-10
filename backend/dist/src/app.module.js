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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const products_module_1 = require("./modules/products/products.module");
const languages_module_1 = require("./modules/languages/languages.module");
const product_translations_module_1 = require("./modules/product-translations/product-translations.module");
const product_feature_module_1 = require("./modules/product-feature/product-feature.module");
const category_module_1 = require("./modules/category/category.module");
const collection_module_1 = require("./modules/collection/collection.module");
const email_module_1 = require("./modules/email/email.module");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const cart_module_1 = require("./modules/cart/cart.module");
const cart_item_module_1 = require("./modules/cart-item/cart-item.module");
const order_module_1 = require("./modules/order/order.module");
const order_item_dto_1 = require("./modules/order-item/dto/order-item.dto");
const telegram_module_1 = require("./modules/telegram/telegram.module");
let AppModule = class AppModule {
    constructor() { }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
            }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                },
                defaults: {
                    from: '"nest-modules" <user@outlook.com>',
                },
                template: {
                    dir: __dirname + '/../../template/',
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            languages_module_1.LanguagesModule,
            product_translations_module_1.ProductTranslationsModule,
            product_feature_module_1.ProductFeatureModule,
            category_module_1.CategoryModule,
            collection_module_1.CollectionModule,
            email_module_1.EmailModule,
            cart_module_1.CartModule,
            cart_item_module_1.CartItemModule,
            order_module_1.OrderModule,
            order_item_dto_1.OrderItemDto,
            telegram_module_1.TelegramModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [])
], AppModule);
//# sourceMappingURL=app.module.js.map