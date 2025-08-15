import { create } from "zustand";
import type { ICartItem } from "../interfaces/ICartItem";

interface CartState {
  cart: ICartItem[];
  setCart: (items: ICartItem[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  setCart: (items) => set({ cart: items }),
  clearCart: () => set({ cart: [] })
}));
