// src/components/Header.tsx (альтернативний підхід)
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";
import HeaderMenu from "./HeaderMenu/HeaderMenu";
import styles from "./Header.module.scss";
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/Buttons/Button";
import { useThemeStore } from "../../store/useThemeStore";

const Header: React.FC = () => {
  const { logout, accessToken, user } = useAuthStore();
  const { theme } = useThemeStore();
  const [textColor, setTextColor] = useState('#333333');
  const headerRef = useRef<HTMLDivElement>(null);

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
        rootMargin: '0px 0px -80% 0px' // Спрацьовує коли секція досягає верху екрана
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

  useEffect(() => {
    useAuthStore.getState();
  }, [user]);

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
      <HeaderMenu textColor={ textColor} />
      
      <div className={styles.authBlock}>
        {user && user.role === "ADMIN" && (
          <Link
            to="/admin"
            style={{
              color: textColor,
              transition: 'color 0.3s ease'
            }}
          >
            Admin Panel
          </Link>
        )}
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
          <Link
            to="/login"
            className={styles.authButton}
            style={{
              color: textColor === '#ffffff' ? '#000000' : '#ffffff',
              backgroundColor: textColor === '#ffffff' ? '#ffffff' : '#97979e',
              borderColor: textColor,
              transition: 'all 0.3s ease'
            }}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
