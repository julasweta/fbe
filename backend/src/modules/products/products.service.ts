import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateProductDto) {
    const { translations, images, ...productData } = dto;

    const data: Prisma.ProductCreateInput = {
      ...productData,
      translations: {
        create: translations  // Правильный формат для Prisma
      },
      images: {
        create: images       // Правильный формат для Prisma
      }
    };

    return await this.prisma.product.create({
      data,
      include: {
        translations: { include: { language: true } },
        images: true
      }
    });
  }
  async findAll() {
    return await this.prisma.product.findMany({
      include: { images: true, translations: true },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, translations: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    return await this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.product.delete({ where: { id } });
  }
}

