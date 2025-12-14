import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Product from "../modules/products/Product";
import styles from "./pages.module.scss";
import { Helmet } from "react-helmet";
import type { IProduct } from "../interfaces/IProduct";

function ProductPage() {
  const params = useParams();
  const [id, setId] = useState<string | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);

  // Отримання id з URL
  useEffect(() => {
    setId(params.id || null);
  }, [params.id]);

  // ====== Динамічний canonical після CMP ======
  useEffect(() => {
    if (!id) return;

    const updateCanonical = () => {
      const link = document.querySelector('link[rel="canonical"]');
      if (link) {
        link.setAttribute('href', `https://fbe.pp.ua/product/${id}/`);
      }
    };

    const interval = setInterval(updateCanonical, 200);
    setTimeout(() => clearInterval(interval), 2000);

    return () => clearInterval(interval);
  }, [id]);
  // ============================================

  // Завантаження продукту з API
  useEffect(() => {
    if (!id) return;

    fetch(`https://fbe-8ldlbw.fly.dev/products/${id}/`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(console.error);
  }, [id]);

  // ====== Динамічний title після CMP ======
  useEffect(() => {
    if (!product) return;

    const updateTitle = () => {
      document.title = `${product.translations[0].name} - FULL BODY ERA - FBE`;
    };

    const interval = setInterval(updateTitle, 200);
    setTimeout(() => clearInterval(interval), 2000);

    return () => clearInterval(interval);
  }, [product]);
  // ============================================

  if (!id) return <div>Продукт не знайдено</div>;
  if (!product) return <div>Завантаження продукту...</div>;

  // Вибираємо фото з order === 1, якщо є, інакше перше
  const getMainImage = () => {
    const images = product.variants?.[0]?.images || [];
    const orderedImage = images.find(img => img.order == 1);
    return orderedImage ? orderedImage.url : images[0]?.url || "https://res.cloudinary.com/divhalkcr/image/upload/v1757010788/3_r61yy0.jpg";
  };

  // JSON-LD для SEO
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.translations[0].name,
    image: [getMainImage()],
    description: product.translations[0].description || "",
    sku: `${product.id}`,
    offers: {
      "@type": "Offer",
      url: `https://fbe.pp.ua/product/${product.id}`,
      priceCurrency: "UAH",
      price: product.price ? String(product.price) : "0",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2027-12-31"
    },
    brand: {
      "@type": "Brand",
      "name": " FBE - FULL BODY ERA"
    },
  };


  return (
    <>
      <Helmet>
        {/* SEO meta - */}
        <meta
          name="description"
          content={product.translations[0].description?.slice(0, 150)}
        />
        <link rel="canonical" href={`https://fbe.pp.ua/product/${id}/`} />

        {/* Open Graph для Telegram/Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.translations[0].name} - FULL BODY ERA`} />
        <meta property="og:description" content={product.translations[0].description?.slice(0, 150)} />
       <meta property="og:image" content={getMainImage()} />
        <meta property="og:url" content={`https://fbe.pp.ua/product/${id}`} />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.translations[0].name} - FULL BODY ERA`} />
        <meta name="twitter:description" content={product.translations[0].description?.slice(0, 150)} />
        <meta name="twitter:image" content={getMainImage()} />

        {/* Schema.org (Google) */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className={styles.page}>
        <Product productId={id} />
      </div>
    </>
  );
}

export default ProductPage;





