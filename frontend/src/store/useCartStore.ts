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
  loaded: boolean;
  isLoading: boolean; // Додаємо флаг завантаження
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  loaded: false,
  isLoading: false,

  setCart: (items) => set({ cart: items }),

  /** Додаємо товар у кошик */
  addCartItem: async (item: ICartItem) => {
    try {
      const { user } = useAuthStore.getState();

      if (user?.id) {
        // ⚡ для авторизованих
        await cartService.addToCart(user.id, item);
        const updated = await cartService.getCart(user?.id);
        set({ cart: updated });
      } else {
        // ⚡ для гостей
        const random = Math.floor(Math.random() * 1000);
        const guestId = item.productId + random;
        const itemWithId = { ...item, id: +guestId };

        const updated = cartService.addItem(itemWithId);
        set({ cart: updated });
      }
    } catch (error) {
      console.error("Помилка при додаванні в кошик:", error);
    }
  },

  clearCart: async () => {
    try {
      await cartService.clearLocalCart();
      set({ cart: [], loaded: false }); // Скидаємо loaded
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
    const { loaded, isLoading } = get();
    const { user, accessToken } = useAuthStore.getState();

    if (isLoading) {
      return;
    }

    // Якщо немає користувача або токена - завантажуємо з localStorage для гостей
    if (!user?.id || !accessToken) {
      try {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        set({ cart: localCart, loaded: true });
      } catch (error) {
        console.error("Помилка завантаження кошика з localStorage:", error);
        set({ cart: [], loaded: true });
      }
      return;
    }

    // Якщо корзина вже завантажена для поточного користувача - не робимо запит
    if (loaded) {
      console.log("Кошик вже завантажений для користувача");
      return;
    }

    set({ isLoading: true });
    if (user?.id && accessToken) {
      try {
        const res = await cartService.getCart(user.id);
        set({ cart: res, loaded: true, isLoading: false });
      } catch (error) {
        console.error("Помилка при завантаженні кошика:", error);
        set({ cart: [], loaded: true, isLoading: false });
      }
    }
  },
}));
