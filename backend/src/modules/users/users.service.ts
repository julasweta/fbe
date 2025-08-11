import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserResponseMapper } from './dto/user-resp-mapper';
import { BaseUserDto } from './dto/base-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Partial<BaseUserDto>[]> {
    const users = await this.prisma.user.findMany();
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return UserResponseMapper.toResUsersArrayMapper(users);
  }

  async findOne(id: number): Promise<Partial<BaseUserDto>> {
    const user = await this.prisma.user.findUnique({
      where: { id } as Prisma.UserWhereUniqueInput,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserResponseMapper.toResUserMapper(user);
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<Partial<BaseUserDto>> {
    const user = await this.prisma.user.update({
      where: { id } as Prisma.UserWhereUniqueInput,
      data,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserResponseMapper.toResUserMapper(user);
  }

  async updateRole(id: number, role: Role): Promise<Partial<BaseUserDto>> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role: role },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserResponseMapper.toResUserMapper(user);
  }
}
