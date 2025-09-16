// src/interfaces/IProduct.ts

// Розміри
export const ESize = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type ESize = (typeof ESize)[number];

// Кольори
export const EColor = [
  "RED",
  "GREEN",
  "BLUE",
  "BLACK",
  "WHITE",
  "YELLOW",
  "ORANGE",
  "PURPLE",
  "PINK",
  "GREY",
  "BROWN",
] as const;
export type EColor = (typeof EColor)[number];

// Мапи для відображення
export const sizeLabels: Record<ESize, string> = {
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
};

export const colorLabels: Record<EColor, string> = {
  RED: "Red",
  GREEN: "Green",
  BLUE: "Blue",
  BLACK: "Black",
  WHITE: "White",
  YELLOW: "Yellow",
  ORANGE: "Orange",
  PURPLE: "Purple",
  PINK: "Pink",
  GREY: "Grey",
  BROWN: "Brown",
};

export const colorHexMap: Record<EColor, string> = {
  RED: "#b34a4a",
  GREEN: "#4a7c59",
  BLUE: "#527fb3",
  BLACK: "#1e1e1e",
  WHITE: "#f5f5f5",
  YELLOW: "#d4c35b",
  ORANGE: "#d87a4a",
  PURPLE: "#6a4a7c",
  PINK: "#ff99bb",
  GREY: "#808080",
  BROWN: "#8b5e3c",
};

// DTO

export interface ICreateProductTranslation {
  name: string;
  description?: string;
  languageId: number;
}

export interface ICreateProductFeature {
  text: string;
  textEn?: string;
  order: number;
}

export interface ICreateProductImage {
  url: string;
  altText?: string;
}

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

export interface ICreateProduct {
  id?: number | null;
  sku: string;
  price: number;
  priceSale?: number | null;
  categoryId?: number;
  collectionId?: number;
  translations: ICreateProductTranslation[];
  features: ICreateProductFeature[];
  variants: ICreateProductVariant[];
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
  variants: ICreateProductVariant[];
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
  categorySlug?: string;
  collectionSlug?: string;
}
