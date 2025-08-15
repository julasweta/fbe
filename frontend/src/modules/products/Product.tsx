import React, { useEffect, useState } from "react";
import styles from "./Product.module.scss";
import {
  colorLabels,
  EColor,
  ESize,
  sizeLabels,
  type IProduct
} from "../../interfaces/IProduct";
import { productService } from "../../services/ProductService";
import { Button } from "../../components/ui/Buttons/Button";
import Input from "../../components/ui/Inputs/Input";
import { cartService } from "../../services/CartService"; // сервіс для API кошика
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";

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
  const { setCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

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

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const id = Number(productId);
        if (isNaN(id)) throw new Error("Невірний ID продукту");
        const data = await productService.getById(id);
        setProduct(data);
        if (data) {
          setFormData((prev) => ({
            ...prev,
            color: (data.colors?.[0] as EColor) || "",
            size: (data.sizes?.[0] as ESize) || ""
          }));
        }
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Помилка завантаження продукту"
        );
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  const handleColorChange = (color: EColor) =>
    setFormData((prev) => ({ ...prev, color }));

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

    if (!formData.color && product.colors.length > 0) {
      setError("Будь ласка, оберіть колір");
      return;
    }
    if (!formData.size && product.sizes.length > 0) {
      setError("Будь ласка, оберіть розмір");
      return;
    }

    setIsAddingToCart(true);
    setError(null);

    try {
      const translation = product.translations?.[0];
      const cartItem: CartItem = {
        productId: product.id,
        name: translation?.name || "Без назви",
        price: product.price,
        priceSale: product.priceSale,
        color: formData.color,
        size: formData.size,
        quantity: formData.quantity,
        image: product.images?.[0]?.url
      };

      let updatedCart;
      if (user?.id) {
        // Авторизований — зберігаємо в БД
        updatedCart = await cartService.addToCart(user.id, cartItem);
      } else {
        // Гість — зберігаємо в localStorage
        updatedCart = cartService.addItem(cartItem);
      }

      setCart(updatedCart);
      setAddToCartSuccess(true);
      navigate("/cart");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Помилка додавання в кошик");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (error) return <div className={styles.error}>Помилка: {error}</div>;
  if (!product) return <div className={styles.noProduct}>Продукт не знайдено</div>;

  const { images = [], translations = [], price, priceSale, features = [], sizes = [], colors = [] } = product;
  const translation = translations[0];
  const finalPrice = priceSale && priceSale < price ? priceSale : price;
  const totalPrice = finalPrice * formData.quantity;

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

        {features.length > 0 && (
          <div className={styles.featuresSection}>
            <h3>Особливості:</h3>
            <ul className={styles.featuresList}>
              {features.map((feature) => (
                <li key={feature.id}>- {feature.text}</li>
              ))}
            </ul>
          </div>
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

        <div className={styles.productForm}>
          {colors.length > 0 && (
            <div className={styles.formGroup}>
              <h4>Колір: {formData.color ? colorLabels[formData.color] : "Не вибрано"}</h4>
              <div className={styles.colorOptions}>
                {colors.map((color) => (
                  <Button
                    key={color}
                    className={`${styles.colorOption} ${formData.color === color ? styles.selected : ""}`}
                    onClick={() => handleColorChange(color)}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className={styles.formGroup}>
              <h4>Розмір:</h4>
              <div className={styles.sizeOptions}>
                {sizes.map((size) => (
                  <Button
                    key={size}
                    className={`${styles.sizeOption} ${formData.size === size ? styles.selected : ""}`}
                    onClick={() => handleSizeChange(size)}
                  >
                    {sizeLabels[size]}
                  </Button>
                ))}
              </div>
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

          <div className={styles.productDetails}>
            <h4>Вибрані опції:</h4>
            <ul>
              {formData.color && <li>Колір: {colorLabels[formData.color]}</li>}
              {formData.size && <li>Розмір: {sizeLabels[formData.size]}</li>}
              <li>Кількість: {formData.quantity}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
