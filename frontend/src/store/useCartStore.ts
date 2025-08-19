import { create } from "zustand";
import type { ICartItem, ICartResponse } from "../interfaces/ICartItem";
import { apiService } from "../services/ApiServices";

interface CartState {
  cart: ICartItem[];
  setCart: (items: ICartItem[]) => void;
  clearCart: () => void;
  fetchCart: (userId: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  setCart: (items) => set({ cart: items }),
  clearCart: () => set({ cart: [] }),
  fetchCart: async (userId: number) => {
    try {
      const res = await apiService.get<ICartResponse>(`/cart?userId=${userId}`);
      set({ cart: res.data.items }); // ⚡ беремо тільки items
    } catch (error) {
      console.error("Помилка при завантаженні кошика:", error);
    }
  },
}));
