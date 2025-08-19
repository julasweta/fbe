import { create } from "zustand";
import type { ICartItem } from "../interfaces/ICartItem";
import { cartService } from "../services/CartService";
import { useAuthStore } from "./useAuthStore";

interface CartState {
  cart: ICartItem[];
  setCart: (items: ICartItem[]) => void;

  addCartItem: (item: ICartItem) => Promise<void>;
  deleteCartItem: (cartItemId: number) => Promise<void>;
  deleteCartItems: () => Promise<void>;
  clearCart: () => Promise<void>;

  fetchCart: () => Promise<void>;
}

const { user } = useAuthStore.getState();
export const useCartStore = create<CartState>((set) => ({
  cart: [],

  setCart: (items) => set({ cart: items }),

  /** Додаємо товар у кошик */
  addCartItem: async (item: ICartItem) => {
    

    try {
      if (user?.id) {
        // ⚡ для авторизованих
        await cartService.addToCart(user.id, item);
        const updated = await cartService.getCart(user?.id);
        set({ cart: updated });
      } else {
        // ⚡ для гостей
        const random = Math.floor(Math.random() * 1000);
        const guestId = item.productId+random;
        const itemWithId = { ...item, id: +guestId }; // 🟢 тепер item завжди має id

        const updated = cartService.addItem(itemWithId);
        console.log('updated', updated);
        set({ cart: updated });
      }
    } catch (error) {
      console.error("Помилка при додаванні в кошик:", error);
    }
  },


  clearCart: async () => {
    try {
      await cartService.clearLocalCart();
      set({ cart: [] });
    } catch (error) {
      console.error("Помилка при очищенні кошика:", error);
    }
  },

  deleteCartItems: async () => {
    try {
      await cartService.deleteTCartItems();
      set({ cart: [] });
    } catch (error) {
      console.error("Помилка при видаленні товарів:", error);
    }
  },

  deleteCartItem: async (cartItemId: string | number) => {
    const { user } = useAuthStore.getState();
    try {
      if (user) {
        // 🟢 видаляємо на бекенді
        await cartService.deleteTCartItem(+cartItemId);
      }

      set((state) => {
        const updatedCart = state.cart.filter((item) => item.id !== cartItemId);

        // 🟢 якщо гість — синхронізуємо localStorage
        if (!user) {
          localStorage.setItem("cart", JSON.stringify(updatedCart));
        }

        return { cart: updatedCart };
      });
    } catch (error) {
      console.error("Помилка при delete Item:", error);
    }
  },


  fetchCart: async () => {
    try {
      const { user } = useAuthStore.getState();
      const res = await cartService.getCart(user?.id);
      set({ cart: res });
    } catch (error) {
      console.error("Помилка при завантаженні кошика:", error);
    }
  },
}));

