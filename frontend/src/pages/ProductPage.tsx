import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Product from "../modules/products/Product";
import styles from "./pages.module.scss";
import { Helmet } from "react-helmet";

function ProductPage() {
  const params = useParams();
  const [id, setId] = useState<string | null>(null);

  // Отримання id з URL
  useEffect(() => {
    setId(params.id || null);
  }, [params.id]);

  // ====== Оновлення canonical після CMP ======
  useEffect(() => {
    if (!id) return;

    const updateCanonical = () => {
      const link = document.querySelector('link[rel="canonical"]');
      if (link) {
        link.setAttribute('href', `https://fbe.pp.ua/product/${id}`);
      }
    };

    // Декілька спроб на випадок, якщо CMP ще не додав тег
    const interval = setInterval(updateCanonical, 200);
    setTimeout(() => clearInterval(interval), 2000);

    return () => clearInterval(interval);
  }, [id]);
  // ============================================

  if (!id) {
    return <div>Продукт не знайдено</div>;
  }

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`https://fbe.pp.ua/product/${id}`} />
      </Helmet>
      <div className={styles.page}>
        <Product productId={id} />
      </div>
    </>
  );
}

export default ProductPage;


