import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Product from "../modules/products/Product";
import styles from "./pages.module.scss";

function ProductPage() {
  const params = useParams();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // useParams() спрацює лише на клієнті
    setId(params.id || null);
  }, [params.id]);

  if (!id) {
    return <div>Продукт не знайдено</div>;
  }

  return (
    <div className={styles.page}>
      <Product productId={id} />
    </div>
  );
}

export default ProductPage;

