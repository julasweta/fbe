import { Module } from '@nestjs/common';
import { ProductTranslationsService } from './product-translations.service';
import { ProductTranslationsController } from './product-translations.controller';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [ProductTranslationsController],
  providers: [ProductTranslationsService, PrismaService],
})
export class ProductTranslationsModule { }

