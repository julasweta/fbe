import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import styles from "./Categories.module.scss";
import type { ICategory } from "../../../interfaces/ICategory";

interface CategoriesSubmenuProps {
  categories: ICategory[];
}

const CategoriesSubmenu: React.FC<CategoriesSubmenuProps> = ({ categories }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleMouseEnter = (categoryId: number) => {
    if (isMobile) return; // на мобільних ігноруємо hover
    setExpandedCategories(prev => new Set(prev).add(categoryId));
  };

  const handleMouseLeave = (categoryId: number) => {
    if (isMobile) return; // на мобільних ігноруємо hover
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      newSet.delete(categoryId);
      return newSet;
    });
  };

  const renderMenu = (parentId: number | null = null) => {
    const items = categories.filter(cat =>
      parentId === null ? !cat.parentId : cat.parentId === parentId
    );
    if (!items.length) return null;

    return (
      <ul
        className={`${parentId === null ? styles.submenu : styles.subsubmenu} ${parentId !== null && expandedCategories.has(parentId) ? styles.open : ""
          }`}
      >
        {items.map(cat => {
          const hasChildren = categories.some(c => c.parentId === cat.id);
          const isExpanded = expandedCategories.has(cat.id);

          return (
            <li
              key={cat.id}
              className={styles.submenuItem}
              onMouseEnter={hasChildren ? () => handleMouseEnter(cat.id) : undefined}
              onMouseLeave={hasChildren ? () => handleMouseLeave(cat.id) : undefined}
            >
              <div
                className={styles.categoryContainer}
                onClick={
                  isMobile && hasChildren ? () => toggleCategory(cat.id) : undefined
                }
              >
                {hasChildren ? (
                  <span className={styles.iconContainer}>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                ) : (
                  <span className={styles.spacer} />
                )}

                <a href={`/category/${cat.slug}`} className={styles.categoryLink}>
                  {cat.name}
                </a>
              </div>

              {hasChildren && isExpanded && renderMenu(cat.id)}
            </li>
          );
        })}
      </ul>
    );
  };

  return <>{renderMenu()}</>;
};

export default CategoriesSubmenu;
