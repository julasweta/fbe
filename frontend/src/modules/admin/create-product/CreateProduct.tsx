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
import Input from "../../../components/ui/Inputs/Input";
import { Button } from "../../../components/ui/Buttons/Button";
const CreateProduct: React.FC = () => {


  const { register, control, handleSubmit, reset, setValue, watch } =
    useForm<ICreateProduct>({
      defaultValues: {
        sku: "",
        price: 0,
        priceSale: null,
        categoryId: undefined,
        collectionId: 1,
        translations: [{ name: "", description: "", languageId: 1 }],
        features: [{ text: "",textEn: "", order: 1 }],
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
      const res = await productService.addProduct(payload);
      reset();
      alert(`Товар додано - ${res.translations[0].name}`)
    } catch (error) {
      console.error("Помилка при створенні продукту:", error);
    }
  };

  const handleAddVariant = () => {
    variantsArray.append({
      color: "BLACK",
      sizes: [],
      price: watchPrice || 0,
      priceSale: watchPriceSale || 0,
      stock: 0,
      images: [{ url: "", altText: "", order:1 }],
      description: '',
    });
  };

  return (
    <div className={styles.createProduct}>
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* SKU */}
        <div className={styles.field}>
          <label>SKU * номер товару, ідентифікатор </label>
          <input {...register("sku", { required: true })} />
        </div>

        {/* Base Price */}
        <div className={styles.field}>
          <label>Base Price *</label>
          <Input
            type="number"
            step="1"
            min="1"
            {...register("price", { required: true, valueAsNumber: true })}
          />
        </div>

        {/* Base Sale Price */}
        <div className={styles.field}>
          <label>Base Sale Price</label>
          <input
            type="number"
            step="1"
            min='1'
            {...register("priceSale", { valueAsNumber: true })}
          />
        </div>

        {/* Translations */}
        <h3>Назва та опис  товару</h3>
        {translationsArray.fields.map((field, index) => {
          const currentLanguageId = watch(`translations.${index}.languageId`);

          return (
            <div key={field.id} className={styles.group}>
              <input placeholder="Name" {...register(`translations.${index}.name`)} />
              <input placeholder="Description" {...register(`translations.${index}.description`)} />

              <div className={styles.field}>
                <label>{`Language: ${currentLanguageId === 1 ? 'Ukraine' : 'English'}`}</label>
                <select {...register(`translations.${index}.languageId`, {
                  valueAsNumber: true,
                  validate: value => [1, 2].includes(value) || "Тільки 1 або 2"
                })}>
                  <option value="">Оберіть мову</option>
                  <option value={1}>Ukraine</option>
                  <option value={2}>English</option>
                </select>
              </div>

              {translationsArray.fields.length > 1 && (
                <button type="button" onClick={() => translationsArray.remove(index)}>
                  ✕
                </button>
              )}
            </div>
          );
        })}
        <Button
          type="button"
          className={styles.btn}
          onClick={() =>
            translationsArray.append({ name: "", description: "", languageId: 1 })
          }
        >
          + Add Translation
        </Button>

        {/* Features */}
        <h3>Властивості товару</h3>
        {featuresArray.fields.map((field, index) => (
          <div key={field.id} className={styles.group}>
            <Input
              placeholder="приклад: Тканина: кашемір"
              {...register(`features.${index}.text`)}
            />
            <Input
              placeholder="Example EN"
              {...register(`features.${index}.textEn`)}
            />
            <Input
              type="number"
              placeholder="Order"
              min="1"
              {...register(`features.${index}.order`, { valueAsNumber: true })}
            />
            <button type="button" onClick={() => featuresArray.remove(index)}>
              ✕
            </button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            featuresArray.append({ text: "", textEn: "", order: featuresArray.fields.length + 1 })
          }
          className={styles.btn}
        >
          + Додати властивість
        </Button>


        {/* Variants */}
        <h3>Variants</h3>
        {variantsArray.fields.map((variant, vIndex) => (
          <div key={variant.id} className={`${styles.variantBlock} form form2`}>
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
                step="1"
                {...register(`variants.${vIndex}.price`, { required: true, valueAsNumber: true })}
              />
            </div>

            {/* Sale Price */}
            <div className={styles.field}>
              <label>Sale Price</label>
              <input
                type="number"
                step="1"
                {...register(`variants.${vIndex}.priceSale`, { valueAsNumber: true })}
              />
            </div>

            {/* Stock */}
            <div className={styles.field }>
              <label>Послідовність варіантів - введіть 1, якщо це головний варіант який буде відображатись всюди перший</label>
              <input type="number" {...register(`variants.${vIndex}.stock`, { valueAsNumber: true })} />
            </div>

            <div className={styles.field}>
              <Input type="text" {...register(`variants.${vIndex}.description`)} label="Description" />
            </div>

            {/* Images */}
            <VariantImages
              control={control}
              register={register}
              setValue={setValue}
              watch={watch}
              variantIndex={vIndex}
            />

            <Button type="button" onClick={() => variantsArray.remove(vIndex)} className={styles.delete}>
              ✕ Remove Variant
            </Button>
          </div>
        ))}

        <Button type="button" onClick={handleAddVariant} className={styles.btn}>
          + Add Variant
        </Button>

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

        <button type="submit" className={`${styles.submit} ${styles.btn}`}>

          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;




