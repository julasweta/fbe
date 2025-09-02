import { create } from "zustand";
import { CollectionService } from "../services/CollectionService";
import type { ICollection } from "../interfaces/IColection";

interface CollectionState {
  collections: ICollection[];
  loading: boolean;
  error: string | null;
  fetchCollections: () => Promise<void>;
  addCollection: (collection: ICollection) => void;
  removeCollection: (id: number) => void;
  updateCollection: (
    id: number,
    data: Partial<ICollection>,
  ) => Promise<ICollection>;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  collections: [],
  loading: false,
  error: null,

  fetchCollections: async () => {
    set({ loading: true, error: null });
    try {
      const collections = await CollectionService.getAll();
      set({ collections, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Помилка завантаження колекцій",
        loading: false,
      });
    }
  },

  addCollection: (collection) =>
    set((state) => ({ collections: [...state.collections, collection] })),

  updateCollection: async (id: number, data: Partial<ICollection>) => {
    try {
      const collection = await CollectionService.update(id, data);

      if (!collection) {
        throw new Error("Категорія не була оновлена");
      }

      // Оновлюємо категорію в стейті, замінюючи існуючу
      set((state) => ({
        collections: state.collections.map((collection) =>
          collection.id === id ? collection : collection,
        ),
      }));

      return collection;
    } catch (error: any) {
      set({
        error: error.message || "Помилка оновлення категорії",
        loading: false,
      });
      throw error; // Перекидаємо помилку, щоб компонент міг її обробити
    }
  },

  removeCollection: (id) =>
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id),
    })),
}));
