import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const { translations, images, features, ...productData } = dto;

    return await this.prisma.product.create({
      data: {
        ...productData,
        translations: {
          create: translations,
        },
        images: {
          create: images,
        },
        features: {
          create: features.map((f) => ({
            text: f.text, // обов'язкове поле
            order: f.order ?? null,
          })),
        },
      },
      include: {
        translations: { include: { language: true } },
        images: true,
        features: true,
      },
    });
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: { images: true, translations: true },
    });
    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, translations: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, data: UpdateProductDto) {
    const { features, ...rest } = data;

    return await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(features
          ? {
              features: {
                deleteMany: {}, // видаляємо всі старі фічі
                create: features.map((f) => ({
                  text: f.text, // тепер завжди string
                  order: f.order ?? null,
                })),
              },
            }
          : {}),
      },
      include: { features: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.product.delete({ where: { id } });
  }
}
