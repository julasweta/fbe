import { EColor, ESize } from '@prisma/client';
import { UpdateProductTranslationDto } from '../../product-translations/dto/update-product-translation.dto';
import { UpdateProductFeatureDto } from '../../product-feature/dto/update-product-feature.dto';
declare class UpdateProductVariantDto {
    color?: EColor;
    sizes?: ESize[];
    price?: number;
    priceSale?: number;
    stock?: number;
    description?: string;
    images?: any[];
    productId?: number;
}
export declare class UpdateProductDto {
    sku?: string;
    price?: number;
    priceSale?: number;
    categoryId?: number;
    collectionId?: number;
    translations?: UpdateProductTranslationDto[];
    features?: UpdateProductFeatureDto[];
    variants?: UpdateProductVariantDto[];
}
export {};
