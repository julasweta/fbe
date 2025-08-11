import React from "react";
import styles from "./Product.module.scss";

interface ProductImage {
  id: number;
  url: string;
  altText?: string;
}

interface ProductTranslation {
  name: string;
  description?: string;
}

interface ProductProps {
  product: {
    id: number;
    price: number;
    priceSale: number;
    images: ProductImage[];
    translation: ProductTranslation;
  };
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const { price, priceSale, images, translation } = product;

  return (
    <div className={styles.product}>
      <div className={styles.imageWrapper}>
        {images.length > 0 && (
          <img src={images[0].url} alt={images[0].altText || translation.name} />
        )}
      </div>
      <h3 className={styles.name}>{translation.name}</h3>
      <p className={styles.price}>
        {priceSale < price ? (
          <>
            <span className={styles.priceSale}>₴{priceSale.toFixed(2)}</span>
            <span className={styles.priceOriginal}>₴{price.toFixed(2)}</span>
          </>
        ) : (
          <span>₴{price.toFixed(2)}</span>
        )}
      </p>
    </div>
  );
};

export default Product;
