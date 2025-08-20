import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "./CreateProduct.module.scss";
import { productService } from "../../../services/ProductService";
import {
  ESize,
  EColor,
  sizeLabels,
  colorLabels,
  type ICreateProduct,
} from "../../../interfaces/IProduct";
import { CategorySelect } from "../../../components/Category/CategorySelect";
import { CollectionSelect } from "../../../components/Collection/CollectionSelect";
import { VariantImages } from "../../images/Images";

const CreateProduct: React.FC = () => {
  const { register, control, handleSubmit, reset, setValue, watch } =
    useForm<ICreateProduct>({
      defaultValues: {
        sku: "",
        price: 0,
        priceSale: 0,
        categoryId: undefined,
        collectionId: 1,
        translations: [{ name: "", description: "", languageId: 1 }],
        features: [{ text: "", order: 1 }],
        variants: [], // 🔹 спочатку порожній масив
      },
    });

  const translationsArray = useFieldArray({ control, name: "translations" });
  const featuresArray = useFieldArray({ control, name: "features" });
  const variantsArray = useFieldArray({ control, name: "variants" });

  const watchPrice = watch("price");
  const watchPriceSale = watch("priceSale");

  const onSubmit = async (data: ICreateProduct) => {
    try {
      const payload = {
        ...data,
        collectionId: Number(data.collectionId),
        variants: data.variants.map((v) => ({
          ...v,
          productId: 1, // тимчасово, поки бекенд сам не ставить ID
        })),
      };
      await productService.addProduct(payload);
      reset();
    } catch (error) {
      console.error("Помилка при створенні продукту:", error);
    }
  };

  const handleAddVariant = () => {
    variantsArray.append({
      color: EColor.BLACK,
      sizes: [],
      price: watchPrice || 0,
      priceSale: watchPriceSale || 0,
      stock: 0,
      images: [{ url: "", altText: "" }],
    });
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

        {/* Base Price */}
        <div className={styles.field}>
          <label>Base Price *</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: true, valueAsNumber: true })}
          />
        </div>

        {/* Base Sale Price */}
        <div className={styles.field}>
          <label>Base Sale Price</label>
          <input
            type="number"
            step="0.01"
            {...register("priceSale", { valueAsNumber: true })}
          />
        </div>

        {/* Translations */}
        <h3>Translations</h3>
        {translationsArray.fields.map((field, index) => (
          <div key={field.id} className={styles.group}>
            <input placeholder="Name" {...register(`translations.${index}.name`)} />
            <input placeholder="Description" {...register(`translations.${index}.description`)} />
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
            translationsArray.append({ name: "", description: "", languageId: 1 })
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

        {/* Variants */}
        <h3>Variants</h3>
        {variantsArray.fields.map((variant, vIndex) => (
          <div key={variant.id} className={styles.variantBlock}>
            <h4>Variant {vIndex + 1}</h4>

            <input type="hidden" {...register(`variants.${vIndex}.productId`)} />

            {/* Color */}
            <div className={styles.field}>
              <label>Color</label>
              <select {...register(`variants.${vIndex}.color`)}>
                {Object.values(EColor).map((color) => (
                  <option key={color} value={color}>
                    {colorLabels[color]}
                  </option>
                ))}
              </select>
            </div>

            {/* Sizes */}
            <div className={styles.field}>
              <label>Sizes</label>
              <div className={styles.checkboxGroup}>
                {Object.values(ESize).map((size) => (
                  <label key={size} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      value={size}
                      {...register(`variants.${vIndex}.sizes`)}
                    />
                    {sizeLabels[size]}
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className={styles.field}>
              <label>Price *</label>
              <input
                type="number"
                step="0.01"
                {...register(`variants.${vIndex}.price`, { required: true, valueAsNumber: true })}
              />
            </div>

            {/* Sale Price */}
            <div className={styles.field}>
              <label>Sale Price</label>
              <input
                type="number"
                step="0.01"
                {...register(`variants.${vIndex}.priceSale`, { valueAsNumber: true })}
              />
            </div>

            {/* Stock */}
            <div className={styles.field}>
              <label>Stock</label>
              <input type="number" {...register(`variants.${vIndex}.stock`, { valueAsNumber: true })} />
            </div>

            {/* Images */}
            <VariantImages
              control={control}
              register={register}
              setValue={setValue}
              watch={watch}
              variantIndex={vIndex}
            />

            <button type="button" onClick={() => variantsArray.remove(vIndex)}>
              ✕ Remove Variant
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddVariant}>
          + Add Variant
        </button>

        {/* Category */}
        <div className={styles.field}>
          <label>Category</label>
          <CategorySelect
            value={watch("categoryId")}
            onChange={(val) => setValue("categoryId", val as number)}
            valueKey="id"
          />
        </div>

        {/* Collection */}
        <div className={styles.field}>
          <label>Collections</label>
          <CollectionSelect
            value={watch("collectionId")}
            onChange={(val) => setValue("collectionId", Number(val))}
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




