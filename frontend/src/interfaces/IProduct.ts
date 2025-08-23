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
  GREY = "GREY",
  BROWN = "BROWN",
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
  [EColor.GREY]: "Grey",
  [EColor.BROWN]: "Brown",
};

export const colorHexMap: Record<EColor, string> = {
  [EColor.RED]: "#b34a4a", // приглушений червоний, винний відтінок
  [EColor.GREEN]: "#4a7c59", // м'який зелений, із легким сірим підтоном
  [EColor.BLUE]: "#4a6fa5", // сіро-блакитний, приглушений синій
  [EColor.BLACK]: "#1e1e1e", // глибокий графіт, не чисто чорний
  [EColor.WHITE]: "#f5f5f5", // теплий білий, майже молочний
  [EColor.YELLOW]: "#d4c35b", // золотаво-жовтий, теплий
  [EColor.ORANGE]: "#d87a4a", // теракотовий, мідно-оранжевий
  [EColor.PURPLE]: "#6a4a7c", // фіолетовий з сірим підтоном
  [EColor.PINK]: "#ff99bb", // пудрово-рожевий, ніжний
  [EColor.GREY]: "#808080", // класичний сірий, нейтральний
  [EColor.BROWN]: "#8b5e3c", // теплий коричневий, кавовий
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
  productId?: number;
  id?: number;
  color: EColor;
  sizes: ESize[];
  price: number;
  priceSale?: number | null;
  stock: number;
  images?: ICreateProductImage[];
  description?: string;
}

// Продукт
export interface ICreateProduct {
  id?: number | null | undefined;
  sku: string;
  price: number;
  priceSale?: number | null;
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
  priceSale?: number | null;
  categoryId?: number;
  collectionId?: number;
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
