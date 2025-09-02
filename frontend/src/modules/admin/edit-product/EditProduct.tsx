import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import styles from "./ProductEditForm.module.scss";
import { productService } from "../../../services/ProductService";
import {
  ESize,
  EColor,
  sizeLabels,
  colorLabels,
  type IProduct,
} from "../../../interfaces/IProduct";
import { CategorySelect } from "../../../components/Category/CategorySelect";
import { CollectionSelect } from "../../../components/Collection/CollectionSelect";
import Input from "../../../components/ui/Inputs/Input";
import { Button } from "../../../components/ui/Buttons/Button";
import { useProductStore } from "../../../store";
import { VariantImagesForUpdate } from "../../images/ImagesForUpdate";

// Глибоке порівняння об'єктів
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return keysA.length === keysB.length && keysA.every(k => keysB.includes(k) && deepEqual(a[k], b[k]));
  }

  return false;
}

// Повертає тільки змінені поля для бекенду
function getChangedFields(original: IProduct, current: IProduct): Partial<IProduct> {
  const changes: Partial<IProduct> = {};
  const basicFields: (keyof IProduct)[] = ["sku", "price", "priceSale", "categoryId", "collectionId"];

  basicFields.forEach((field) => {
    const value = current[field];
    if (!deepEqual(original[field], value)) {
      // TS не знає, який тип value, тому приводимо через any
      (changes as any)[field] = value ?? undefined;
    }
  });

  if (!deepEqual(original.translations, current.translations)) {
    changes.translations = current.translations?.map((t) => ({
      name: t.name,
      description: t.description ?? undefined,
      languageId: t.languageId,
    }));
  }

  if (!deepEqual(original.features, current.features)) {
    changes.features = current.features?.map((f) => ({
      text: f.text,
      order: f.order,
    }));
  }

  if (!deepEqual(original.variants, current.variants)) {
    changes.variants = current.variants?.map((v) => ({
      color: v.color,
      sizes: v.sizes,
      price: v.price,
      priceSale: v.priceSale ?? undefined,
      stock: v.stock,
      description: v.description ?? undefined,
      images: v.images?.map((img) => ({
        url: img.url,
        altText: img.altText ?? undefined,
      })),
    }));
  }

  return changes;
}


