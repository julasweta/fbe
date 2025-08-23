import type { ICartItem } from "../interfaces/ICartItem";
import type { CheckoutFormData } from "../modules/orders/CheckoutForm";
import { apiService } from "./ApiServices";

export const orderService = {
  async createOrder(
    userId: number | null,
    cart: ICartItem[],
    paymentMethod: string,
    form: CheckoutFormData,
  ) {
    console.log("➡️ Відправка замовлення на бекенд");

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
};
