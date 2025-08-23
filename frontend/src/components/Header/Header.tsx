import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";
import HeaderMenu from "./HeaderMenu/HeaderMenu";
import styles from "./Header.module.scss";
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/Buttons/Button";
import { useThemeStore } from "../../store/useThemeStore";
import { FaRegUser } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { useCartStore } from "../../store/useCartStore";

const Header: React.FC = () => {
  const { logout, accessToken, user } = useAuthStore();
  const { theme } = useThemeStore();
  const [textColor, setTextColor] = useState('#333333');
  const headerRef = useRef<HTMLDivElement>(null);
  const [hasInitializedCart, setHasInitializedCart] = useState(false);

  const { cart, fetchCart } = useCartStore();

  // Завантажуємо кошик тільки один раз при ініціалізації або зміні користувача
  useEffect(() => {
    // Якщо кошик ще не ініціалізований або змінився користувач
    if (!hasInitializedCart || (user && !cart.length)) {
      fetchCart();
      setHasInitializedCart(true);
    }
  }, [user?.id]); // Залежить тільки від ID користувача

  // Скидаємо флаг при логауті
  useEffect(() => {
    if (!accessToken) {
      setHasInitializedCart(false);
    }
  }, [accessToken]);

  useEffect(() => {
    const checkBackgroundSimple = () => {
      const sections = document.querySelectorAll('[data-bg]');
      const headerRect = headerRef.current?.getBoundingClientRect();
      if (!headerRect) return;

      let isDark = theme === 'dark';

      sections.forEach(section => {
        const sectionRect = section.getBoundingClientRect();

        if (sectionRect.top < headerRect.bottom && sectionRect.bottom > headerRect.top) {
          const bgAttr = section.getAttribute('data-bg');
          if (bgAttr === 'dark') {
            isDark = true;
          } else if (bgAttr === 'light') {
            isDark = false;
          }
        }
      });

      setTextColor(isDark ? '#ffffff' : '#333333');
    };

    // Створюємо Intersection Observer для відстеження секцій
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            checkBackgroundSimple();
          }
        });
      },
      {
        rootMargin: '0px 0px -80% 0px'
      }
    );

    // Спостерігаємо за всіма секціями
    const sections = document.querySelectorAll('section, .hero, .section, main > div, [data-section]');
    sections.forEach(section => observer.observe(section));

    // Початкова перевірка
    checkBackgroundSimple();

    // Також слухаємо скрол
    let scrollTimeout: number;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(checkBackgroundSimple, 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [theme]);

  return (
    <div
      ref={headerRef}
      className={styles.header}
      style={{
        color: textColor,
        transition: 'color 0.3s ease'
      }}
    >
      <div className={styles.logo}>FBE</div>
      <HeaderMenu textColor={textColor} />

      <div className={styles.authBlock}>
        {accessToken ? (
          <>
            <span
              className={styles.userName}
              style={{
                color: textColor,
                transition: 'color 0.3s ease'
              }}
            >
              {user?.first_name.toUpperCase()}
            </span>
            <Button
              className={styles.authButton}
              onClick={logout}
              style={{
                color: textColor,
                borderColor: textColor,
                backgroundColor: 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Link to="/login">
            <FaRegUser
              style={{
                color: textColor === '#ffffff' ? '#ffffff' : '#000000',
                fontSize: '1.5rem',
                transition: 'color 0.3s ease',
              }}
            />
          </Link>
        )}

        <Link to="/cart">
          <LuShoppingCart
            style={{
              color: textColor === '#ffffff' ? '#ffffff' : '#000000',
              fontSize: '1.5rem',
              transition: 'color 0.3s ease',
              marginLeft: '10px'
            }}
          />
        </Link>
        <span>{(cart.length > 0)? cart.length : '' }</span>
      </div>
    </div>
  );
};

export default Header;
