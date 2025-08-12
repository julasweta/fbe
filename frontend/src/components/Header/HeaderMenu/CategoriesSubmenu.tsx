import React from "react";
import styles from "./HeaderMenu.module.scss";
import type { ICategory } from "../../../interfaces/ICategory";

interface CategoriesSubmenuProps {
  categories: ICategory[];
}

const CategoriesSubmenu: React.FC<CategoriesSubmenuProps> = ({ categories }) => {
  const rootCategories = categories.filter(cat => !cat.parentId);

  return (
    <>
      {rootCategories.map((cat) => {
        const subcategories = categories.filter(c => c.parentId === cat.id);

        return (
          <li key={cat.id} className={styles.submenuItem}>
            <a href={`/category/${cat.slug}`} className={styles.submenuLink}>
              {cat.name}
            </a>
            {subcategories.length > 0 && (
              <ul className={styles.subsubmenu}>
                {subcategories.map(sub => (
                  <li key={sub.id} className={styles.submenuItem}>
                    <a href={`/category/${sub.id}`} className={styles.submenuLink}>
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
