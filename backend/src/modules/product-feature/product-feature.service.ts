import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductFeatureDto } from './dto/create-product-feature.dto';
import { UpdateProductFeatureDto } from './dto/update-product-feature.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProductFeaturesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(productId: number, dto: CreateProductFeatureDto) {
    return await this.prisma.productFeature.create({
      data: {
        productId,
        text: dto.text,
        order: dto.order,
      },
    });
  }

  async findAll(productId: number) {
    return await this.prisma.productFeature.findMany({
      where: { productId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const feature = await this.prisma.productFeature.findUnique({
      where: { id },
    });
    if (!feature) throw new NotFoundException('Feature not found');
    return feature;
  }

  async update(id: number, dto: UpdateProductFeatureDto) {
    return await this.prisma.productFeature.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return await this.prisma.productFeature.delete({ where: { id } });
  }
}
