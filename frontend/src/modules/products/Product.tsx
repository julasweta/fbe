// Product.tsx
import React, { useEffect, useState } from "react";
import styles from "./Product.module.scss";
import {
  colorHexMap,
  EColor,
  ESize,
  sizeLabels,
  type ICreateProductVariant,
  type IProduct
} from "../../interfaces/IProduct";
import { productService } from "../../services/ProductService";
import { Button } from "../../components/ui/Buttons/Button";
import Input from "../../components/ui/Inputs/Input";
import { useCartStore } from "../../store/useCartStore";
import type { ICartItem } from "../../interfaces/ICartItem";
import { useLanguageStore } from "../../store/useLanguageStore";

interface ProductProps {
  productId: string;
}

interface ProductFormData {
  variantId: number | null;
  size: ESize | null;
  quantity: number;
}

const Product: React.FC<ProductProps> = ({ productId }) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    variantId: null,
    size: null,
    quantity: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const id = Number(productId);
        if (isNaN(id)) throw new Error("Невірний ID продукту");
        const data = await productService.getById(id);
        setProduct(data);

        if (data?.variants?.length) {
          setFormData((prev) => ({
            ...prev,
            variantId: data.variants[0].id || null,
            size: (data.variants[0].sizes?.[0] as ESize) || null
          }));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Помилка завантаження продукту");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  // Отримуємо всі зображення з усіх варіантів для мініатюр
  const getAllImages = () => {
    if (!product?.variants) return [];

    return product.variants.flatMap(variant =>
      (variant.images || []).map(image => ({
        ...image,
        variantId: variant.id,
        variantColor: variant.color,
        variantSizes: variant.sizes
      }))
    );
  };

  const allImages = getAllImages();

  // Обробка кліку на мініатюру
  const handleThumbnailClick = (index: number) => {
    const selectedImage = allImages[index];
    if (!selectedImage) return;

    setSelectedImageIndex(index);

    // Переключаємо на відповідний варіант
    const newVariantId = selectedImage.variantId;
    const newSize = (selectedImage.variantSizes?.[0] as ESize) || null;

    setFormData(prev => ({
      ...prev,
      variantId: newVariantId || null,
      size: newSize
    }));
  };

  // Обробка зміни варіанта
  const handleVariantChange = (variantId: number) => {
    const newVariant = product?.variants.find((v) => v.id === variantId);
    setFormData((prev) => ({
      ...prev,
      variantId,
      size: (newVariant?.sizes?.[0] as ESize) || null
    }));

    // Знаходимо перше зображення нового варіанта та переключаємося на нього
    const newVariantImageIndex = allImages.findIndex(img => img.variantId === variantId);
    if (newVariantImageIndex !== -1) {
      setSelectedImageIndex(newVariantImageIndex);
    }
  };

  const handleSizeChange = (size: ESize) =>
    setFormData((prev) => ({ ...prev, size }));

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = Math.max(1, Math.min(99, Number(e.target.value)));
    setFormData((prev) => ({ ...prev, quantity }));
  };

  const handleQuantityIncrease = () =>
    setFormData((prev) => ({ ...prev, quantity: Math.min(prev.quantity + 1, 99) }));

  const handleQuantityDecrease = () =>
    setFormData((prev) => ({ ...prev, quantity: Math.max(prev.quantity - 1, 1) }));

  const handleAddToCart = async () => {
    if (!product) return;

    if (!formData.variantId) {
      setError(lang === 'uk' ? "Будь ласка, оберіть варіант" : "Please select a variant");
      return;
    }
    if (!formData.size) {
      setError(lang === 'uk' ? "Будь ласка, оберіть розмір." : "Please select a size.");
      return;
    }

    const variant = product.variants.find(
      (v) => v.id === formData.variantId && (!!formData.size && v.sizes.includes(formData.size))
    );

    if (!variant) {
      setError(lang === 'uk' ? "Обраний варіант недоступний" : "Selected variant is not available");
      return;
    }

    setIsAddingToCart(true);
    setError(null);

    try {
      const translation = getTranslationByLanguage(product.translations);
      const finalPrice =
        variant.priceSale && variant.priceSale < variant.price
          ? variant.priceSale
          : variant.price || product.priceSale || product.price;

      const cartItem: ICartItem = {
        productId: product.id,
        name: translation?.name || (lang === 'uk' ? "Без назви" : "No name"),
        price: finalPrice,
        color: variant.color,
        size: formData.size,
        quantity: formData.quantity,
        image: variant.images?.[0]?.url
      };

      await useCartStore.getState().addCartItem(cartItem);
      setAddToCartSuccess(true);

      setTimeout(() => {
        setAddToCartSuccess(false);
      }, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : (lang === 'uk' ? "Помилка додавання в кошик" : "Error adding to cart"));
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) return <div className={styles.loading}>{lang === 'uk' ? 'Завантаження...' : 'Loading...'}</div>;
  if (error) return <div className={styles.error}>{lang === 'uk' ? 'Помилка' : 'Error'}: {error}</div>;
  if (!product) return <div className={styles.noProduct}>{lang === 'uk' ? 'Продукт не знайдено' : 'Product not found'}</div>;

  const translation = getTranslationByLanguage(product.translations);
  const currentVariant = product.variants.find((v) => v.id === formData.variantId);
  const availableSizes = currentVariant?.sizes || [];
  const currentImage = allImages[selectedImageIndex];

  const finalPrice =
    (currentVariant?.priceSale && currentVariant.priceSale < currentVariant.price
      ? currentVariant.priceSale
      : currentVariant?.price) || product.priceSale || product.price;

  const totalPrice = finalPrice * formData.quantity;

  // Функція для генерації унікального ключа та назви варіанта
  function isEColor(value: string): value is EColor {
    return Object.values(EColor).includes(value as EColor);
  }

  const getVariantDisplayInfo = (variant: ICreateProductVariant) => {
    const displayName = variant.description || variant.color;

    const hexColor = isEColor(variant.color)
      ? colorHexMap[variant.color]
      : "#cccccc";

    return {
      key: variant.id,
      displayName,
      color: hexColor,
    };
  };

  // Тексти для різних мов
  const texts = {
    uk: {
      variant: "Варіант:",
      size: "Розмір:",
      quantity: "Кількість:",
      totalPrice: "Загальна ціна:",
      addToCart: "Додати в кошик",
      adding: "Додавання...",
      added: "✓ Додано в кошик!",
      features: "Особливості",
      delivery: "Доставка та повернення",
      deliveryInfo: [
        "Замовлення по Україні: «Нова пошта» (2-3 робочих дні)",
        "Замовлення по Польщі: «Нова пошта» (3-5 робочих днів)",
        "Замовлення по США та Канаді: «Canada Post» (1-3 робочих дні)",
        "Міжнародна доставка: Meest Express (10-12 робочих днів)"
      ],
      deliveryNote: "Для додаткової інформації звертайтесь у",
      noImage: "Фото відсутнє"
    },
    en: {
      variant: "Variant:",
      size: "Size:",
      quantity: "Quantity:",
      totalPrice: "Total price:",
      addToCart: "Add to cart",
      adding: "Adding...",
      added: "✓ Added to cart!",
      features: "Features",
      delivery: "Delivery and returns",
      deliveryInfo: [
        "Orders in Ukraine: «Nova Poshta» (2-3 business days)",
        "Orders in Poland: «Nova Poshta» (3-5 business days)",
        "Orders in USA and Canada: «Canada Post» (1-3 business days)",
        "International delivery: Meest Express (10-12 business days)"
      ],
      deliveryNote: "For additional information contact us on",
      noImage: "Photo not available"
    }
  };

  const currentTexts = texts[lang as keyof typeof texts] || texts.uk;

  return (
    <>
      <div className={styles.product}>
        <div className={styles.images}>
          {/* Основне зображення */}
          <div className={styles.mainImageContainer}>
            {currentImage ? (
              <img
                src={currentImage.url}
                alt={currentImage.altText || translation?.name || "Product image"}
                className={styles.mainImage}
              />
            ) : (
              <div className={styles.noImage}>{currentTexts.noImage}</div>
            )}
          </div>
          {/* Мініатюри */}
          {allImages.length > 0 && (
            <div className={styles.thumbnailContainer}>
              {allImages.map((image, index) => (
                <div
                  key={`${image.variantId}-${image.url}-${index}`}
                  className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.activeThumbnail : ""}`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image.url}
                    alt={image.altText || `Image ${index + 1}`}
                    className={styles.thumbnailImage}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{translation?.name || (lang === 'uk' ? "Без назви" : "No name")}</h1>
          {translation?.description && (
            <p className={styles.description}>{translation.description}</p>
          )}

          <div className={styles.nameBlock}>
            {/* опис варіанту */}
            <div className={styles.priceWrapper}>{currentVariant?.description}</div>
          </div>

          {/* ціна варіанта або ціна продукту */}
          <div className={styles.priceWrapper}>
            <span className={(+product.price > +finalPrice.toFixed(2)) ? styles.priceOriginal : styles.price}>
              {currentVariant && currentVariant.price ? '₴ ' + currentVariant.price.toFixed(2) : '₴ ' + product.price}
            </span>
          </div>

          {/* ціна зі знижкою */}
          {(+product.price > +finalPrice.toFixed(2)) && (
            <div className={styles.priceWrapper}>
              <span className={styles.priceSale}>₴{finalPrice.toFixed(2)}</span>
            </div>
          )}

          <div className={styles.productForm}>
            {product.variants.length > 0 && (
              <div className={styles.formGroup}>
                <h4>{currentTexts.variant}</h4>
                <div className={styles.colorOptions}>
                  {product.variants.map((variant) => {
                    const variantInfo = getVariantDisplayInfo(variant);
                    return (
                      <Button
                        key={variantInfo.key}
                        className={`${styles.colorOption} ${formData.variantId === variant.id ? styles.selected : ""}`}
                        onClick={() => { if (variant.id) handleVariantChange(variant.id) }}
                        style={{
                          backgroundColor: variantInfo.color.toLowerCase(),
                          width: '40px',
                          height: '40px',
                          minWidth: '40px',
                          padding: '0',
                          border: formData.variantId === variant.id ? '3px solid #000' : '1px solid #ccc'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div className={styles.formGroup}>
                <h4>{currentTexts.size}</h4>
                <div className={styles.sizeOptions}>
                  {availableSizes.map((size) => (
                    <Button
                      key={size}
                      className={`${styles.sizeOption} ${formData.size === size ? styles.selected : ""}`}
                      onClick={() => handleSizeChange(size as ESize)}
                    >
                      {sizeLabels[size] || size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className={styles.featuresSection}>
                <h3>{currentTexts.features}</h3>
                <ul className={styles.featuresList}>
                  {product.features
                    .sort((a, b) => a.order - b.order)
                    .map((feature) => (
                      lang === 'uk' ? (
                        <li key={feature.order + feature.text}>
                          <strong>{feature.text.split(" ")[0]}</strong>{" "}
                          {feature.text.split(" ").slice(1).join(" ")}
                        </li>
                      ) : (
                        <li key={feature.order + (feature.textEn || '')}>
                          <strong>{(feature.textEn || '').split(" ")[0]}</strong>{" "}
                          {(feature.textEn || '').split(" ").slice(1).join(" ")}
                        </li>
                      )
                    ))}
                </ul>
              </div>
            )}


            <div className={styles.formGroup}>
              <h4>{currentTexts.quantity}</h4>
              <div className={styles.quantityWrapper}>
                <Button
                  type="button"
                  className={styles.quantityBtn}
                  onClick={handleQuantityDecrease}
                  disabled={formData.quantity <= 1}
                >
                  −
                </Button>
                <Input
                  type="number"
                  min="1"
                  max="99"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  className={styles.quantityInput}
                />
                <Button
                  type="button"
                  className={styles.quantityBtn}
                  onClick={handleQuantityIncrease}
                  disabled={formData.quantity >= 99}
                >
                  +
                </Button>
              </div>
            </div>

            <div className={styles.totalPrice}>
              <strong>{currentTexts.totalPrice} ₴{totalPrice.toFixed(2)}</strong>
            </div>

            <Button
              className={`${styles.addToCartBtn} ${addToCartSuccess ? styles.success : ""}`}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart
                ? currentTexts.adding
                : addToCartSuccess
                  ? currentTexts.added
                  : currentTexts.addToCart}
            </Button>
          </div>

          <div className={styles.accordion}>
            <button
              className={styles.accordionBtn}
              onClick={() => setAccordionOpen(!accordionOpen)}
            >
              {currentTexts.delivery} {accordionOpen ? "▲" : "▼"}
            </button>
            {accordionOpen && (
              <div className={styles.accordionContent}>
                <ul>
                  {currentTexts.deliveryInfo.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p>
                  {currentTexts.deliveryNote}{" "}
                  <a
                    href="https://www.instagram.com/fbe.ua/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;