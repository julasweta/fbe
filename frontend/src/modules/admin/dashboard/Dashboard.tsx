// Dashboard.tsx
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Buttons/Button";
import { useProductStore } from "../../../store";
import Card from "../../products/Card";
import styles from "./Dashboard.module.scss";
import type { IProduct, ProductFilters } from "../../../interfaces/IProduct";
import { CategorySelect } from "../../../components/Category/CategorySelect";
import { CollectionSelect } from "../../../components/Collection/CollectionSelect";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { products, fetchProducts, appendProducts, deleteProduct } = useProductStore();

  const [categorySlug, setCategorySlug] = useState<string>("");
  const [collectionSlug, setCollectionSlug] = useState<string>("");

  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 📌 вантажимо продукти при зміні фільтрів або сторінки
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);

      const filters: ProductFilters = {
        limit: 10,
        skip: page * 10,
        categorySlug: categorySlug || undefined,
        collectionSlug: collectionSlug || undefined,
      };

      if (page === 0) {
        await fetchProducts(filters); // перезапис
      } else {
        await appendProducts(filters); // додаємо
      }

      setIsLoading(false);
    };

    loadProducts();
  }, [page, categorySlug, collectionSlug, fetchProducts, appendProducts]);

  const handleDelete = (product: IProduct) => {
    if (window.confirm(`Видалити продукт ${product.translations?.[0]?.name}?`)) {
      deleteProduct(product.id);
    }
  };

  const handleFilterChange = () => {
    setPage(0); // при зміні фільтрів завжди починаємо з першої сторінки
  };

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <CategorySelect<string>
          value={categorySlug}
          onChange={(val) => {
            setCategorySlug(val);
            handleFilterChange();
          }}
          valueKey="slug"
        />

        <CollectionSelect
          value={collectionSlug}
          onChange={(val) => {
            setCollectionSlug(val);
            handleFilterChange();
          }}
          valueKey="slug"
          multiple={false}
        />
      </div>

      <p>Всього продуктів: {products.length}</p>

      {isLoading && <p>Завантаження...</p>}

      <ul className={styles.cardsList}>
        {products.map((product) => (
          <div className={styles.cardWrapper} key={product.id}>
            <Card product={product} />
            <Button className={`${styles.deleteButton} ${styles.button}`} onClick={() => handleDelete(product)}>
              Видалити
            </Button>
            <Button className={` ${styles.button}`} onClick={() => navigate(`/admin/edit-product/${product.id}`)}>
              Редагувати
            </Button>
          </div>
        ))}
      </ul>

      {/* Load more */}
      <div className={styles.loadMore}>
        <Button className={`${styles.loadMoreButton} ${styles.button}`} onClick={() => setPage((p) => p + 1)} disabled={isLoading}>
          Завантажити ще
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;

