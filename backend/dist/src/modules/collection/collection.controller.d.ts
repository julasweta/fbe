import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
export declare class CollectionController {
    private readonly collectionService;
    constructor(collectionService: CollectionService);
    create(dto: CreateCollectionDto): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string | null;
        imageUrl: string | null;
    }>;
    findAll(): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string | null;
        imageUrl: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string | null;
        imageUrl: string | null;
    }>;
    update(id: number, data: UpdateCollectionDto): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string | null;
        imageUrl: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string | null;
        imageUrl: string | null;
    }>;
}
