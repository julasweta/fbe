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
import { useTranslation } from "react-i18next";

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
  const { t} = useTranslation();

  const lang = useLanguageStore((state) => state.lang);

  // Переклад
  const getTranslationByLanguage = (translations: IProduct['translations']) => {
    if (!translations || translations.length === 0) return null;
    const languageIdMap = { uk: 1, en: 2 };
    const targetLanguageId = languageIdMap[lang as keyof typeof languageIdMap];
    return translations.find(t => t.languageId === targetLanguageId) || translations[0];
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
          const sortedVariants = [...data.variants].sort((a, b) => a.stock - b.stock);
          setFormData({
            variantId: sortedVariants[0].id || null,
            size: (sortedVariants[0].sizes?.[0] as ESize) || null,
            quantity: 1
          });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Помилка завантаження продукту");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  // Функція сортування варіантів за stock
  const getSortedVariants = () => {
    if (!product?.variants) return [];
    return [...product.variants].sort((a, b) => {
      // Спочатку доступні варіанти (stock > 0), потім недоступні (stock = 0)
      if (a.stock > 0 && b.stock === 0) return -1;
      if (a.stock === 0 && b.stock > 0) return 1;

      // Серед доступних варіантів сортуємо за кількістю stock (від більшого до меншого)
      return a.stock - b.stock;
    });
  };

  // Всі зображення всіх варіантів, відсортовані по order
  const getAllImages = () => {
    if (!product?.variants) return [];
    const sortedVariants = getSortedVariants();
    return sortedVariants.flatMap(variant =>
      (variant.images || [])
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(image => ({
          ...image,
          variantId: variant.id,
          variantColor: variant.color,
          variantSizes: variant.sizes
        }))
    );
  };
  const allImages = getAllImages();

  // Обробники
  const handleThumbnailClick = (index: number) => {
    const selectedImage = allImages[index];
    if (!selectedImage) return;
    setSelectedImageIndex(index);
    setFormData(prev => ({
      ...prev,
      variantId: selectedImage.variantId || null,
      size: (selectedImage.variantSizes?.[0] as ESize) || null
    }));
  };

  const handleVariantChange = (variantId: number) => {
    const newVariant = product?.variants.find(v => v.id === variantId);
    setFormData(prev => ({
      ...prev,
      variantId,
      size: (newVariant?.sizes?.[0] as ESize) || null
    }));
    const newVariantImageIndex = allImages.findIndex(img => img.variantId === variantId);
    if (newVariantImageIndex !== -1) setSelectedImageIndex(newVariantImageIndex);
  };

  const handleSizeChange = (size: ESize) => setFormData(prev => ({ ...prev, size }));
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = Math.max(1, Math.min(99, Number(e.target.value)));
    setFormData(prev => ({ ...prev, quantity }));
  };
  const handleQuantityIncrease = () => setFormData(prev => ({ ...prev, quantity: Math.min(prev.quantity + 1, 99) }));
  const handleQuantityDecrease = () => setFormData(prev => ({ ...prev, quantity: Math.max(prev.quantity - 1, 1) }));

  const handleAddToCart = async () => {
    if (!product) return;
    if (!formData.variantId) { setError(lang === 'uk' ? "Будь ласка, оберіть варіант" : "Please select a variant"); return; }
    if (!formData.size) { setError(lang === 'uk' ? "Будь ласка, оберіть розмір." : "Please select a size."); return; }

    const variant = product.variants.find(
      v => v.id === formData.variantId && v.sizes.includes(formData.size!)
    );
    if (!variant) { setError(lang === 'uk' ? "Обраний варіант недоступний" : "Selected variant is not available"); return; }

    setIsAddingToCart(true);
    setError(null);

    try {
      const translation = getTranslationByLanguage(product.translations);
      const finalPrice = variant.priceSale && variant.priceSale < variant.price
        ? variant.priceSale
        : variant.price || product.priceSale || product.price;

      const cartItem: ICartItem = {
        productId: product.id,
        name: translation?.name || (lang === 'uk' ? "Без назви" : "No name"),
        price: finalPrice,
        color: variant.color,
        size: formData.size!,
        quantity: formData.quantity,
        image: variant.images?.[0]?.url
      };

      await useCartStore.getState().addCartItem(cartItem);
      setAddToCartSuccess(true);
      setTimeout(() => setAddToCartSuccess(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : (lang === 'uk' ? "Помилка додавання в кошик" : "Error adding to cart"));
    } finally { setIsAddingToCart(false); }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!formData.variantId) { setError(lang === 'uk' ? "Будь ласка, оберіть варіант" : "Please select a variant"); return; }
    if (!formData.size) { setError(lang === 'uk' ? "Будь ласка, оберіть розмір." : "Please select a size."); return; }

    const variant = product.variants.find(
      v => v.id === formData.variantId && v.sizes.includes(formData.size!)
    );
    if (!variant) { setError(lang === 'uk' ? "Обраний варіант недоступний" : "Selected variant is not available"); return; }

    setIsAddingToCart(true);
    setError(null);

    try {
      const translation = getTranslationByLanguage(product.translations);
      const finalPrice = variant.priceSale && variant.priceSale < variant.price
        ? variant.priceSale
        : variant.price || product.priceSale || product.price;

      const cartItem: ICartItem = {
        productId: product.id,
        name: translation?.name || (lang === 'uk' ? "Без назви" : "No name"),
        price: finalPrice,
        color: variant.color,
        size: formData.size!,
        quantity: formData.quantity,
        image: variant.images?.[0]?.url
      };

      await useCartStore.getState().addCartItem(cartItem);

      // Перенаправляємо на checkout
      window.location.href = '/checkout';
    } catch (e) {
      setError(e instanceof Error ? e.message : (lang === 'uk' ? "Помилка додавання в кошик" : "Error adding to cart"));
    } finally { setIsAddingToCart(false); }
  };

  if (loading) return <div className={styles.loading}>{lang === 'uk' ? 'Завантаження...' : 'Loading...'}</div>;
  if (error) return <div className={styles.error}>{lang === 'uk' ? 'Помилка' : 'Error'}: {error}</div>;
  if (!product) return <div className={styles.noProduct}>{lang === 'uk' ? 'Продукт не знайдено' : 'Product not found'}</div>;

  const translation = getTranslationByLanguage(product.translations);
  const sortedVariants = getSortedVariants();
  const currentVariant = product.variants.find(v => v.id === formData.variantId);
  const availableSizes = currentVariant?.sizes || [];
  const currentImage = allImages[selectedImageIndex];

  const finalPrice = currentVariant?.priceSale && currentVariant.priceSale < currentVariant.price
    ? currentVariant.priceSale
    : currentVariant?.price || product.priceSale || product.price;

  const totalPrice = finalPrice * formData.quantity;

  function isEColor(value: string): value is EColor {
    return Object.values(EColor).includes(value as EColor);
  }

  const getVariantDisplayInfo = (variant: ICreateProductVariant) => ({
    key: variant.id,
    displayName: variant.description || variant.color,
    color: isEColor(variant.color) ? colorHexMap[variant.color] : "#cccccc",
    isOutOfStock: variant.stock === 0
  });



  return (
    <div className={styles.product}>
      <div className={styles.images}>
        <div className={styles.mainImageContainer}>
          {currentImage ? (
            <img
              src={currentImage.url}
              alt={currentImage.altText || translation?.name || "Product image"}
              className={styles.mainImage}
            />
          ) : <div className={styles.noImage}>{t(`noImage`)}</div>}
        </div>

        {allImages.length > 0 && (
          <div className={styles.thumbnailContainer}>
            {allImages.map((image, index) => (
              <div
                key={`${image.variantId}-${image.url}-${index}`}
                className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.activeThumbnail : ""}`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img src={image.url} alt={image.altText || `Image ${index + 1}`} className={styles.thumbnailImage} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <Button onClick={handleBuyNow} className={styles.buyNowBtn}>{t(`buyNow`)}</Button>
        <h1 className={styles.title}>{translation?.name || (lang === 'uk' ? "Без назви" : "No name")}</h1>
        {translation?.description && <p className={styles.description}>{translation.description}</p>}

        <div className={styles.nameBlock}>
          <div className={styles.priceWrapper}>{currentVariant?.description}</div>
        </div>

        <div className={styles.priceWrapper}>
          <span className={(+product.price > +finalPrice.toFixed(2)) ? styles.priceOriginal : styles.price}>
            {currentVariant && currentVariant.price ? '₴ ' + currentVariant.price.toFixed(2) : '₴ ' + product.price}
          </span>
        </div>

        {(+product.price > +finalPrice.toFixed(2)) && (
          <div className={styles.priceWrapper}>
            <span className={styles.priceSale}>₴{finalPrice.toFixed(2)}</span>
          </div>
        )}

        <div className={styles.productForm}>
          {sortedVariants.length > 0 && (
            <div className={styles.formGroup}>
              <h4>{t(`variant`)}</h4>
              <div className={styles.colorOptions}>
                {sortedVariants.map(variant => {
                  const variantInfo = getVariantDisplayInfo(variant);
                  return (
                    <div key={variantInfo.key} className={styles.colorOptionWrapper}>
                      <Button
                        className={`${styles.colorOption} ${formData.variantId === variant.id ? styles.selected : ""} ${variantInfo.isOutOfStock ? styles.outOfStock : ""}`}
                        onClick={() => { if (variant.id && !variantInfo.isOutOfStock) handleVariantChange(variant.id) }}
                        disabled={variantInfo.isOutOfStock}
                        style={{
                          backgroundColor: variantInfo.color.toLowerCase(),
                          width: '40px',
                          height: '40px',
                          minWidth: '40px',
                          padding: '0',
                          border: formData.variantId === variant.id ? '3px solid #000' : '1px solid #ccc',
                          opacity: variantInfo.isOutOfStock ? 0.5 : 1,
                          cursor: variantInfo.isOutOfStock ? 'not-allowed' : 'pointer'
                        }}
                      />
                      {variantInfo.isOutOfStock && (
                        <span className={styles.outOfStockLabel}>{t(`outOfStock`)}</span>
                      )}
                  
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div className={styles.formGroup}>
              <h4>{t(`size`)}</h4>
              <div className={styles.sizeOptions}>
                {availableSizes.map(size => (
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
              <h3>{t(`features`)}</h3>
              <ul className={styles.featuresList}>
                {product.features.sort((a, b) => a.order - b.order).map(feature => (
                  <li key={feature.order + (lang === 'uk' ? feature.text : feature.textEn || '')}>
                    <strong>{(lang === 'uk' ? feature.text : feature.textEn || '').split(" ")[0]}</strong>{" "}
                    {(lang === 'uk' ? feature.text : feature.textEn || '').split(" ").slice(1).join(" ")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.formGroup}>
            <h4>{t(`quantity`)}</h4>
            <div className={styles.quantityWrapper}>
              <Button type="button" className={styles.quantityBtn} onClick={handleQuantityDecrease} disabled={formData.quantity <= 1}>−</Button>
              <Input type="number" min="1" max="99" value={formData.quantity} onChange={handleQuantityChange} className={styles.quantityInput} />
              <Button type="button" className={styles.quantityBtn} onClick={handleQuantityIncrease} disabled={formData.quantity >= 99}>+</Button>
            </div>
          </div>

          <div className={styles.totalPrice}><strong>{t(`totalPrice`)} ₴{totalPrice.toFixed(2)}</strong></div>

          <Button
            className={`${styles.addToCartBtn} ${addToCartSuccess ? styles.success : ""}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart || (currentVariant?.stock === 0)}
          >
            {currentVariant?.stock === 0 ? t(`outOfStock`) :
              isAddingToCart ? t(`adding`) :
                addToCartSuccess ? t(`added`) :
                  t(`addToCart`)}
          </Button>

        
        </div>

        <div className={styles.accordion}>
          <button className={styles.accordionBtn} onClick={() => setAccordionOpen(!accordionOpen)}>
            {t(`delivery`)} {accordionOpen ? "▲" : "▼"}
          </button>
          {accordionOpen && (
            <div className={styles.accordionContent}>
              <ul>
                {(t("deliveryInfo", { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}

              </ul>
              <p>
                {t("deliveryNote")}{" "}
                <a href="https://www.instagram.com/fbe.ua/" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Product;
