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