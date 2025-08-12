// useProductStore.ts
import { create } from "zustand";
import type { IProduct } from "../interfaces/IProduct";
import { productService } from "../services/ProductService";

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

  fetchProducts: () => Promise<void>;
  createProduct: (productData: Partial<IProduct>) => Promise<void>;
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

  fetchProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const products = await productService.getAll();
      set({ products, isLoading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });

    try {
      const newProduct = await productService.addProduct(productData);
      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
      throw error;
    }
  },

  editProduct: async (id, productData) => {
    set({ isLoading: true, error: null });

    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? updatedProduct : p
        ),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
      throw error;
    }
  },
}));