import React, { useState } from "react";
import styles from "./Header.module.scss";

interface MenuItem {
  label: string;
  link?: string;
  submenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { label: "Головна", link: "/" },
  {
    label: "Послуги",
    submenu: [
      { label: "Веб-розробка", link: "/services/web" },
      { label: "Мобільні додатки", link: "/services/mobile" },
      { label: "UI/UX дизайн", link: "/services/design" },
    ],
  },
  { label: "Про нас", link: "about" },
  { label: "Контакти", link: "/contact" },
];

const HeaderMenu: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setOpenSubmenuIndex(null);
  };

  const toggleSubmenu = (index: number) => {
    if (openSubmenuIndex === index) {
      setOpenSubmenuIndex(null);
    } else {
      setOpenSubmenuIndex(index);
    }
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

      <ul
        className={`${styles.menuList} ${mobileMenuOpen ? styles.menuListOpen : ""
          }`}
      >
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
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex} className={styles.submenuItem}>
                        <a href={subItem.link} className={styles.submenuLink}>
                          {subItem.label}
                        </a>
                      </li>
                    ))}
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
