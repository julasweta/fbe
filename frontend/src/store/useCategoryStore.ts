import {create} from 'zustand';
import { CategoryService } from '../services/CategoryService';
import type { ICategory } from '../interfaces/ICategory';

interface CategoryState {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: ICategory) => void;
  removeCategory: (id: number) => void;
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
    } catch (error: any ) {
      set({ error: error.message || 'Помилка завантаження категорій', loading: false });
    }
  },

  addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),

  removeCategory: (id) => set((state) => ({
    categories: state.categories.filter(c => c.id !== id),
  })),
}));
