import React, { useEffect, useMemo, useState } from "react";
import styles from "./HeaderMenu.module.scss";
import CategoriesSubmenu from "./CategoriesSubmenu";
import CollectionsSubmenu from "./CollectionsSubmenu";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { useCollectionStore } from "../../../store/useCollectionStore";
import { Button } from "../../ui/Buttons/Button";
import { useAuthStore } from "../../../store";
import { Role } from "../../../interfaces/IRegister";

interface MenuItem {
  label: string;
  link?: string;
  submenu?: boolean;
}

interface HeaderMenuProps {
  textColor: string;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ textColor }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);

  const { categories, fetchCategories } = useCategoryStore();
  const { collections, fetchCollections } = useCollectionStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCategories();
    fetchCollections();
  }, [fetchCategories, fetchCollections]);

  const menuItems = useMemo<MenuItem[]>(() => {
    const baseMenu: MenuItem[] = [
      { label: "Головна", link: "/" },
      { label: "Магазин", submenu: true },
      { label: "Про нас", link: "/about" },
      { label: "Контакти", link: "/contact" },
    ];

    if (user?.role === Role.ADMIN) {
      return [...baseMenu, { label: "Адмінка", link: "/admin" }];
    }

    return baseMenu;
  }, [user?.role]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setOpenSubmenuIndex(null);
  };

  const toggleSubmenu = (index: number) => {
    setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
  };

  // Стилі з динамічним кольором
  const dynamicStyles = {
    color: textColor,
    transition: 'color 0.3s ease'
  };

  const arrowStyles = {
    borderColor: `transparent ${textColor} ${textColor} transparent`,
    transition: 'border-color 0.3s ease'
  };

  const burgerSpanStyles = {
    backgroundColor: textColor,
    transition: 'background-color 0.3s ease'
  };

  return (
    <nav className={styles.headerMenu}>
      <Button
        className={`${styles.burger} ${mobileMenuOpen ? styles.open : ""}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        style={dynamicStyles}
      >
        <span style={burgerSpanStyles} />
        <span style={burgerSpanStyles} />
        <span style={burgerSpanStyles} />
      </Button>

      <ul className={`${styles.menuList} ${mobileMenuOpen ? styles.menuListOpen : ""}`}>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={styles.menuItem}
            onMouseEnter={() => !mobileMenuOpen && setActiveIndex(index)}
            onMouseLeave={() => !mobileMenuOpen && setActiveIndex(null)}
          >
            {item.submenu ? (
              <>
                <Button
                  type="button"
                  className={styles.menuLink}
                  onClick={() => toggleSubmenu(index)}
                  aria-expanded={openSubmenuIndex === index}
                  style={dynamicStyles}
                >
                  {item.label}
                  <span
                    className={`${styles.arrow} ${openSubmenuIndex === index ? styles.open : ""}`}
                    style={arrowStyles}
                  />
                </Button>

                {(activeIndex === index || openSubmenuIndex === index) && (
                  <ul className={styles.submenu}>
                    <li className={styles.submenuItem}>
                      <span className={styles.submenuLink}>Категорії</span>
                      
                        <CategoriesSubmenu categories={categories} />
                      
                    </li>
                    <li className={styles.submenuItem}>
                      <span className={styles.submenuLink}>Колекції</span>
                      <ul className={styles.subsubmenu}>
                        <CollectionsSubmenu collections={collections} />
                      </ul>
                    </li>
                  </ul>
                )}
              </>
            ) : (
              <a
                href={item.link}
                className={styles.menuLink}
                style={dynamicStyles}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HeaderMenu;