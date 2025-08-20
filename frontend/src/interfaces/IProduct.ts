// src/interfaces/IProduct.ts

// Енум розмірів
export enum ESize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

// Енум кольорів
export enum EColor {
  RED = "RED",
  GREEN = "GREEN",
  BLUE = "BLUE",
  BLACK = "BLACK",
  WHITE = "WHITE",
  YELLOW = "YELLOW",
  ORANGE = "ORANGE",
  PURPLE = "PURPLE",
  PINK = "PINK",
}

// Мапи для відображення
export const sizeLabels: Record<ESize, string> = {
  [ESize.XS]: "XS",
  [ESize.S]: "S",
  [ESize.M]: "M",
  [ESize.L]: "L",
  [ESize.XL]: "XL",
  [ESize.XXL]: "XXL",
};

export const colorLabels: Record<EColor, string> = {
  [EColor.RED]: "Red",
  [EColor.GREEN]: "Green",
  [EColor.BLUE]: "Blue",
  [EColor.BLACK]: "Black",
  [EColor.WHITE]: "White",
  [EColor.YELLOW]: "Yellow",
  [EColor.ORANGE]: "Orange",
  [EColor.PURPLE]: "Purple",
  [EColor.PINK]: "Pink",
};

// 🟢 DTO відповідності

// Трансляція
export interface ICreateProductTranslation {
  name: string;
  description?: string;
  languageId: number;
}

// Фіча
export interface ICreateProductFeature {
  text: string;
  order: number;
}

// Картинка
export interface ICreateProductImage {
  url: string;
  altText?: string;
}

// Варіант
export interface ICreateProductVariant {
  id?: number;
  color: EColor;
  sizes: ESize[];
  price: number;
  priceSale?: number;
  stock: number;
  images?: ICreateProductImage[];
}

// Продукт
export interface ICreateProduct {
  sku: string;
  price: number;
  priceSale?: number;
  categoryId?: number;
  collectionId?: number;
  translations: ICreateProductTranslation[];
  features: ICreateProductFeature[];
  variants: ICreateProductVariant[]; // без productId
}


export interface IProduct {
  id: number;
  sku: string;
  price: number;
  priceSale?: number;
  categoryId?: number;
  collectionId?: number[];
  translations: ICreateProductTranslation[];
  features: ICreateProductFeature[];
  variants: ICreateProductVariant[]; // без productId
}

export interface IProductsResponse {
  data: IProduct[];
  count: number;
  page: number;
  totalPages: number;
}
export interface ProductFilters {
  limit?: number;
  skip?: number;
  categorySlug?: string | undefined;
  collectionSlug?: string | undefined;
}