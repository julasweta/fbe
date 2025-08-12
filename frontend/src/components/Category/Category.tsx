import React, { useEffect } from 'react';
import { useCategoryStore } from '../../store/useCategoryStore';

const Category: React.FC = () => {
  const { categories, loading, error, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) return <p>Завантаження категорій...</p>;
  if (error) return <p style={{ color: 'red' }}>Помилка: {error}</p>;

  return (
    <div>
      <h2>Категорії</h2>
      {categories.length === 0 ? (
        <p>Категорії відсутні</p>
      ) : (
        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>
              {cat.name} {cat.parentId ? `(Підкатегорія ID: ${cat.parentId})` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Category;
