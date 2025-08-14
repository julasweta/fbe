import { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore";
import styles from "./Products.module.scss";
import Card from "./Card";
import { Button } from "../../components/ui/Buttons/Button";
import type { ProductFilters } from '../../interfaces/IProduct';

interface ProductsProps {
  categorySlug?: string;
  collectionSlug?: string;
}

const Products = ({ categorySlug, collectionSlug }:ProductsProps) => {
  const { products, fetchProducts } = useProductStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      const filters: ProductFilters = {
        limit: 50,
        skip: 0,
        categorySlug: categorySlug || undefined,
        collectionSlug: collectionSlug || undefined, // You can add collectionSlug if needed
      };
      try {
        await fetchProducts(filters );
        console.log("Products loaded successfully from store");
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [fetchProducts, categorySlug, collectionSlug]);

  if (isLoading) {
    return (
      <div className={styles.productsGrid}>
        <h2>cATEGORY name</h2>
        <div className={styles.loading}>
          <p>Завантаження продуктів...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.productsGrid}>
        <h2>cATEGORY name</h2>
        <div className={styles.error}>
          <p>Помилка завантаження: {error}</p>
          <Button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Спробувати знову
          </Button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.productsGrid}>
        <div className={styles.emptyState}>
          <p>Товарів поки немає</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productsContainer}>

      {products.map((product) => (
        <div className={styles.cardWrapper} key={product.id}>
          <Card product={product} />
        </div>
      ))}

    </div>
  );
};

export default Products;
