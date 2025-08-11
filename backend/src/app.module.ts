import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { ProductTranslationsModule } from './modules/product-translations/product-translations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    LanguagesModule,
    ProductTranslationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
