import React, { useState } from 'react';
import { useCategoryStore } from '../../store/useCategoryStore';
import styles from './Category.module.scss';

const Category: React.FC = () => {
  const { categories, loading, error } = useCategoryStore();
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);



  const toggleCategory = (id: number) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const renderCategories = (parentId: number | null = null, level: number = 0) => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .map(cat => {
        const hasChildren = categories.some(c => c.parentId === cat.id);
        const isExpanded = expandedCategories.includes(cat.id);

        return (
          <li key={cat.id}>
            <div
              className={styles.categoryItem}
              style={{ paddingLeft: `${level * 20}px` }}
              onClick={() => hasChildren && toggleCategory(cat.id)}
            >
              {hasChildren && (
                <span className={styles.arrow}>
                  {isExpanded ? '▼' : '▶'}
                </span>
              )}
              {cat.name}
            </div>
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
  if (error) return <p style={{ color: 'red' }}>Помилка: {error}</p>;

  return (
    <div className={styles.container}>
      <h2>Категорії</h2>
      {categories.length === 0 ? (
        <p>Категорії відсутні</p>
      ) : (
        <ul className={styles.categoryList}>
          {renderCategories(null, 0)}
        </ul>
      )}
    </div>
  );
};

export default Category;

