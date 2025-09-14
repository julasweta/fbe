import { create } from "zustand";
import { orderService } from "../services/OrderService";
import type { IOrderResponse } from "../interfaces/IOrder";

export interface Filters {
  orderId?: number;
  dateFrom?: string;
  dateTo?: string;
}

interface OrderState {
  orders: IOrderResponse[];
  loading: boolean;
  error: string | null;

  fetchOrders: (
    showAll?: boolean,
    filters?: Filters,
    page?: number,
    limit?: number
  ) => Promise<void>;

  setOrders: (orders: IOrderResponse[]) => void;

  updateOrderStatus: (orderId: number, status: string) => Promise<void>;


}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),

  // Завантаження замовлень з бекенду
  fetchOrders: async (showAll = false, filters?: Filters, page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const orders = await orderService.getOrders(showAll, filters, page, limit);
      set({ orders, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Помилка завантаження замовлень",
        loading: false,
      });
    }
  },

  // Оновлення статусу замовлення
  updateOrderStatus: async (orderId: number, status: string) => {
    set({ loading: true, error: null });
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);

      const updatedOrders = get().orders.map((order) =>
        order.id === orderId ? { ...order, status: updatedOrder.status } : order
      );

      set({ orders: updatedOrders, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Помилка оновлення статусу замовлення",
        loading: false,
      });
    }
  },

 
}));
