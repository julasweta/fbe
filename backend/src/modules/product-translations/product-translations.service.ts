import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProductTranslationsService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.ProductTranslationCreateInput) {
    return await this.prisma.productTranslation.create({ data });
  }

  async findAll() {
    return await this.prisma.productTranslation.findMany({ include: { product: true, language: true } });
  }

  async findOne(id: number) {
    const translation = await this.prisma.productTranslation.findUnique({
      where: { id },
      include: { product: true, language: true },
    });
    if (!translation) throw new NotFoundException('Translation not found');
    return translation;
  }

  async update(id: number, data: Prisma.ProductTranslationUpdateInput) {
    return await this.prisma.productTranslation.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.productTranslation.delete({ where: { id } });
  }
}
