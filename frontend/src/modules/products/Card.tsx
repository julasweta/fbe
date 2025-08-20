import React from "react";
import { Link } from "react-router-dom";
import styles from "./Card.module.scss";
import { type EColor, type IProduct, sizeLabels } from "../../interfaces/IProduct";

interface CardProps {
  product: IProduct;
}

const colorMap: Record<EColor, string> = {
  RED: "#ff0000",
  GREEN: "#008000",
  BLUE: "#0000ff",
  BLACK: "#000000",
  WHITE: "#ffffff",
  YELLOW: "#ffff00",
  ORANGE: "#ffa500",
  PURPLE: "#800080",
  PINK: "#ffc0cb",
};

const Card: React.FC<CardProps> = ({ product }) => {
  const { id, translations, variants, price, priceSale } = product;

  const name =
    translations && translations.length > 0 ? translations[0].name : "Назва відсутня";

  // fallback: перший варіант
  const firstVariant = variants?.[0];
  const image = firstVariant?.images?.[0];

  // зібрати всі розміри і кольори з варіантів
  const allSizes = Array.from(new Set(variants?.flatMap((v) => v.sizes) || []));
  const allColors = Array.from(new Set(variants?.map((v) => v.color) || []));

  // fallback: ціни з варіантів
  const variantPrices =
    variants?.map((v) => v.price).filter((p): p is number => p !== null && p !== undefined) || [];
  const variantSalePrices =
    variants?.map((v) => v.priceSale).filter((p): p is number => p !== null && p !== undefined) ||
    [];

  const minVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : undefined;
  const minVariantSalePrice =
    variantSalePrices.length > 0 ? Math.min(...variantSalePrices) : undefined;

  // фінальні ціни: пріоритет product.price / product.priceSale
  const finalPrice = price ?? minVariantPrice;
  const finalSalePrice = priceSale ?? minVariantSalePrice;

  return (
    <div className={styles.card}>
      <Link to={`/product/${id}`} className={styles.imageWrapper}>
        {image ? (
          <img src={image.url} alt={image.altText || name} />
        ) : (
          <div className={styles.noImage}>Фото відсутнє</div>
        )}
      </Link>

      <p className={styles.name}>
        <Link to={`/product/${id}`}>{name}</Link>
      </p>

      <p className={styles.price}>
        {finalPrice ? (
          finalSalePrice && finalSalePrice < finalPrice ? (
            <>
              <span className={styles.priceSale}>₴{finalSalePrice.toFixed(2)}</span>
              <span className={styles.priceOriginal}>₴{finalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span>₴{finalPrice.toFixed(2)}</span>
          )
        ) : (
          "Ціна відсутня"
        )}
      </p>

      <div className={styles.features}>
        {allSizes.length > 0
          ? allSizes.map((size) => sizeLabels[size]).join(", ")
          : "Немає"}
        <br />
        {allColors.length > 0 ? (
          <div className={styles.colorDots}>
            {allColors.map((color) => (
              <span
                key={color}
                className={styles.colorDot}
                style={{ backgroundColor: colorMap[color] || "#ccc" }}
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




