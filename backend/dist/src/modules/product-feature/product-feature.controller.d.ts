import { CreateProductFeatureDto } from './dto/create-product-feature.dto';
import { UpdateProductFeatureDto } from './dto/update-product-feature.dto';
import { ProductFeaturesService } from './product-feature.service';
export declare class ProductFeaturesController {
    private readonly service;
    constructor(service: ProductFeaturesService);
    create(productId: number, dto: CreateProductFeatureDto): Promise<{
        order: number | null;
        id: number;
        text: string;
        productId: number;
    }>;
    findAll(productId: number): Promise<{
        order: number | null;
        id: number;
        text: string;
        productId: number;
    }[]>;
    findOne(id: number): Promise<{
        order: number | null;
        id: number;
        text: string;
        productId: number;
    }>;
    update(id: number, dto: UpdateProductFeatureDto): Promise<{
        order: number | null;
        id: number;
        text: string;
        productId: number;
    }>;
    remove(id: number): Promise<{
        order: number | null;
        id: number;
        text: string;
        productId: number;
    }>;
}
