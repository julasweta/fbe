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
            {/* Контейнер з категорією та стрілкою */}
            <div
              className={styles.categoryContainer}
              onClick={() => subcategories.length > 0 && toggleMenu(cat.id)}
            >
              <a
                href={`/category/${cat.slug}`}
                className={styles.categoryLink}
                onClick={(e) => e.stopPropagation()} // Запобігає відкриттю підменю при кліку на посилання
              >
                {cat.name}
              </a>
              {subcategories.length > 0 && (
                <span className={`${styles.arrow} ${isOpen ? styles.open : ""}`} />
              )}
            </div>

            {/* Підкатегорії */}
            {isOpen && subcategories.length > 0 && (
              <ul className={styles.subsubmenu}>
                {subcategories.map(sub => (
                  <li key={sub.id}>
                    <a href={`/category/${sub.slug}`}>
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

