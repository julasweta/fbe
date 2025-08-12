import { create } from "zustand";

// Інтерфейси
export interface IProductImage {
  id: number;
  url: string;
  altText?: string;
}

export interface IProductTranslation {
  id: number;
  productId: number;
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
  YELLOW = "YELLOW"
}

export const sizeLabels: Record<ESize, string> = {
  [ESize.XS]: "Дуже малий",
  [ESize.S]: "Малий",
  [ESize.M]: "Середній",
  [ESize.L]: "Великий",
  [ESize.XL]: "Дуже великий",
  [ESize.XXL]: "Максимальний"
};

export const colorLabels: Record<EColor, string> = {
  [EColor.RED]: "Червоний",
  [EColor.BLUE]: "Синій",
  [EColor.BLACK]: "Чорний",
  [EColor.WHITE]: "Білий",
  [EColor.GREEN]: "Зелений",
  [EColor.YELLOW]: "Жовтий"
};


export interface IProductFeature {
  id: number;
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
}

interface ProductState {
  products: IProduct[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: IProduct[]) => void;
  addProduct: (product: IProduct) => void;
  updateProduct: (product: IProduct) => void;
  removeProduct: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Async actions
  fetchProducts: () => Promise<void>;
}

// Стор
export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  setProducts: (products) => {
    console.log('Setting products in store:', products);
    set({ products, error: null });
  },

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
      error: null,
    })),

  updateProduct: (updatedProduct) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      ),
      error: null,
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      error: null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  // Async action для завантаження продуктів
  fetchProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      // Імпортуємо сервіс динамічно, щоб уникнути циклічних залежностей
      const { productService } = await import("../services/ProductService");
      await productService.getAll();
      // productService.getAll() вже викликає setProducts через useProductStore.getState().setProducts()
    } catch (error) {
      console.error('Error fetching products:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },
}));