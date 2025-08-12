import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCollectionDto) {
    return await this.prisma.collection.create({
      data: {
        name: dto.name,
        description: dto.description,
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

  async remove(id: number) {
    return await this.prisma.collection.delete({ where: { id } });
  }
}
