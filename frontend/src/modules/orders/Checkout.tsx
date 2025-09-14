import React, { useEffect, useState } from "react";
import styles from "./Checkout.module.scss";
import { Button } from "../../components/ui/Buttons/Button";
import { useAuthStore } from "../../store";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { orderService } from "../../services/OrderService";
import type { CheckoutFormData } from "./CheckoutForm";
import CheckoutForm from "./CheckoutForm";
import Input from "../../components/ui/Inputs/Input";

const Checkout: React.FC = () => {
  const { user } = useAuthStore();
  const { cart, setCart, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");

  const [form, setForm] = useState<CheckoutFormData>({
    fullName: (user?.first_name + " " + user?.last_name) || "",
    phone: "",
    email: user?.email || "",
    areaRef: undefined,
    cityRef: undefined,
    cityName: undefined,
    branchRef: undefined,
    branchName: undefined,
  });


  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        setCart([]);
      }
    }
  }, [setCart]);

  const handleOrder = async () => {
    if (!form.fullName || !form.phone || !form.areaRef || !form.cityRef || !form.branchRef) {
      alert("⚠ Заповніть усі обов’язкові поля");
      return;
    }

  if (cart.length === 0) {
      alert("🛒 Ваш кошик порожній");
      return;
    }  

    setLoading(true);
    try {
      // Використовуємо збережені назви міста та відділення
      const orderData = {
        ...form,
        city: form.cityName,
        novaPoshtaBranch: form.branchName,
      };

      await orderService.createOrder(user?.id ?? null, cart, paymentMethod, orderData);

      localStorage.removeItem("cart");
      clearCart();
      if (user) useCartStore.getState().deleteCartItems();

      alert("✅ Замовлення відправлено!");
    } catch (err) {
      console.error(err);
      alert("❌ Сталася помилка при оформленні замовлення");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => {
    const price = item?.priceSale && item?.priceSale < item?.price ? item.priceSale : item?.price || 0;
    const qty = item?.quantity ?? 1;
    return sum + price * qty;
  }, 0);

  return (
    <div className={styles.checkout}>
      <h1>Оформлення замовлення</h1>

      <CheckoutForm
        form={form}
        setForm={setForm}
      />

      <div className={styles.summary}>
        {cart.map(item => {
          const price = item?.priceSale && item?.priceSale < item?.price ? item.priceSale : item?.price || 0;
          const qty = item?.quantity ?? 1;
          return (
            <div key={item.id} className={styles.item}>
              <span>{item?.name} x {qty}</span>
              <span>₴{(price * qty).toFixed(2)}</span>
            </div>
          );
        })}
        <div className={styles.total}>
          <strong>Загальна сума:</strong> ₴{total.toFixed(2)}
        </div>
      </div>

      <div className={styles.payment}>
        <h2>Метод оплати</h2>

        <Input
          label="Оплата при отриманні"
          type="radio"
          value="cod"
          checked={paymentMethod === "cod"}
          onChange={() => setPaymentMethod("cod")}
        />

        <Input
          label="Оплата карткою онлайн"
          type="radio"
          value="card"
          checked={paymentMethod === "card"}
          onChange={() => setPaymentMethod("card")}
        />
      </div>

      <div className={styles.links}>
        <Link to="/delivery-terms" className="link">📦 Умови доставки та повернення</Link>
      </div>

      <Button onClick={handleOrder} disabled={loading}>
        {loading ? "Відправка..." : "Відправити замовлення"}
      </Button>
    </div>
  );
};

export default Checkout;
