import type { ICartItem } from "../interfaces/ICartItem";
import type { IOrderResponse } from "../interfaces/IOrder";
import type { CheckoutFormData } from "../modules/orders/CheckoutForm";
import type { Filters } from "../store/useOrderStore";
import { apiService } from "./ApiServices";

export const orderService = {
  async createOrder(
    userId: number | null,
    cart: ICartItem[],
    paymentMethod: string,
    form: CheckoutFormData,
  ) {
    console.log("➡️ Відправка замовлення на бекенд", form);

    // підрахунок загальної суми
    const finalPrice = cart.reduce((sum, item) => {
      const price =
        item.priceSale && item.priceSale < item.price
          ? item.priceSale
          : item.price;
      return sum + price * item.quantity;
    }, 0);

    return apiService.post("/orders", {
      userId: userId ?? null,
      guestName: form.fullName,
      guestPhone: form.phone,
      guestEmail: form.email,
      novaPostCity: form.city,
      novaPostBranch: form.novaPoshtaBranch,
      paymentMethod: paymentMethod.toUpperCase() as "COD" | "CARD",
      finalPrice: Number(Math.round(finalPrice * 10) / 10),
      items: cart.map((item) => {
        const price =
          item.priceSale && item.priceSale < item.price
            ? item.priceSale
            : item.price;
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          finalPrice: +(price * item.quantity).toFixed(1),
          name: item.name,
          image: item.image,
          color: item.color,
          size: item.size,
          priceSale: item.priceSale + "",
        };
      }),
    });
  },

  getOrders: async (
    showAll = false,
    filters?: Filters,
    page = 1,
    limit = 10,
  ): Promise<IOrderResponse[]> => {
    const params: any = { page, limit };
    if (filters?.orderId) params.orderId = filters.orderId;
    if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters?.dateTo) params.dateTo = filters.dateTo;
    if (showAll) params.showAll = true;

    const response = await apiService.get("/orders/all", {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },

  updateOrderStatus: async (
    orderId: number,
    status: string,
  ): Promise<IOrderResponse> => {
    const response = await apiService.patch(
      `/orders/${orderId}/status`,
      {
        status,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    return response.data;
  },
};
