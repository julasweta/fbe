import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class LanguagesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.LanguageCreateInput): Promise<{
        id: number;
        name: string;
        code: string;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        code: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        code: string;
    }>;
    update(id: number, data: Prisma.LanguageUpdateInput): Promise<{
        id: number;
        name: string;
        code: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        code: string;
    }>;
}
