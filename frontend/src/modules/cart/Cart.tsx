import React, { useEffect, useState } from "react";
import styles from "./Cart.module.scss";
import { Button } from "../../components/ui/Buttons/Button";
import type { ICartItem } from "../../interfaces/ICartItem";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  // Завантаження кошика з localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart) as ICartItem[];
        // одразу перерахуємо finalPrice
        const withFinal = parsed.map(item => {
          const price = item.priceSale && item.priceSale < item.price ? item.priceSale : item.price;
          return { ...item, finalPrice: price * item.quantity };
        });
        setCartItems(withFinal);
      } catch {
        setCartItems([]);
      }
    }
    setIsInitialized(true);
  }, []);

  // Збереження у localStorage при зміні кошика (тільки після ініціалізації)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.productId === productId) {
          const newQty = Math.max(1, Math.min(99, quantity));
          const price = item.priceSale && item.priceSale < item.price ? item.priceSale : item.price;
          return { ...item, quantity: newQty, finalPrice: price * newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const total = cartItems.reduce((sum, item) => sum + item.finalPrice, 0);

  if (cartItems.length === 0) {
    return <div className={styles.empty}>Кошик порожній</div>;
  }

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) {
      alert("🛒 Кошик порожній");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className={styles.cart}>
      <h1>Кошик</h1>
      <div className={styles.cartItems}>
        {cartItems.map(item => {
          return (
            <CartItem
              key={item.productId}
              item={item}
              price={item.finalPrice / item.quantity}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          );
        })}
      </div>
      <div className={styles.total}>
        <h2>Загальна сума: ₴{total.toFixed(2)}</h2>
        <Button
          className={styles.checkout}
          onClick={handleGoToCheckout}
        >
          Оформити замовлення
        </Button>
      </div>
    </div>
  );
};

export default Cart;


