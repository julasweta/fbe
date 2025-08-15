import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "./CreateProduct.module.scss";
import ImageUpload from "../upload-img/ImageUploader";
import { productService } from "../../../services/ProductService";
import type { IProduct } from "../../../interfaces/IProduct";
import {
  ESize,
  EColor,
  sizeLabels,
  colorLabels,
} from "../../../interfaces/IProduct";
import { CategorySelect } from "../../../components/Category/CategorySelect";
import { CollectionSelect } from "../../../components/Collection/CollectionSelect";
// Мапа кольорів для відображення
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

const CreateProduct: React.FC = () => {
  const [manualImage, setManualImage] = useState<string>("");

  const { register, control, handleSubmit, reset, setValue, watch } =
    useForm<IProduct>({
      defaultValues: {
        sku: "",
        price: 0,
        priceSale: 0,
        images: [{ url: "", altText: "" }],
        translations: [{ name: "", description: "", languageId: 1 }],
        features: [{ text: "", order: 1 }],
        sizes: [],
        colors: [],
        collectionIds: [],
        categoryId: undefined,
      },
    });

  const imagesArray = useFieldArray({ control, name: "images" });
  const translationsArray = useFieldArray({ control, name: "translations" });
  const featuresArray = useFieldArray({ control, name: "features" });
  const onSubmit = async (data: IProduct) => {
    const cleanData = {
      ...data,
      translations: data.translations?.map(({ name, description, languageId }) => ({
        name,
        description,
        languageId,
      })),
      features: data.features?.map(({ text, order }) => ({
        text,
        order,
      })),
      images: data.images?.map(({ url, altText }) => ({
        url,
        altText,
      })),
      collectionIds: data.collectionIds?.map((id) => Number(id)),
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
    };

    try {
      await productService.addProduct(cleanData);
      reset();
    } catch (error) {
      console.error("Помилка при створенні продукту:", error);
    }
  };


  return (
    <div className={styles.createProduct}>
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* SKU */}
        <div className={styles.field}>
          <label>SKU *</label>
          <input {...register("sku", { required: true })} />
        </div>

        {/* Price */}
        <div className={styles.field}>
          <label>Price *</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: true, valueAsNumber: true })}
          />
        </div>

        {/* Sale Price */}
        <div className={styles.field}>
          <label>Sale Price</label>
          <input
            type="number"
            step="0.01"
            {...register("priceSale", { valueAsNumber: true })}
          />
        </div>

        {/* Images */}
        <h3>Images</h3>
        {imagesArray.fields.map((field, index) => {
          const currentUrl = watch(`images.${index}.url`);
          return (
            <div key={field.id} className={styles.group}>
              <ImageUpload
                onUpload={(url) => {
                  setValue(`images.${index}.url`, url);
                }}
              />
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
              <input
                placeholder="Alt text"
                {...register(`images.${index}.altText`)}
              />
              {currentUrl && (
                <img
                  src={currentUrl}
                  alt="preview"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              )}
              <button type="button" onClick={() => imagesArray.remove(index)}>
                ✕
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => imagesArray.append({ url: "", altText: "" })}
        >
          + Add Image
        </button>

        {/* Translations */}
        <h3>Translations</h3>
        {translationsArray.fields.map((field, index) => (
          <div key={field.id} className={styles.group}>
            <input placeholder="Name" {...register(`translations.${index}.name`)} />
            <input
              placeholder="Description"
              {...register(`translations.${index}.description`)}
            />
            <input
              type="number"
              placeholder="Language ID"
              {...register(`translations.${index}.languageId`, { valueAsNumber: true })}
            />
            <button type="button" onClick={() => translationsArray.remove(index)}>
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            translationsArray.append({
              name: "",
              description: "",
              languageId: 1,
            })
          }
        >
          + Add Translation
        </button>

        {/* Features */}
        <h3>Features</h3>
        {featuresArray.fields.map((field, index) => (
          <div key={field.id} className={styles.group}>
            <input placeholder="Feature text" {...register(`features.${index}.text`)} />
            <input
              type="number"
              placeholder="Order"
              {...register(`features.${index}.order`, { valueAsNumber: true })}
            />
            <button type="button" onClick={() => featuresArray.remove(index)}>
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={() => featuresArray.append({ text: "", order: 1 })}>
          + Add Feature
        </button>

        {/* Sizes */}
        <div className={styles.field}>
          <label>Sizes</label>
          <div className={styles.checkboxGroup}>
            {Object.values(ESize).map((size) => (
              <label key={size} className={styles.checkboxLabel}>
                <input type="checkbox" value={size} {...register("sizes")} />
                {sizeLabels[size]}
              </label>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className={styles.field}>
          <label>Colors</label>
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

        {/* Category */}
        <div className={styles.field}>
          <label>Category</label>
          <CategorySelect
            value={watch("categoryId")}
            onChange={(val) => setValue("categoryId", val as number)}
            valueKey="id"
          />
        </div>

        {/* Collections */}
        <div className={styles.field}>
          <label>Collections</label>
          <CollectionSelect
            value={watch("collectionIds")?.[0] ?? ""}
            onChange={(val) => setValue("collectionIds", [Number(val)])}
            valueKey="id"
          />
        </div>

        <button type="submit" className={styles.submit}>
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;


