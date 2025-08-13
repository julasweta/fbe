import React, { useState } from "react";
import styles from "./HeaderMenu.module.scss";
import type { ICategory } from "../../../interfaces/ICategory";

interface CategoriesSubmenuProps {
  categories: ICategory[];
}

const CategoriesSubmenu: React.FC<CategoriesSubmenuProps> = ({ categories }) => {
  const rootCategories = categories.filter(cat => !cat.parentId);
  const [openMenus, setOpenMenus] = useState<number[]>([]);

  const toggleMenu = (id: number) => {
    setOpenMenus(prev =>
      prev.includes(id) ? prev.filter(menuId => menuId !== id) : [...prev, id]
    );
  };

  return (
    <>
      {rootCategories.map((cat) => {
        const subcategories = categories.filter(c => c.parentId === cat.id);
        const isOpen = openMenus.includes(cat.id);

        return (
          <li key={cat.id} className={styles.submenuItem}>
            <div className={styles.submenuHeader}>
              {/* Лінк на категорію */}
              <a href={`/category/${cat.slug}`} className={styles.submenuLink}>
                {cat.name}
              </a>

              {/* Стрілочка для відкриття підменю */}
              {subcategories.length > 0 && (
                <button
                  type="button"
                  className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
                  onClick={() => toggleMenu(cat.id)}
                />
              )}
            </div>

            {/* Підкатегорії */}
            {isOpen && subcategories.length > 0 && (
              <ul className={styles.subsubmenu}>
                {subcategories.map(sub => (
                  <li key={sub.id} className={styles.submenuItem}>
                    <a href={`/category/${sub.slug}`} className={styles.submenuLink}>
                      {sub.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </>
  );
};

export default CategoriesSubmenu;

