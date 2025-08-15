import type { ICartItem } from "../interfaces/ICartItem";
import type { CheckoutFormData } from "../modules/orders/CheckoutForm";
import { apiService } from "./ApiServices";

export const orderService = {
  async createOrder(userId: number | null, cart: ICartItem[], paymentMethod: string, form: CheckoutFormData) {
    return apiService.post("/orders", {
      userId,
      cart,
      paymentMethod,
      customerData: form
    });
  },
  sendTelegramOrder: async (user: object, items: ICartItem[], paymentMethod: string) => {
    const res = await apiService.post(`/telegram-order`, {
      user,
      items,
      paymentMethod
    });
    return res.data;
  }
};
