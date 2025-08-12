import React, { useEffect, useState } from "react";
import styles from "./HeaderMenu.module.scss";
import CategoriesSubmenu from "./CategoriesSubmenu";
import CollectionsSubmenu from "./CollectionsSubmenu";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { useCollectionStore } from "../../../store/useCollectionStore";

interface MenuItem {
  label: string;
  link?: string;
  submenu?: boolean; // Якщо true — є підменю
}

const HeaderMenu: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);

  const { categories, fetchCategories } = useCategoryStore();
  const { collections, fetchCollections } = useCollectionStore();

  console.log("Categories:", categories);
  console.log("Collections:", collections);

  useEffect(() => {
    fetchCategories();
    fetchCollections();
  }, [fetchCategories, fetchCollections]);

  const menuItems: MenuItem[] = [
    { label: "Головна", link: "/" },
    { label: "Магазин", submenu: true },
    { label: "Про нас", link: "about" },
    { label: "Контакти", link: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setOpenSubmenuIndex(null);
  };

  const toggleSubmenu = (index: number) => {
    setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
  };

  return (
    <nav className={styles.headerMenu}>
      <button
        className={`${styles.burger} ${mobileMenuOpen ? styles.open : ""}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

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
                <button
                  type="button"
                  className={styles.menuLink}
                  onClick={() => toggleSubmenu(index)}
                  aria-expanded={openSubmenuIndex === index}
                >
                  {item.label}
                  <span className={styles.arrow} />
                </button>

                {(activeIndex === index || openSubmenuIndex === index) && (
                  <ul className={styles.submenu}>
                    <li className={styles.submenuItem}>
                      <span className={styles.submenuLink}>Категорії</span>
                      <ul className={styles.subsubmenu}>
                        <CategoriesSubmenu categories={categories} />
                      </ul>
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
              <a href={item.link} className={styles.menuLink}>
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
