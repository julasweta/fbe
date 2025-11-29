// useProductStore.ts
import { create } from "zustand";
import type { ICreateProduct, IProduct } from "../interfaces/IProduct";
import { productService } from "../services/ProductService";
import type { ProductFilters } from "../interfaces/IProduct";

interface ProductState {
  products: IProduct[];
  isLoading: boolean;
  error: string | null;

  setProducts: (products: IProduct[]) => void;
  addProduct: (product: IProduct) => void;
  updateProduct: (product: IProduct) => void;
  removeProduct: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  appendProducts: (filters?: ProductFilters) => Promise<void>;
  createProduct: (productData: ICreateProduct) => Promise<void>;
  editProduct: (id: number, productData: Partial<IProduct>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products, error: null }),

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
      error: null,
    })),

  updateProduct: (updatedProduct) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p,
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

  fetchProducts: async (filters?: ProductFilters) => {
    // Якщо ми на сервері - не робимо запит
    if (typeof window === "undefined") {
      console.log("SSR: Skipping fetchProducts on server");
      set({ isLoading: false, error: null, products: [] });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const products = await productService.getAll(filters);

      set({ products, isLoading: false });
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      });
    }
  },

  appendProducts: async (filters?: ProductFilters) => {
    // Якщо ми на сервері - не робимо запит
    if (typeof window === "undefined") {
      console.log("SSR: Skipping appendProducts on server");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const products = await productService.getAll(filters);
      set((state) => ({
        products: [...state.products, ...products],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      });
    }
  },

  createProduct: async (productData) => {
    // Перевіряємо чи ми на клієнті
    if (typeof window === "undefined") {
      throw new Error("createProduct can only be called on client side");
    }

    set({ isLoading: true, error: null });

    try {
      const newProduct = await productService.addProduct(productData);
      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      });
      throw error;
    }
  },

  editProduct: async (id, productData) => {
    // Перевіряємо чи ми на клієнті
    if (typeof window === "undefined") {
      throw new Error("editProduct can only be called on client side");
    }

    set({ isLoading: true, error: null });

    try {
      const updatedProduct = await productService.updateProduct(
        id,
        productData,
      );
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    // Перевіряємо чи ми на клієнті
    if (typeof window === "undefined") {
      throw new Error("deleteProduct can only be called on client side");
    }

    set({ isLoading: true, error: null });

    try {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      });
      throw error;
    }
  },
}));
