import React from "react";
import styles from "./Product.module.scss";
import type { IProduct } from "../../store";



interface ProductProps {
  product: IProduct
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const { price, priceSale, images } = product;

  return (
    <div className={styles.product}>
      <div className={styles.imageWrapper}>
        {images && images.length > 0 && (
          <img src={images[0].url} alt={images[0].altText} />
        )}
      </div>

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
