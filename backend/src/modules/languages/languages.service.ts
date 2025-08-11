import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class LanguagesService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.LanguageCreateInput) {
    return await this.prisma.language.create({ data });
  }

  async findAll() {
    return await this.prisma.language.findMany();
  }

  async findOne(id: number) {
    const language = await this.prisma.language.findUnique({ where: { id } });
    if (!language) throw new NotFoundException('Language not found');
    return language;
  }

  async update(id: number, data: Prisma.LanguageUpdateInput) {
    return await this.prisma.language.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.language.delete({ where: { id } });
  }
}

