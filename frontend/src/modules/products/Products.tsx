// Products.tsx
import { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore";
import Product from "./Product";
import styles from "./Products.module.scss";
import { productService } from "../../services/ProductService";

const Products = () => {
  const { products } = useProductStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Завантажуємо продукти при монтуванні компонента
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await productService.getAll();
        console.log('Products loaded successfully');
      } catch (err) {
        console.error('Failed to load products:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Пустий масив залежностей - виконується один раз при монтуванні

  // Додаємо дебаг інформацію
  console.log('Products component render:', {
    productsCount: products.length,
    isLoading,
    error,
    products: products.slice(0, 2) // Показуємо перші 2 продукти для дебагу
  });

  if (isLoading) {
    return (
      <div className={styles.productsGrid}>
        <h2>Продукти</h2>
        <div className={styles.loading}>
          <p>Завантаження продуктів...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.productsGrid}>
        <h2>Продукти</h2>
        <div className={styles.error}>
          <p>Помилка завантаження: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.productsGrid}>
        <h2>Продукти</h2>
        <div className={styles.emptyState}>
          <p>Продуктів поки немає</p>
          <p>Додайте перші продукти через адмін панель</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productsGrid}>
      <h2>Продукти ({products.length})</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
