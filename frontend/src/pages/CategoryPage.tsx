import { useParams, Link } from "react-router-dom";
import styles from "./pages.module.scss";
import Products from "../modules/products/Products";
import { useCategoryStore } from "../store/useCategoryStore";

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { categories } = useCategoryStore();

  // Знаходимо поточну категорію за slug
  const currentCategory = categories.find(cat => cat.slug === categorySlug);

  // Знаходимо підкатегорії поточної категорії
  const subcategories = categories.filter(cat => cat.parentId === currentCategory?.id);

  // Функція для отримання стилю зображення
  const getImageStyle = (imageUrl?: string) => {
    if (imageUrl) {
      return {
        backgroundImage: `url(${imageUrl})`,
      };
    }
    return {};
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{currentCategory?.name || categorySlug?.toUpperCase()}</h2>

      {/* Відображення підкатегорій якщо вони є */}
      {subcategories.length > 0 && (
        <div className={styles.subcategories}>
          <div className={styles.subcategoriesList}>
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                to={`/category/${subcategory.slug}`}
                className={styles.subcategoryLink}
              >
                <div className={styles.category}>
                  <div
                    className={styles.categoryImage}
                    style={getImageStyle(subcategory.imageUrl)}
                    role="img"
                    aria-label={`Зображення категорії ${subcategory.name}`}
                  >
                    {/* Іконка або placeholder якщо потрібно */}
                    {!subcategory.imageUrl && (
                      <div className={styles.categoryIcon}>
                        📦
                      </div>
                    )}
                  </div>
                  <div className={styles.categoryName}>
                    {subcategory.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Products categorySlug={categorySlug} />
    </div>
  );
};

export default CategoryPage;