import React from "react";
import styles from "./Card.module.scss";
import { type IProduct, type ESize, type EColor, sizeLabels, colorLabels } from "../../store";

interface CardProps {
  product: IProduct;
}

const Card: React.FC<CardProps> = ({ product }) => {
  const { price, priceSale, images, translations, sizes, colors } = product;

  console.log("Rendering Card for product:", product);

  // Візьмемо назву з першого перекладу (якщо є)
  const name = translations && translations.length > 0 ? translations[0].name : "Назва відсутня";

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {images && images.length > 0 && (
          <img src={images[0].url} alt={images[0].altText} />
        )}
      </div>

      <p className={styles.name}>{name}</p>

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

      <div className={styles.features}>
        <strong>Розміри:</strong>{" "}
        {sizes && sizes.length > 0
          ? sizes.map((size) => sizeLabels[size as ESize]).join(", ")
          : "Немає"}

        <br />

        <strong>Кольори:</strong>{" "}
        {colors && colors.length > 0
          ? colors.map((color) => colorLabels[color as EColor]).join(", ")
          : "Немає"}
      </div>
    </div>
  );
};

export default Card;

