import React, { useEffect, useState } from "react";
import styles from "./Checkout.module.scss";
import { Button } from "../../components/ui/Buttons/Button";
import { useAuthStore } from "../../store";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { orderService } from "../../services/OrderService";
import type { CheckoutFormData } from "./CheckoutForm";
import CheckoutForm from "./CheckoutForm";

const Checkout: React.FC = () => {
  const { user } = useAuthStore();
  const { cart, setCart, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [form, setForm] = useState<CheckoutFormData>({
    fullName: user?.first_name || "",
    phone: "",
    email: user?.email || "",
    city: "",
    novaPoshtaBranch: ""
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
    if (cart.length === 0) {
      alert("🛒 Ваш кошик порожній");
      return;
    }

    if (!form.fullName || !form.phone || !form.city || !form.novaPoshtaBranch) {
      alert("⚠ Заповніть усі обов’язкові поля");
      return;
    }

    setLoading(true);
    try {
      if (user) {
        await orderService.createOrder(user?.id ?? null, cart, paymentMethod, form);
      }

      await orderService.sendTelegramOrder(
        {
          ...(user ? { id: user.id, email: user.email } : { guest: true }),
          ...form
        },
        cart,
        paymentMethod
      );

      localStorage.removeItem("cart");
      clearCart();
      alert("✅ Замовлення відправлено!");
    } catch (err) {
      console.error(err);
      alert("❌ Сталася помилка при оформленні замовлення");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => {
    const price =
      item.priceSale && item.priceSale < item.price ? item.priceSale : item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className={styles.checkout}>
      <h1>Оформлення замовлення</h1>

      <CheckoutForm form={form} setForm={setForm} />

      <div className={styles.summary}>
        {cart.map(item => (
          <div key={item.productId} className={styles.item}>
            <span>{item.name} x {item.quantity}</span>
            <span>
              ₴{(
                (item.priceSale && item.priceSale < item.price ? item.priceSale : item.price) *
                item.quantity
              ).toFixed(2)}
            </span>
          </div>
        ))}
        <div className={styles.total}>
          <strong>Загальна сума:</strong> ₴{total.toFixed(2)}
        </div>
      </div>

      <div className={styles.payment}>
        <h2>Метод оплати</h2>
        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          Оплата при отриманні
        </label>
        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
          />
          Оплата карткою онлайн
        </label>
      </div>

      <div className={styles.links}>
        <Link to="/delivery-terms">📦 Умови доставки</Link>
        <Link to="/return-policy">↩ Політика повернення</Link>
      </div>

      <Button onClick={handleOrder} disabled={loading}>
        {loading ? "Відправка..." : "Відправити замовлення"}
      </Button>
    </div>
  );
};

export default Checkout;
