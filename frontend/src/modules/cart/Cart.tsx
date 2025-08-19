import React, { useEffect, useState } from "react";
import styles from "./Cart.module.scss";
import { Button } from "../../components/ui/Buttons/Button";
import type { ICartItem } from "../../interfaces/ICartItem";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from "../../store";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const { cart, fetchCart } = useCartStore();
  const { user } = useAuthStore()

  useEffect(() => {
    if (user)
      if (user?.id) {
        fetchCart(); // завантажуємо з бекенду
      }
  }, [user, fetchCart]);

  console.log('cart - ', cart)

  // Завантаження кошика з localStorage
  useEffect(() => {
    if (cart.length > 0) {
      // ⚡ якщо дані прийшли з бекенду — використовуємо їх
      const withFinal = cart.map(item => {
        const price = item.priceSale && item.priceSale < item.price ? item.priceSale : item.price;
        return { ...item, finalPrice: price * item.quantity };
      });
      setCartItems(withFinal);
    } else {
      // ⚡ інакше пробуємо localStorage
      const stored = localStorage.getItem("cart");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as ICartItem[];
          const withFinal = parsed.map(item => {
            const price = item.priceSale && item.priceSale < item.price ? item.priceSale : item.price;
            return { ...item, finalPrice: price * item.quantity };
          });
          setCartItems(withFinal);
        } catch {
          setCartItems([]);
        }
      }
    }
    setIsInitialized(true);
  }, [cart]);


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

  const removeItem = (cartItem: ICartItem) => {
    console.log(cartItem);
    if (cartItem.id) {
      // 🟢 авторизований → видаляємо по id з бекенду
      setCartItems(prev => prev.filter(item => item.id !== cartItem.id));
      useCartStore.getState().deleteCartItem(cartItem.id);
    } else {
      // 🟢 гість → видаляємо по унікальному productId + size + color
      setCartItems(prev =>
        prev.filter(item =>
          !(
            item.productId === cartItem.productId &&
            item.color === cartItem.color &&
            item.size === cartItem.size
          )
        )
      );
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  };



  const total = cartItems.reduce((sum, item) => sum + (item.finalPrice ?? 0), 0);


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
        {cartItems.map((item, index) => {
          return (
            <CartItem
              key={index}
              item={item}
              price={item.finalPrice ? (item.finalPrice / item.quantity) : 0}
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


