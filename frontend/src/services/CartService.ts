// services/CartService.ts
import type { ICartItem } from "../interfaces/ICartItem";
import { apiService } from "./ApiServices";

const LOCAL_KEY = "cart";

const readLocal = (): ICartItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLocal = (items: ICartItem[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
};

export const cartService = {
  /** Гість: додаємо в localStorage (мердж за productId+color+size) */
  addItem(item: ICartItem): ICartItem[] {
    const items = readLocal();
    const idx = items.findIndex(
      (i) =>
        i.productId === item.productId &&
        i.color === item.color &&
        i.size === item.size
    );

    if (idx >= 0) {
      items[idx].quantity = Math.min(99, items[idx].quantity + item.quantity);
    } else {
      items.push(item);
    }

    writeLocal(items);
    return items;
  },

  /** Авторизований: додаємо в БД */
  async addToCart(userId: number, item: ICartItem) {
    const res = await apiService.post(`/cart/add`, { userId: userId, item });
    return res.data.item as ICartItem;
  },

  async deleteTCartItem(cartItemId: number) {
    await apiService.delete(`/cart-item/${cartItemId}`);
  },

  async deleteTCartItems() {
    await apiService.delete(`/cart/clear`);
  },

  /** Отримати кошик (якщо є userId — з БД, інакше — з localStorage) */
  async getCart(userId?: number | null) {
    if (userId) {
      const res = await apiService.get(`/cart`);
      return res.data.items as ICartItem[];
    }
    return readLocal();
  },

  /** Гість: повністю замінити кошик у localStorage */
  setLocalCart(items: ICartItem[]) {
    writeLocal(items);
    return items;
  },

  /** Гість: очистити localStorage кошик */
  clearLocalCart() {
    writeLocal([]);
  },

};

