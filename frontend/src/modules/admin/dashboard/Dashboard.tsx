import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Buttons/Button";
import { useProductStore } from "../../../store";
import Card from "../../products/Card";
import styles from "./Dashboard.module.scss";
import type { IProduct, ProductFilters } from "../../../interfaces/IProduct";
import { CategorySelect } from "../../../components/Category/CategorySelect";
import { CollectionSelect } from "../../../components/Collection/CollectionSelect";

const Dashboard = () => {
  const { products, fetchProducts } = useProductStore();

  const [categorySlug, setCategorySlug] = useState<string>("");
  const [collectionSlug, setCollectionSlug] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const filters: ProductFilters = {
        limit: 50,
        skip: 0,
        categorySlug: categorySlug || undefined,
        collectionSlug: collectionSlug || undefined,
      };
      await fetchProducts(filters);
      setIsLoading(false);
    };
    loadProducts();
  }, [fetchProducts, categorySlug, collectionSlug]);

  const handleDelete = (product: IProduct) => {
    if (window.confirm(`Видалити продукт ${product.translations?.[0]?.name}?`)) {
      useProductStore.getState().deleteProduct(product.id);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <CategorySelect<string>
          value={categorySlug}
          onChange={setCategorySlug}
          valueKey="slug"
        />
        
        <CollectionSelect
          value={collectionSlug}
          onChange={setCollectionSlug}
          valueKey="slug"
          multiple={false}
        />
      </div>

      <p>Всього продуктів: {products.length}</p>

      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <ul className={styles.cardsList}>
          {products.map((product) => (
            <div className={styles.cardWrapper} key={product.id}>
              <Card product={product} />
              <Button onClick={() => handleDelete(product)} title="Видалити" />
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;

