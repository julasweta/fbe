import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "./ProductEditForm.module.scss";
import { EColor, type IProduct } from "../../../interfaces/IProduct";

export function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, control, reset } = useForm<IProduct>({
    defaultValues: {
      sku: "",
      price: 0,
      priceSale: undefined,
      categoryId: undefined,
      collectionId: undefined,
      translations: [{ name: "", description: "", languageId: 1 }],
      features: [],
      variants: [],
    },
  });

  // features
  const { fields: featureFields, append: addFeature, remove: removeFeature } =
    useFieldArray({
      control,
      name: "features",
    });

  // variants
  const { fields: variantFields, append: addVariant, remove: removeVariant } =
    useFieldArray({
      control,
      name: "variants",
    });

  // завантажуємо продукт по id
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data: IProduct = await res.json();
        reset(data); // заповнюємо форму даними з бекенду
      } catch (err) {
        console.error("Помилка при завантаженні продукту", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id, reset]);

  const onSubmit = (data: IProduct) => {
    console.log("Форма збережена:", data);
    // 🔥 тут можна зробити запит PUT / PATCH
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {/* SKU */}
      <div className={styles.field}>
        <label>Артикул *</label>
        <input {...register("sku", { required: true })} />
      </div>

      {/* Ціна */}
      <div className={styles.field}>
        <label>Ціна *</label>
        <input type="number" {...register("price", { required: true })} />
      </div>

      {/* Акційна ціна */}
      <div className={styles.field}>
        <label>Акційна ціна</label>
        <input type="number" {...register("priceSale")} />
      </div>

      {/* Назва */}
      <div className={styles.field}>
        <label>Назва *</label>
        <input {...register(`translations.${0}.name`, { required: true })} />
      </div>

      {/* Опис */}
      <div className={styles.field}>
        <label>Опис</label>
        <textarea {...register(`translations.${0}.description`)} />
      </div>

      {/* Features */}
      <div className={styles.features}>
        <h3>Особливості</h3>
        {featureFields.map((field, index) => (
          <div key={field.id} className={styles.featureRow}>
            <input
              {...register(`features.${index}.text`, { required: true })}
              placeholder="Опис фічі"
            />
            <input
              type="number"
              {...register(`features.${index}.order`, { required: true })}
              placeholder="Порядок"
            />
            <button type="button" onClick={() => removeFeature(index)}>
              Видалити
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addFeature({ text: "", order: featureFields.length + 1 })
          }
        >
          Додати особливість
        </button>
      </div>

      {/* Variants */}
      <div className={styles.variants}>
        <h3>Варіанти</h3>
        {variantFields.map((field, index) => (
          <div key={field.id} className={styles.variantRow}>
            <input
              {...register(`variants.${index}.color`)}
              placeholder="Колір"
            />
            <input
              type="number"
              {...register(`variants.${index}.price`)}
              placeholder="Ціна"
            />
            <input
              type="number"
              {...register(`variants.${index}.priceSale`)}
              placeholder="Акційна ціна"
            />
            <input
              type="number"
              {...register(`variants.${index}.stock`)}
              placeholder="Кількість"
            />
            <button type="button" onClick={() => removeVariant(index)}>
              Видалити
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addVariant({
              color: EColor.WHITE,
              sizes: [],
              price: 0,
              priceSale: null,
              stock: 0,
              images: [],
            })
          }
        >
          Додати варіант
        </button>
      </div>

      <button type="submit" className={styles.submit}>
        Зберегти
      </button>
    </form>
  );
}

