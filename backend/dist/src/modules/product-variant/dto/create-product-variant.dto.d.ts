import { EColor, ESize } from '@prisma/client';
import { ProductImageDto } from '../../images/dto/images.dto';
export declare class CreateProductVariantDto {
    productId?: number;
    color: EColor;
    sizes: ESize[];
    price?: number;
    priceSale?: number;
    stock: number;
    images?: ProductImageDto[];
    description?: string;
}
