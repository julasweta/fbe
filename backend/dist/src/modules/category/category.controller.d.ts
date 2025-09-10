import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(dto: CreateCategoryDto): Promise<{
        id: number;
        name: string;
        slug: string | null;
        parentId: number | null;
        imageUrl: string | null;
    }>;
    findAll(): Promise<({
        subcategories: {
            id: number;
            name: string;
            slug: string | null;
            parentId: number | null;
            imageUrl: string | null;
        }[];
    } & {
        id: number;
        name: string;
        slug: string | null;
        parentId: number | null;
        imageUrl: string | null;
    })[]>;
    findOne(id: number): Promise<{
        subcategories: {
            id: number;
            name: string;
            slug: string | null;
            parentId: number | null;
            imageUrl: string | null;
        }[];
    } & {
        id: number;
        name: string;
        slug: string | null;
        parentId: number | null;
        imageUrl: string | null;
    }>;
    update(id: number, data: UpdateCategoryDto): Promise<{
        id: number;
        name: string;
        slug: string | null;
        parentId: number | null;
        imageUrl: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        slug: string | null;
        parentId: number | null;
        imageUrl: string | null;
    }>;
}
