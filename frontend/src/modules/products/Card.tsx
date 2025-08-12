import React from "react";
import styles from "./Card.module.scss";
import { type IProduct,  type EColor, sizeLabels } from "../../store";

interface CardProps {
  product: IProduct;
}

const colorMap: Record<EColor, string> = {
  RED: "#ff0000",
  BLUE: "#0000ff",
  BLACK: "#000000",
  WHITE: "#ffffff",
  GREEN: "#008000",
  YELLOW: "#ffff00",
};

const Card: React.FC<CardProps> = ({ product }) => {
  const { price, priceSale, images, translations, sizes, colors } = product;

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
        {sizes && sizes.length > 0
          ? sizes.map((size) => sizeLabels[size]).join(", ")
          : "Немає"}

        <br />

        {colors && colors.length > 0 ? (
          <div className={styles.colorDots}>
            {colors.map((color) => (
              <span
                key={color}
                className={styles.colorDot}
                style={{ backgroundColor: colorMap[color] }}
                title={color}
              />
            ))}
          </div>
        ) : (
          "Немає"
        )}
      </div>
    </div>
  );
};

export default Card;