const EditProduct: React.FC = () =>  {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const originalDataRef = useRef<IProduct | null>(null);

  const { editProduct, isLoading: storeLoading } = useProductStore();

  const { register, control, handleSubmit, reset, setValue, watch } = useForm<IProduct>({
    defaultValues: {
      id: 0,
      sku: "",
      price: 0,
      priceSale: undefined,
      categoryId: undefined,
      collectionId: undefined,
      translations: [{ name: "", description: undefined, languageId: 1 }],
      features: [],
      variants: [],
    },
  });

  const translationsArray = useFieldArray({ control, name: "translations" });
  const featuresArray = useFieldArray({ control, name: "features" });
  const variantsArray = useFieldArray({ control, name: "variants" });

  const watchedData = watch();

  // Перевіряємо зміни
  useEffect(() => {
    if (originalDataRef.current && watchedData) {
      const changes = getChangedFields(originalDataRef.current, watchedData);
      setHasChanges(Object.keys(changes).length > 0);
    }
  }, [watchedData]);

  // Завантаження продукту
  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setError("ID продукту не знайдено");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const product = await productService.getById(Number(id));
        originalDataRef.current = JSON.parse(JSON.stringify(product));
        reset(product);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити продукт");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, reset]);

  const onSubmit: SubmitHandler<IProduct> = async (data) => {
    if (!id || !originalDataRef.current) return;

    const changes = getChangedFields(originalDataRef.current, data);

    if (Object.keys(changes).length === 0) {
      alert("Немає змін для збереження");
      return;
    }

    try {
      await editProduct(Number(id), changes);
      originalDataRef.current = JSON.parse(JSON.stringify(data));
      setHasChanges(false);
      alert(`Продукт оновлено: ${Object.keys(changes).join(", ")}`);
    } catch (err) {
      console.error(err);
      alert("Помилка при оновленні продукту");
    }
  };

  const handleAddVariant = () => {
    variantsArray.append({
      color: EColor.BLACK,
      sizes: [],
      price: watchedData.price ?? 0,
      priceSale: watchedData.priceSale ?? undefined,
      stock: 0,
      description: "",
      images: [{ url: "", altText: undefined }],
    });
  };

  const handleReset = () => {
    if (originalDataRef.current) {
      reset(originalDataRef.current);
      setHasChanges(false);
    }
  };

  if (loading || storeLoading) return <div className={styles.loading}>Завантаження...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.editProduct}>
      <div className={styles.header}>
        <h1>Edit Product #{id}</h1>
        {hasChanges && (
          <div className={styles.changesIndicator}>
            <span>• Є незбережені зміни</span>
            <Button type="button" onClick={handleReset} className={styles.resetBtn}>
              Скинути зміни
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* SKU */}
        <div className={styles.field}>
          <label>SKU *</label>
          <Input {...register("sku", { required: true })} />
        </div>

        {/* Price */}
        <div className={styles.field}>
          <label>Price *</label>
          <Input type="number" {...register("price", { required: true, valueAsNumber: true })} />
        </div>

        {/* Sale Price */}
        <div className={styles.field}>
          <label>Sale Price</label>
          <Input type="number" {...register("priceSale", { valueAsNumber: true })} />
        </div>

        {/* Category */}
        <div className={styles.field}>
          <label>Category</label>
          <CategorySelect value={watch("categoryId")} onChange={(val) => setValue("categoryId", val as number)} valueKey="id" />
        </div>

        {/* Collection */}
        <div className={styles.field}>
          <label>Collection</label>
          <CollectionSelect value={watch("collectionId")} onChange={(val) => setValue("collectionId", Number(val))} valueKey="id" />
        </div>

        {/* Translations */}
        <h3>Translations</h3>
        {translationsArray.fields.map((field, index) => (
          <div key={field.id} className={styles.group}>
            <Input placeholder="Name" {...register(`translations.${index}.name`)} />
            <Input placeholder="Description" {...register(`translations.${index}.description`)} />
            <Input type="number" label="Language: UA" disabled {...register(`translations.${index}.languageId`)} />
          </div>
        ))}

        {/* Features */}
        <h3>Features</h3>
        {featuresArray.fields.map((field, index) => (
          <div key={field.id} className={styles.group}>
            <Input placeholder="Text" {...register(`features.${index}.text`)} />
            <Input type="number" placeholder="Order" {...register(`features.${index}.order`, { valueAsNumber: true })} />
          </div>
        ))}
        <Button type="button" onClick={() => featuresArray.append({ text: "", order: featuresArray.fields.length + 1 })}>+ Add Feature</Button>

        {/* Variants */}
        <h3>Variants</h3>
        {variantsArray.fields.map((variant, vIndex) => (
          <div key={variant.id} className={styles.variantBlock}>
            <h4>Variant {vIndex + 1}</h4>
            <div className={styles.field}>
              <label>Color</label>
              <select {...register(`variants.${vIndex}.color`)}>
                {Object.values(EColor).map((color) => (
                  <option key={color} value={color}>{colorLabels[color]}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Sizes</label>
              <div className={styles.checkboxGroup}>
                {Object.values(ESize).map((size) => (
                  <label key={size} className={styles.checkboxLabel}>
                    <input type="checkbox" value={size} {...register(`variants.${vIndex}.sizes`)} />
                    {sizeLabels[size]}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label>Price *</label>
              <Input type="number" {...register(`variants.${vIndex}.price`, { required: true, valueAsNumber: true })} />
            </div>

            <div className={styles.field}>
              <label>Sale Price</label>
              <Input type="number" {...register(`variants.${vIndex}.priceSale`, { valueAsNumber: true })} />
            </div>

            <div className={styles.field}>
              <label>Stock</label>
              <Input type="number" {...register(`variants.${vIndex}.stock`, { valueAsNumber: true })} />
            </div>

            <div className={styles.field}>
              <label>Description</label>
              <Input placeholder="Variant description" {...register(`variants.${vIndex}.description`)} />
            </div>

            <VariantImagesForUpdate control={control} register={register} setValue={setValue} watch={watch} variantIndex={vIndex} />

            <Button type="button" onClick={() => variantsArray.remove(vIndex)} className={styles.delete}>✕ Remove Variant</Button>
          </div>
        ))}

        <Button type="button" onClick={handleAddVariant}>+ Add Variant</Button>

        <div className={styles.formActions}>
          <button type="submit" className={`${styles.submit} ${styles.btn}`} disabled={!hasChanges}>
            {hasChanges ? "Зберегти зміни" : "Немає змін"}
          </button>
          {hasChanges && <Button type="button" onClick={handleReset} className={styles.cancelBtn}>Скинути</Button>}
        </div>
      </form>
    </div>
  );
}
export default EditProduct