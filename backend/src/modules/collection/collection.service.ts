import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCollectionDto) {
    return await this.prisma.collection.create({
      data: {
        name: dto.name,
        description: dto.description,
        slug: dto.slug,
        imageUrl: dto.imageUrl,
      },
    });
  }

  async findAll() {
    return await this.prisma.collection.findMany();
  }

  async findOne(id: number) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
    });
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }

  async update(id: number, data: UpdateCollectionDto) {
    const category = await this.prisma.collection.update({
      where: { id },
      data,
    });
    if (!category) throw new NotFoundException('Collection not found');
    return category;
  }

  async remove(id: number) {
    return await this.prisma.collection.delete({ where: { id } });
  }
}
