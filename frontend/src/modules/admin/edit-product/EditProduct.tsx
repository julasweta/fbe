// ProductEditForm.tsx
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";
import styles from "./ProductEditForm.module.scss";
import ImageUpload from "../upload-img/ImageUploader";
import { colorLabels, EColor, ESize, sizeLabels, type IProduct } from "../../../interfaces/IProduct";
import { useProductStore } from "../../../store";
import { productService } from "../../../services/ProductService";
import { CategorySelect } from "../../../components/Category/CategorySelect";
import { CollectionSelect } from "../../../components/Collection/CollectionSelect";

const colorHexMap: Record<EColor, string> = {
  [EColor.RED]: "#ff0000",
  [EColor.GREEN]: "#008000",
  [EColor.BLUE]: "#0000ff",
  [EColor.BLACK]: "#000000",
  [EColor.WHITE]: "#ffffff",
  [EColor.YELLOW]: "#ffff00",
  [EColor.ORANGE]: "#ffa500",
  [EColor.PURPLE]: "#800080",
  [EColor.PINK]: "#ffc0cb",
};



const EditProduct= () => {
  const { id } = useParams<{ id: string }>();
  const { editProduct } = useProductStore();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [manualImage, setManualImage] = useState("");

  const { register, control, handleSubmit, setValue, reset, watch } = useForm<IProduct>();

  const imagesArray = useFieldArray({ control, name: "images" });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const fetched = await productService.getById(Number(id));
          setProduct(fetched);
          reset({
            ...fetched,
            categoryId: fetched.categoryId ?? undefined,
            collectionIds: fetched.collectionIds ?? [],
            images: fetched.images?.length ? fetched.images : [{ url: "", altText: "" }],
          });
        }
      } catch (e) {
        console.error("Помилка при завантаженні продукту:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, reset]);

  const onSubmit = async (data: IProduct) => {
    if (!product) return;

    const cleanData = {
      ...data,
      images: data.images?.map(({ url, altText }) => ({ url, altText })),
      collectionIds: data.collectionIds?.map((cId) => Number(cId)),
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
    };

    try {
      await editProduct(product.id, cleanData);
      onClose();
    } catch (error) {
      console.error("Помилка при оновленні продукту:", error);
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (!product) return <p>Продукт не знайдено</p>;

  return (
    <div className={styles.editProduct}>
      <h2>Редагувати продукт</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* SKU */}
        <div className={styles.field}>
          <label>SKU *</label>
          <input {...register("sku", { required: true })} />
        </div>

        {/* Ціна */}
        <div className={styles.field}>
          <label>Ціна *</label>
          <input type="number" step="0.01" {...register("price", { required: true, valueAsNumber: true })} />
        </div>

        {/* Акційна ціна */}
        <div className={styles.field}>
          <label>Акційна ціна</label>
          <input type="number" step="0.01" {...register("priceSale", { valueAsNumber: true })} />
        </div>

        {/* Фото */}
        <h3>Фото</h3>
        {imagesArray.fields.map((field, index) => {
          const currentUrl = watch(`images.${index}.url`);
          return (
            <div key={field.id} className={styles.group}>
              <ImageUpload onUpload={(url) => setValue(`images.${index}.url`, url)} />
              <input
                type="text"
                placeholder="Встав URL вручну"
                value={manualImage}
                onChange={(e) => setManualImage(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  if (manualImage.trim()) {
                    setValue(`images.${index}.url`, manualImage.trim());
                    setManualImage("");
                  }
                }}
              >
                Add URL
              </button>
              <input placeholder="Alt text" {...register(`images.${index}.altText`)} />
              {currentUrl && (
                <img
                  src={currentUrl}
                  alt="preview"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              )}
              <button type="button" onClick={() => imagesArray.remove(index)}>✕</button>
            </div>
          );
        })}
        <button type="button" onClick={() => imagesArray.append({ url: "", altText: "" })}>
          + Додати фото
        </button>

        {/* Розміри */}
        <div className={styles.field}>
          <label>Розміри</label>
          <div className={styles.checkboxGroup}>
            {Object.values(ESize).map((size) => (
              <label key={size} className={styles.checkboxLabel}>
                <input type="checkbox" value={size} {...register("sizes")} />
                {sizeLabels[size]}
              </label>
            ))}
          </div>
        </div>

        {/* Кольори */}
        <div className={styles.field}>
          <label>Кольори</label>
          <div className={styles.colorGrid}>
            {Object.values(EColor).map((color) => (
              <label
                key={color}
                className={styles.colorLabel}
                style={{ backgroundColor: colorHexMap[color] }}
                title={colorLabels[color]}
              >
                <input type="checkbox" value={color} {...register("colors")} />
              </label>
            ))}
          </div>
        </div>

        {/* Категорія */}
        <div className={styles.field}>
          <label>Категорія</label>
          <CategorySelect
            value={watch("categoryId")}
            onChange={(val) => setValue("categoryId", val as number)}
            valueKey="id"
          />
        </div>

        {/* Колекції */}
        <div className={styles.field}>
          <label>Колекції</label>
          <CollectionSelect
            value={watch("collectionIds")?.[0] ?? ""}
            onChange={(val) => setValue("collectionIds", [Number(val)])}
            valueKey="id"
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn}>Зберегти</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
