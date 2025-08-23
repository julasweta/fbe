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

  removeCollection: (id) =>
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id),
    })),
}));
