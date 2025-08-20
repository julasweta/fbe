import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(dto: CreateProductDto) {
    const {
      translations,
      features,
      categoryId,
      collectionId,
      variants,
      ...rest
    } = dto;

    // First, create the product with variants (without images)
    const product = await this.prisma.product.create({
      data: {
        ...rest,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        collection: collectionId
          ? { connect: { id: collectionId } }
          : undefined,

        translations: translations
          ? {
              create: translations.map((t) => ({
                name: t.name,
                description: t.description ?? null,
                language: { connect: { id: t.languageId } },
              })),
            }
          : undefined,

        features: features
          ? {
              create: features.map((f) => ({
                text: f.text,
                order: f.order ?? null,
              })),
            }
          : undefined,

        variants: variants
          ? {
              create: variants.map((v) => ({
                color: v.color,
                sizes: v.sizes,
                price: v.price ?? null,
                priceSale: v.priceSale ?? null,
                stock: v.stock ?? 0,
              })),
            }
          : undefined,
      },
      include: {
        variants: true,
      },
    });

    // Then, create images for each variant if they exist
    if (variants && product.variants) {
      for (let i = 0; i < variants.length; i++) {
        const variantDto = variants[i];
        const createdVariant = product.variants[i];

        if (variantDto.images && variantDto.images.length > 0) {
          await this.prisma.productImage.createMany({
            data: variantDto.images.map((img) => ({
              url: img.url,
              altText: img.altText ?? null,
              variantId: createdVariant.id,
              productId: product.id,
            })),
          });
        }
      }
    }

    // Finally, return the complete product with all relations
    return this.prisma.product.findUnique({
      where: { id: product.id },
      include: this.defaultInclude(),
    });
  }

  // LIST
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
    if (params.category) where.category = { slug: params.category };
    if (params.collection) where.collection = { slug: params.collection };

    const [data, count] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip: offset,
        take: limit,
        where,
        include: this.defaultInclude(),
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      count,
      page: params.page || Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(count / limit),
    };
  }

  // GET ONE
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // UPDATE
  async update(id: number, dto: UpdateProductDto) {
    const {
      translations,
      features,
      categoryId,
      collectionId,
      variants,
      ...rest
    } = dto;

    // КРОК 1: оновлюємо сам продукт, колекцію/категорію, переклади, фічі
    await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        category:
          categoryId !== undefined
            ? categoryId
              ? { connect: { id: categoryId } }
              : { disconnect: true }
            : undefined,
        collection: collectionId
          ? { connect: { id: collectionId } }
          : undefined,

        ...(translations
          ? {
              translations: {
                deleteMany: { productId: id },
                create: translations,
              },
            }
          : {}),
        ...(features
          ? {
              features: {
                deleteMany: { productId: id },
                create: features.map((f) => ({
                  text: f.text,
                  order: f.order ?? null,
                })),
              },
            }
          : {}),
      },
    });

    // КРОК 2: якщо передані variants — перебудовуємо їх заново
    if (variants) {
      // спочатку чистимо пов’язані зображення і варіанти
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      await this.prisma.productVariant.deleteMany({ where: { productId: id } });

      // створюємо наново
      if (variants.length) {
        await Promise.all(
          variants.map((v) =>
            this.prisma.productVariant.create({
              data: {
                product: { connect: { id } },
                color: v.color,
                sizes: v.sizes,
                price: v.price ?? null,
                priceSale: v.priceSale ?? null,
                stock: v.stock ?? 0,
                images: v.images?.length
                  ? {
                      create: v.images.map((img) => ({
                        url: img.url,
                        altText: img.altText ?? null,
                        product: { connect: { id } }, // обов’язково
                      })),
                    }
                  : undefined,
              },
            }),
          ),
        );
      }
    }

    return this.prisma.product.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });
  }

  // DELETE
  async remove(id: number) {
    // видаляємо залежності у безпечному порядку
    await this.prisma.productImage.deleteMany({ where: { productId: id } });
    await this.prisma.productTranslation.deleteMany({
      where: { productId: id },
    });
    await this.prisma.productFeature.deleteMany({ where: { productId: id } });
    await this.prisma.productVariant.deleteMany({ where: { productId: id } });
    await this.prisma.cartItem.deleteMany({ where: { productId: id } });
    await this.prisma.orderItem.deleteMany({ where: { productId: id } });

    return this.prisma.product.delete({ where: { id } });
  }

  private defaultInclude() {
    return {
      translations: { include: { language: true } },
      features: true,
      category: true,
      collection: true,
      variants: { include: { images: true } },
    };
  }
}
