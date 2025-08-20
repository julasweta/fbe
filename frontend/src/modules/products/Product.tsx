// Product.tsx
import React, { useEffect, useState } from "react";
import styles from "./Product.module.scss";
import {
  EColor,
  ESize,
  sizeLabels,
  type IProduct
} from "../../interfaces/IProduct";
import { productService } from "../../services/ProductService";
import { Button } from "../../components/ui/Buttons/Button";
import Input from "../../components/ui/Inputs/Input";
import { useCartStore } from "../../store/useCartStore";

interface ProductProps {
  productId: string;
}

interface ProductFormData {
  color: EColor | "";
  size: ESize | "";
  quantity: number;
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  priceSale?: number;
  color: string;
  size: string;
  quantity: number;
  image?: string;
}

const Product: React.FC<ProductProps> = ({ productId }) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    color: "",
    size: "",
    quantity: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
            color: data.variants[0].color as EColor,
            size: (data.variants[0].sizes?.[0] as ESize) || ""
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

    // Переключаємо колір та розмір відповідного варіанту
    const newColor = selectedImage.variantColor as EColor;
    const newSize = selectedImage.variantSizes?.[0] as ESize || "";

    setFormData(prev => ({
      ...prev,
      color: newColor,
      size: newSize
    }));
  };

  // Обробка зміни кольору
  const handleColorChange = (color: EColor) => {
    const newVariant = product?.variants.find((v) => v.color === color);
    setFormData((prev) => ({
      ...prev,
      color,
      size: newVariant?.sizes?.[0] || ""
    }));

    // Знаходимо перше зображення нового кольору та переключаємося на нього
    const newColorImageIndex = allImages.findIndex(img => img.variantColor === color);
    if (newColorImageIndex !== -1) {
      setSelectedImageIndex(newColorImageIndex);
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

    if (!formData.color) {
      setError("Будь ласка, оберіть колір");
      return;
    }
    if (!formData.size) {
      setError("Будь ласка, оберіть розмір");
      return;
    }

    const variant = product.variants.find(
      (v) => v.color === formData.color && v.sizes.includes(formData.size)
    );
    if (!variant) {
      setError("Обраний варіант недоступний");
      return;
    }



    setIsAddingToCart(true);
    setError(null);

    try {
      const translation = product.translations?.[0];
      const finalPrice =
        variant.priceSale && variant.priceSale < variant.price
          ? variant.priceSale
          : variant.price || product.priceSale || product.price;

      const cartItem: CartItem = {
        productId: product.id,
        name: translation?.name || "Без назви",
        price: finalPrice,
        color: formData.color,
        size: formData.size,
        quantity: formData.quantity,
        image: variant.images?.[0]?.url
      };

      await useCartStore.getState().addCartItem(cartItem);
      setAddToCartSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Помилка додавання в кошик");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (error) return <div className={styles.error}>Помилка: {error}</div>;
  if (!product) return <div className={styles.noProduct}>Продукт не знайдено</div>;

  const translation = product.translations?.[0];
  const currentVariant = product.variants.find((v) => v.color === formData.color);
  const availableSizes = currentVariant?.sizes || [];
  const currentImage = allImages[selectedImageIndex];

  const finalPrice =
    (currentVariant?.priceSale && currentVariant.priceSale < currentVariant.price
      ? currentVariant.priceSale
      : currentVariant?.price) || product.priceSale || product.price;
  console.log('currentVariant?.priceSale', currentVariant?.priceSale);
  console.log('currentVariant?.price', currentVariant?.price);
  console.log('product.priceSale', product.priceSale);
  console.log('currentVariant?.price', currentVariant?.price);
  console.log('product.price', product.price);
  console.log('finalPrice', finalPrice);



  const totalPrice = finalPrice * formData.quantity;


  return (
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
            <div className={styles.noImage}>Фото відсутнє</div>
          )}
        </div>

        {/* Мініатюри - всі зображення з усіх варіантів */}
        {allImages.length > 0 && (
          <div className={styles.thumbnailContainer}>
            {allImages.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
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
        <h1 className={styles.title}>{translation?.name || "Без назви"}</h1>
        {translation?.description && (
          <p className={styles.description}>{translation.description}</p>
        )}
        
        {/* ціна варіанта */}
        <div className={styles.priceWrapper}>
          <span className={(+product.price > +finalPrice.toFixed(2)) ? styles.priceOriginal : styles.price}>
            ₴{currentVariant && currentVariant.price.toFixed(2)}
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
              <h4>Колір:</h4>
              <div className={styles.colorOptions}>
                {product.variants.map((variant, index) => (
                  <Button
                    key={index}
                    className={`${styles.colorOption} ${formData.color === variant.color ? styles.selected : ""}`}
                    onClick={() => handleColorChange(variant.color)}
                    style={{
                      backgroundColor: variant.color.toLowerCase(),
                      width: '40px',
                      height: '40px',
                      minWidth: '40px',
                      padding: '0'
                    }}
                  >
                  </Button>
                ))}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div className={styles.formGroup}>
              <h4>Розмір:</h4>
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
              <h3>Особливості</h3>
              <ul className={styles.featuresList}>
                {product.features
                  .sort((a, b) => a.order - b.order)
                  .map((feature) => (
                    <li key={feature.order + feature.text}>{feature.text}</li>
                  ))}
              </ul>
            </div>
          )}

          <div className={styles.formGroup}>
            <h4>Кількість:</h4>
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
            <strong>Загальна ціна: ₴{totalPrice.toFixed(2)}</strong>
          </div>

          <Button
            className={`${styles.addToCartBtn} ${addToCartSuccess ? styles.success : ""}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart
              ? "Додавання..."
              : addToCartSuccess
                ? "✓ Додано в кошик!"
                : "Додати в кошик"}
          </Button>
        </div>

        <div className={styles.accordion}>
          <button
            className={styles.accordionBtn}
            onClick={() => setAccordionOpen(!accordionOpen)}
          >
            Доставка та повернення {accordionOpen ? "▲" : "▼"}
          </button>
          {accordionOpen && (
            <div className={styles.accordionContent}>
              <ul>
                <li>Замовлення по Україні: «Нова пошта» (2-3 робочих дні)</li>
                <li>Замовлення по Польщі: «Нова пошта» (3-5 робочих днів)</li>
                <li>Замовлення по США та Канаді: «Canada Post» (1-3 робочих дні)</li>
                <li>Міжнародна доставка: Meest Express (10-12 робочих днів)</li>
              </ul>
              <p>
                Для додаткової інформації звертайтесь у{" "}
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
  );
};

export default Product;