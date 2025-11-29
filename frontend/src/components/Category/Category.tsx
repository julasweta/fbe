import React, { useEffect, useState } from "react";
import { useCategoryStore } from "../../store/useCategoryStore";
import styles from "./Category.module.scss";
import { useTranslation } from "react-i18next";

const Category: React.FC = () => {
  const { categories, loading, error } = useCategoryStore();
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const { t} = useTranslation();

  useEffect(() => {
    if (categories.length > 0) {
      setExpandedCategories(categories.map(cat => cat.id));
    }
  }, [categories]);

  const renderCategories = (parentId: number | null = null, level: number = 0) => {
    const filtered = categories.filter(cat =>
      parentId === null || parentId === 0
        ? !cat.parentId || cat.parentId === 0
        : cat.parentId === parentId
    );

    return filtered.map(cat => {
      const hasChildren = categories.some(c => c.parentId === cat.id);
      const isExpanded = expandedCategories.includes(cat.id);

      return (
        <li key={cat.id}>
          <div
            className={styles.categoryItem}
            style={{ paddingLeft: `${level * 20}px` }}
          >
            {hasChildren && (
              <span className={styles.arrow}>
                {isExpanded ? "▼" : "▶"}
              </span>
            )}
            <span className={styles.name}>{cat.name}</span>
          </div>

          {/* ✅ підкатегорії тільки у <ul>, не напряму у <li> */}
          {isExpanded && hasChildren && (
            <ul className={styles.subList}>
              {renderCategories(cat.id, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  };


  if (loading) return <p>Завантаження категорій...</p>;
  if (error) return <p style={{ color: "red" }}>Помилка: {error}</p>;

  return (
    <div className={styles.container}>
      <h2>{t('categories')}</h2>
      {categories.length === 0 ? (
        <p>Категорії відсутні</p>
      ) : (
        <ul className={styles.categoryList}>{renderCategories()}</ul>
      )}
    </div>
  );
};

export default Category;
