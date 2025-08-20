import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductImageDto } from '../images/dto/images.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Injectable()
export class ProductImageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductImageDto) {
    return this.prisma.productImage.create({
      data: {
        url: dto.url,
        altText: dto.altText ?? null,
        product: { connect: { id: dto.productId } },
        variant: dto.variantId ? { connect: { id: dto.variantId } } : undefined,
      },
    });
  }

  async findAllByVariant(variantId: number) {
    return await this.prisma.productImage.findMany({
      where: { variantId },
    });
  }

  async findOne(id: number) {
    const image = await this.prisma.productImage.findUnique({ where: { id } });
    if (!image) throw new NotFoundException('ProductImage not found');
    return image;
  }

  async update(id: number, dto: UpdateProductImageDto) {
    return await this.prisma.productImage.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return await this.prisma.productImage.delete({ where: { id } });
  }
}
