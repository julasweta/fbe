import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const {
      translations,
      images,
      features,
      categoryId,
      collectionIds,
      ...productData
    } = dto;

    return await this.prisma.product.create({
      data: {
        ...productData,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        collection:
          collectionIds && collectionIds.length > 0
            ? { connect: { id: collectionIds[0] } }
            : undefined,
        translations: { create: translations },
        images: { create: images },
        features: {
          create: features.map((f) => ({
            text: f.text,
            order: f.order ?? null,
          })),
        },
      },
      include: {
        translations: { include: { language: true } },
        images: true,
        features: true,
        collection: true,
        category: true,
      },
    });
  }

  async findAll(params: {
    limit?: number;
    skip?: number;
    page?: number;
    category?: string;
    collection?: string;
  }) {
    const limit = params.limit ?? 20;
    const offset = params.page ? (params.page - 1) * limit : (params.skip ?? 0);

    const where: any = {};

    if (params.category) {
      where.category = {
        slug: params.category,
      };
    }

    if (params.collection) {
      where.collection = {
        slug: params.collection,
      };
    }

    const [products, count] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip: offset,
        take: limit,
        where,
        include: {
          translations: { include: { language: true } },
          images: true,
          features: true,
          collection: true,
          category: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      count,
      page: params.page || Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        translations: { include: { language: true } },
        images: true,
        features: true,
        collection: true,
        category: true,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, data: UpdateProductDto) {
    const { features, categoryId, collectionIds, ...rest } = data;

    return await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        categoryId: categoryId ?? undefined, // оновлюємо категорію (якщо передано)

        ...(features
          ? {
              features: {
                deleteMany: {}, // видаляємо всі старі фічі
                create: features.map((f) => ({
                  text: f.text,
                  order: f.order ?? null,
                })),
              },
            }
          : {}),

        ...(collectionIds
          ? {
              collections: {
                deleteMany: {}, // очищаємо старі зв’язки з колекціями
                create: collectionIds.map((collectionId) => ({
                  collectionId,
                })),
              },
            }
          : {}),
      },
      include: {
        translations: { include: { language: true } },
        images: true,
        features: true,
        collection: true,
        category: true,
      },
    });
  }

  async remove(id: number) {
    // Спочатку видаляємо залежності
    await this.prisma.productTranslation.deleteMany({
      where: { productId: id },
    });
    await this.prisma.productImage.deleteMany({ where: { productId: id } });
    await this.prisma.productFeature.deleteMany({ where: { productId: id } });
    await this.prisma.cartItem.deleteMany({ where: { productId: id } });
    await this.prisma.orderItem.deleteMany({ where: { productId: id } });

    // Потім сам продукт
    return this.prisma.product.delete({ where: { id } });
  }
}
