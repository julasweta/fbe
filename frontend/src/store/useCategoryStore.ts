import { create } from "zustand";
import { CategoryService } from "../services/CategoryService";
import type { ICategory, ICreateCategory } from "../interfaces/ICategory";

interface CategoryState {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: ICreateCategory) => void;
  removeCategory: (id: number) => void;
  updateCategory: (id: number, data: Partial<ICategory>) => Promise<ICategory>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await CategoryService.getAll();
      set({ categories, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Помилка завантаження категорій",
        loading: false,
      });
    }
  },

  addCategory: async(data) =>
  {
    try {
      const category = await CategoryService.create(data);
      if (!category) {
        throw new Error("Категорія не була оновлена");
      }
      set((state) => ({ categories: [...state.categories, category] }))
     
      return category;
    } catch (error: any) {
      set({
        error: error.message || "Помилка оновлення категорії",
        loading: false,
      });
      throw error; // Перекидаємо помилку, щоб компонент міг її обробити
    }
  
  },

  updateCategory: async (id: number, data: Partial<ICategory>) => {
    try {
      const category = await CategoryService.update(id, data);
      if (!category) {
        throw new Error("Категорія не була оновлена");
      }
      // Оновлюємо категорію в стейті, замінюючи існуючу
      set((state) => ({
        categories: state.categories.map(cat =>
          cat.id === id ? category : cat
        )
      }));

      return category;
    } catch (error: any) {
      set({
        error: error.message || "Помилка оновлення категорії",
        loading: false,
      });
      throw error; // Перекидаємо помилку, щоб компонент міг її обробити
    }
  },

  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
}));
