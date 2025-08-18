import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { ProductTranslationsModule } from './modules/product-translations/product-translations.module';
import { ProductFeatureModule } from './modules/product-feature/product-feature.module';
import { CategoryModule } from './modules/category/category.module';
import { CollectionModule } from './modules/collection/collection.module';
import { EmailModule } from './modules/email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CartModule } from './modules/cart/cart.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemDto } from './modules/order-item/dto/order-item.dto';
import { TelegramModule } from './modules/telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MailerModule.forRoot({
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
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    LanguagesModule,
    ProductTranslationsModule,
    ProductFeatureModule,
    CategoryModule,
    CollectionModule,
    EmailModule,
    CartModule,
    CartItemModule,
    OrderModule,
    OrderItemDto,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log(` pass +${process.env.SMTP_PASS}`);
  }
}
