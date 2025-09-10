import { CreateProductDto } from './create-product.dto';
export interface ExcelRow {
    sku: string | number;
    name?: string;
    description?: string;
    variantDescription?: string;
    price?: number | string;
    priceSale?: number | string;
    categoryId?: number | string;
    collectionId?: number | string;
    features?: string;
    stock?: string;
    variantColor?: string;
    variantSizes?: string;
    variantImages?: string;
}
export declare const rows: CreateProductDto[];
