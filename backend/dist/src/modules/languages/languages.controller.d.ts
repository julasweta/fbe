import { LanguagesService } from './languages.service';
import { Prisma } from '@prisma/client';
import { CreateLanguageDto } from './dto/languages.dto';
export declare class LanguagesController {
    private readonly languagesService;
    constructor(languagesService: LanguagesService);
    create(data: CreateLanguageDto): Promise<{
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
