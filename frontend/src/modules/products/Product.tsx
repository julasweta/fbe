import React, { useEffect, useState } from "react";
import styles from "./Product.module.scss";
import { colorLabels, sizeLabels, type IProduct } from "../../interfaces/IProduct";
import { productService } from "../../services/ProductService";

interface ProductProps {
  productId: string;
}

const Product: React.FC<ProductProps> = ({ productId }) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const id = Number(productId);
        if (isNaN(id)) throw new Error("Невірний ID продукту");
        const data = await productService.getById(id);
        setProduct(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Помилка завантаження продукту");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (error) return <div className={styles.error}>Помилка: {error}</div>;
  if (!product) return <div className={styles.noProduct}>Продукт не знайдено</div>;

  const {
    images = [],
    translations = [],
    price,
    priceSale,
    features = [],
    sizes = [],
    colors = [],
  } = product;

  const translation = translations[0];

  return (
    <div className={styles.product}>
      <div className={styles.images}>
        {images.length > 0 ? (
          <img
            src={images[0].url}
            alt={images[0].altText || translation?.name || "Product image"}
            className={styles.mainImage}
          />
        ) : (
          <div className={styles.noImage}>Фото відсутнє</div>
        )}
      </div>

      <div className={styles.info}>
        <h1 className={styles.title}>{translation?.name || "Без назви"}</h1>

        {translation?.description && (
          <p className={styles.description}>{translation.description}</p>
        )}

        <div className={styles.priceWrapper}>
          {priceSale && priceSale < price ? (
            <>
              <span className={styles.priceSale}>₴{priceSale.toFixed(2)}</span>
              <span className={styles.priceOriginal}>₴{price.toFixed(2)}</span>
            </>
          ) : (
            <span className={styles.price}>₴{price.toFixed(2)}</span>
          )}
        </div>

        <div className={styles.features}>
          {features.length > 0 && (
            <>
              <h3>Особливості:</h3>
              <ul>
                {features.map((f) => (
                  <li key={f.id}>{f.text}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className={styles.attributes}>
          <div className={styles.sizes}>
            <h4>Розміри:</h4>
            <div className={styles.sizeList}>
              {sizes.map((size) => (
                <span key={size} className={styles.sizeItem}>
                  {sizeLabels[size]}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.colors}>
            <h4>Кольори:</h4>
            <div className={styles.colorList}>
              {colors.map((color) => (
                <span
                  key={color}
                  className={styles.colorCircle}
                  title={colorLabels[color]}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
