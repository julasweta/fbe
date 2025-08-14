export interface IProductImage {
  id?: number;
  url: string;
  altText?: string;
}

export interface IProductTranslation {
  id?: number;
  productId?: number;
  languageId: number;
  name: string;
  description?: string;
}

export enum ESize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL"
}

export enum EColor {
  RED = "RED",
  BLUE = "BLUE",
  BLACK = "BLACK",
  WHITE = "WHITE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  ORANGE= "ORANGE",
  PURPLE= "PURPLE",
  PINK= "PINK",

}

export const sizeLabels: Record<ESize, string> = {
  [ESize.XS]: "XS",
  [ESize.S]: "S",
  [ESize.M]: "M",
  [ESize.L]: "L",
  [ESize.XL]: "XL",
  [ESize.XXL]: "XXL"
};

export const colorLabels: Record<EColor, string> = {
  [EColor.RED]: "Червоний",
  [EColor.BLUE]: "Синій",
  [EColor.BLACK]: "Чорний",
  [EColor.WHITE]: "Білий",
  [EColor.GREEN]: "Зелений",
  [EColor.YELLOW]: "Жовтий",
  [EColor.ORANGE]: "Помаранчевий",
  [EColor.PURPLE]: "Фіолетовий",
  [EColor.PINK]: "Рожевий",
};


export interface IProductFeature {
  id?: number;
  text: string;
  order?: number | null;
}


export interface IProduct {
  id: number;
  sku: string;
  price: number;
  priceSale: number;
  createdAt: string;
  updatedAt: string;
  images?: IProductImage[];
  translations?: IProductTranslation[];
  features?: IProductFeature[];
  sizes: ESize[];   // масив enum з Prisma
  colors: EColor[]; // масив enum з Prisma
  collectionIds: number[]; // масив ID колекцій
  categoryId?: number; // ID категорії, якщо є
}

export interface IProductsResponse {
  data: IProduct[];
  count: number;
  page: number;
  totalPages: number;
}
export interface ProductFilters{
  limit?: number;
  skip?: number;
  categorySlug?: string | undefined;
  collectionSlug?: string | undefined; // додано для фільтрації за колекцією
  size?: ESize;
  color?: EColor;
  priceRange?: [number, number]; // [minPrice, maxPrice]
}