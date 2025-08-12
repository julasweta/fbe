import { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore";
import styles from "./Products.module.scss";
import Card from "./Card";

const Products = () => {
  const { products, fetchProducts } = useProductStore(); // Додано fetchProducts
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchProducts(); // Викликаємо метод зі стору
        console.log("Products loaded successfully from store");
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [fetchProducts]); // Додано fetchProducts як залежність

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
    <div className={styles.productsContainer}>
      <h2>Продукти ({products.length})</h2>
      <div className={styles.productsContainer}>
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
