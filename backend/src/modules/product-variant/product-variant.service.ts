import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Injectable()
export class ProductVariantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductVariantDto) {
    return this.prisma.productVariant.create({
      data: {
        color: dto.color,
        sizes: dto.sizes,
        price: dto.price ?? null,
        priceSale: dto.priceSale ?? null,
        stock: dto.stock ?? 0,
        product: { connect: { id: dto.productId } }, // 👈 зв’язок з продуктом
        images: dto.images
          ? {
              create: dto.images.map((img) => ({
                url: img.url,
                altText: img.altText ?? null,
                product: { connect: { id: dto.productId } }, // 👈 теж зв’язок з продуктом
              })),
            }
          : undefined,
      },
      include: { images: true, product: true },
    });
  }

  async findAll(productId?: number) {
    return await this.prisma.productVariant.findMany({
      where: productId ? { productId } : {},
      include: { images: true }, // 👈 одразу тягнемо фото
    });
  }

  async findOne(id: number) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!variant) {
      throw new NotFoundException(`Product variant with ID ${id} not found`);
    }

    return variant;
  }

  async update(id: number, dto: UpdateProductVariantDto) {
    return await this.prisma.productVariant.update({
      where: { id },
      data: {
        color: dto.color,
        sizes: dto.sizes,
        price: dto.price,
        priceSale: dto.priceSale,
        stock: dto.stock,

        images: dto.images
          ? {
              deleteMany: {}, // видалити старі
              create: dto.images.map((img) => ({
                url: img.url,
                altText: img.altText,
                product: { connect: { id: id } }, // 👈 тут НЕ productId
              })),
            }
          : undefined,
      },
      include: { images: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.productVariant.delete({
      where: { id },
    });
  }
}
