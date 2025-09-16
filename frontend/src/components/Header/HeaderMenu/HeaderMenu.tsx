import React, { useEffect, useMemo, useState } from "react";
import styles from "./HeaderMenu.module.scss";
import CategoriesSubmenu from "./CategoriesSubmenu";
import CollectionsSubmenu from "./CollectionsSubmenu";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { useCollectionStore } from "../../../store/useCollectionStore";
import { Button } from "../../ui/Buttons/Button";
import { useAuthStore } from "../../../store";
import { Role } from "../../../interfaces/IRegister";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import LanguageSwitcher from "../../LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/useLanguageStore";

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
  const { t} = useTranslation();
  const lang = useLanguageStore((state) => state.lang);

  useEffect(() => {
    fetchCategories();
    fetchCollections();
  }, [fetchCategories, fetchCollections]);

  const menuItems = useMemo<MenuItem[]>(() => {
    return [
      { label: t('home'), link: '/' },
      { label: t('shop'), submenu: true },
      { label: t('about'), link: '/about' },
      { label: t('contact'), link: '/contact' },
      ...(user?.role === Role.ADMIN ? [{ label: 'Адмінка', link: '/admin' }] : [])
    ];
  }, [user, lang, t])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setOpenSubmenuIndex(null);
  };

  const toggleSubmenu = (index: number) => {
    setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
  };

  const dynamicStyles = {
    color: textColor,
    transition: 'color 0.3s ease',
    backgroundColor: "transparent",
    
  };

  const arrowStyles = {
    borderColor: `transparent ${textColor} ${textColor} transparent`,
    transition: 'border-color 0.3s ease'
  };

  const burgerSpanStyles = {
    backgroundColor: textColor,
    transition: 'background-color 0.3s ease'
  };

  const isMobile = useMediaQuery("(max-width: 950px)");

  //curl -H "User-Agent: Mozilla/5.0" https://fbe.pp.ua/product/35

  return (
    <nav className={styles.headerMenu}>
      <LanguageSwitcher />
   
      {isMobile &&
        <Button
        className={`${styles.burger} ${mobileMenuOpen ? styles.open : ""}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        style={dynamicStyles}
      >
        <span style={burgerSpanStyles} />
        <span style={burgerSpanStyles} />
        <span style={burgerSpanStyles} />
        </Button>}
      
 

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
                 
                  onClick={() => toggleSubmenu(index)}
                  aria-expanded={openSubmenuIndex === index}
                  
                  style={dynamicStyles}
                >
                  {item.label}
                  <span
                    className={`${styles.arrow} ${openSubmenuIndex === index ? styles.open : ""}`}
                    style={arrowStyles}
                  />
                </button>

                {(activeIndex === index || openSubmenuIndex === index) && (
                  <ul className={styles.submenu}>
                    <div className={styles.block}>
                      <li className="submenuTitle">{t('categories')}</li>
                      <CategoriesSubmenu categories={categories} />
                    </div>
                    <div className={styles.block}>
                      <li className="submenuTitle">{t('collections')}</li>
                      <CollectionsSubmenu collections={collections} />
                    </div>
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
