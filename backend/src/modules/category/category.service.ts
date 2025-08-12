import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) throw new NotFoundException('Parent category not found');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        parentId: dto.parentId,
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany({
      include: { subcategories: true },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { subcategories: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async remove(id: number) {
    return await this.prisma.category.delete({ where: { id } });
  }
}
