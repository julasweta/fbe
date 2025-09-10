import { Role } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { BaseUserDto } from './dto/base-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Partial<BaseUserDto>[]>;
    findOne(id: number): Promise<Partial<BaseUserDto>>;
    update(id: number, data: UpdateUserDto): Promise<Partial<BaseUserDto>>;
    updateRole(id: number, role: Role): Promise<Partial<BaseUserDto>>;
}
