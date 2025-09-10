import { CreateProductTranslationDto } from '../../product-translations/dto/product-translation.dto';
import { CreateProductFeatureDto } from '../../product-feature/dto/create-product-feature.dto';
import { CreateProductVariantDto } from '../../product-variant/dto/create-product-variant.dto';
export declare enum ESize {
    XS = "XS",
    S = "S",
    M = "M",
    L = "L",
    XL = "XL",
    XXL = "XXL"
}
export declare enum EColor {
    RED = "RED",
    BLUE = "BLUE",
    BLACK = "BLACK",
    WHITE = "WHITE",
    GREEN = "GREEN",
    YELLOW = "YELLOW",
    ORANGE = "ORANGE",
    PURPLE = "PURPLE",
    PINK = "PINK"
}
export declare class CreateProductDto {
    sku: string;
    price: number;
    priceSale?: number;
    categoryId?: number;
    collectionId?: number;
    translations: CreateProductTranslationDto[];
    features: CreateProductFeatureDto[];
    variants: CreateProductVariantDto[];
}
