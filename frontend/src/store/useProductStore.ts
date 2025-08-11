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

export interface IProduct {
  id: number;
  sku: string;
  price: number;
  priceSale: number;
  createdAt: string;
  updatedAt: string;
  images?: IProductImage[];
  translations?: IProductTranslation[];
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
export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  setProducts: (products) => {
    console.log('Setting products in store:', products.length);
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