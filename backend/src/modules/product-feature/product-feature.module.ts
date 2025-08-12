import { Module } from '@nestjs/common';
import { ProductFeaturesService } from './product-feature.service';
import { ProductFeaturesController } from './product-feature.controller';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [ProductFeaturesController],
  providers: [ProductFeaturesService, PrismaService],
})
export class ProductFeatureModule {}
