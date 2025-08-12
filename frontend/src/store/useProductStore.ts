import { create } from "zustand";
import type { IProduct } from "../interfaces/IProduct";

// Інтерфейси


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