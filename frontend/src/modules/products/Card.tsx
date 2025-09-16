import React from "react";
import { Link } from "react-router-dom";
import styles from "./Card.module.scss";
import { colorHexMap, type IProduct, sizeLabels } from "../../interfaces/IProduct";
import { useLanguageStore } from "../../store/useLanguageStore";

interface CardProps {
  product: IProduct;
  isMainPage?: boolean;
}

const Card: React.FC<CardProps> = ({ product, isMainPage }) => {
  const { id, translations, variants, price, priceSale } = product;
  const lang = useLanguageStore((state) => state.lang);

  // Функція для отримання правильного перекладу
  const getTranslationByLanguage = (translations: IProduct['translations']) => {
    if (!translations || translations.length === 0) return null;

    // Мапинг кодів мов до languageId
    const languageIdMap = {
      'uk': 1,
      'en': 2
    };

    const targetLanguageId = languageIdMap[lang as keyof typeof languageIdMap];

    // Спочатку шукаємо переклад для поточної мови
    const translation = translations.find(t => t.languageId === targetLanguageId);

    // Якщо не знайдено, повертаємо перший доступний переклад
    return translation || translations[0];
  };

  // Отримуємо актуальний переклад
  const translation = getTranslationByLanguage(translations);
  const name = translation?.name || (lang === 'uk' ? "Назва відсутня" : "Name not available");

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

  // Тексти для різних мов
  const texts = {
    uk: {
      noImage: "Фото відсутнє",
      noPrice: "Ціна відсутня",
      noSizes: "Немає",
      noColors: "Немає"
    },
    en: {
      noImage: "Photo not available",
      noPrice: "Price not available",
      noSizes: "None",
      noColors: "None"
    }
  };

  const currentTexts = texts[lang as keyof typeof texts] || texts.uk;

  return (
    <div className={styles.card}>
      <Link to={`/product/${id}`} className={styles.imageWrapper} rel="canonical">
        {image ? (
          <img src={image.url} alt={image.altText || name} />
        ) : (
          <div className={styles.noImage}>{currentTexts.noImage}</div>
        )}
      </Link>

      <p className={`${styles.name} ${isMainPage ? styles.mainFont : ''}`}>
        <Link to={`/product/${id}`}>{name}</Link>
      </p>

      <p className={`${styles.price} ${isMainPage ? styles.mainFont : ''}`}>
        {finalPrice ? (
          finalSalePrice && finalSalePrice < finalPrice ? (
            <>
              <span className={!isMainPage ? styles.priceSale : ''}>₴{finalSalePrice.toFixed(2)} </span>
              <span className={styles.priceOriginal}>₴{finalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span>₴{finalPrice.toFixed(2)}</span>
          )
        ) : (
          currentTexts.noPrice
        )}
      </p>

      <div className={styles.features}>
        {!isMainPage ? (
          allSizes.length > 0
            ? allSizes.map((size) => sizeLabels[size]).join(", ")
            : currentTexts.noSizes
        ) : ''}
        {!isMainPage && <br />}
        {allColors.length > 0 ? (
          <div className={styles.colorDots}>
            {allColors.map((color) => (
              <span
                key={color}
                className={styles.colorDot}
                style={{ backgroundColor: colorHexMap[color] || "#ccc" }}
                title={color}
              />
            ))}
          </div>
        ) : (
          !isMainPage && currentTexts.noColors
        )}
      </div>
    </div>
  );
};

export default Card;




