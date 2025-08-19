import { create } from "zustand";
import type { ICartItem, ICartResponse } from "../interfaces/ICartItem";
import { apiService } from "../services/ApiServices";
import { cartService } from "../services/CartService";

interface CartState {
  cart: ICartItem[];
  setCart: (items: ICartItem[]) => void;
  deleteCartItem: (cartItemId: number) => void;
  deleteCartItems: () => void;
  clearCart: () => void;

  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  setCart: (items) => set({ cart: items }),
  clearCart: () => set({ cart: [] }),
  deleteCartItems: async () => {
    try {
      await cartService.deleteTCartItems();
    } catch (error) {
      console.error("Помилка при delete Item:", error);
    }
  },
  deleteCartItem: async(cartItemId: number) => {
    try {
      await cartService.deleteTCartItem(cartItemId);
    } catch (error) {
      console.error("Помилка при delete Item:", error);
    }
  },
  fetchCart: async () => {
    try {
      const res = await apiService.get<ICartResponse>(`/cart`);
      set({ cart: res.data.items }); // ⚡ беремо тільки items
    } catch (error) {
      console.error("Помилка при завантаженні кошика:", error);
    }
  },
}));
