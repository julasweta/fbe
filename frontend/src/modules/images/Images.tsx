import React, { useState } from "react";
import { useFieldArray, type Control, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import type { ICreateProduct, IProduct } from "../../interfaces/IProduct";
import ImageUpload from "../admin/upload-img/ImageUploader";
import { Button } from "../../components/ui/Buttons/Button";
import Input from "../../components/ui/Inputs/Input";
import styles from "./Images.module.scss"

type VariantImagesProps = {
  control: Control<ICreateProduct | IProduct>;
  register: UseFormRegister<ICreateProduct | IProduct>;
  setValue: UseFormSetValue<ICreateProduct | IProduct>;
  watch: UseFormWatch<ICreateProduct | IProduct>;
  variantIndex: number;
};

const VariantImages: React.FC<VariantImagesProps> = ({
  control,
  register,
  setValue,
  watch,
  variantIndex,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.images` as const,
  });

  const [manualImage, setManualImage] = useState("");

  const handleRemove = (index: number) => {
    remove(index);
    // Перенумерація order після видалення
    const images = watch(`variants.${variantIndex}.images`) || [];
    images.forEach((_, i: number) => {
      setValue(`variants.${variantIndex}.images.${i}.order`, i + 1);
    });
  };

  return (
    <div className={styles.imagesBlock}>
      <h5>Images</h5>
      {fields.map((field, iIndex) => {
        const currentUrl = watch(`variants.${variantIndex}.images.${iIndex}.url`);
        return (
          <div key={field.id} style={{ margin: "1rem" }}>
            <div className="column">
              <div className="padding">
                <Input
                  placeholder="опис фото"
                  style={{ margin: "0.5rem" }}
                  {...register(`variants.${variantIndex}.images.${iIndex}.altText`)}
                />
                {/* Компонент для завантаження фото */}
                <ImageUpload
                  onUpload={(url) => setValue(`variants.${variantIndex}.images.${iIndex}.url`, url)}
                />
                {/* Поле для ручного вставлення URL */}
                <div style={{ display: "flex", marginTop: "0.5rem", gap: "0.5rem" }}>
                  <Input
                    type="text"
                    placeholder="Встав URL вручну"
                    value={manualImage}
                    onChange={(e) => setManualImage(e.target.value)}
                    id="urlhandle"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (manualImage.trim()) {
                        setValue(`variants.${variantIndex}.images.${iIndex}.url`, manualImage.trim());
                        setManualImage("");
                      }
                    }}
                  >
                    Завантажити фото
                  </Button>
                </div>
                {/* Поле для порядку */}
                <Input
                  type="number"
                  placeholder="Order"
                  min={1}
                  {...register(`variants.${variantIndex}.images.${iIndex}.order`, { valueAsNumber: true })}
                />
              </div>
              {currentUrl && (
                <img
                  src={currentUrl}
                  alt="preview"
                  style={{ width: 100, height: "auto", marginTop: "0.5rem" }}
                />
              )}
            </div>

            <button type="button" onClick={() => handleRemove(iIndex)}>
              ✕ Видалити фото
            </button>
          </div>
        );
      })}

      <Button
        type="button"
        variant="full"
        onClick={() =>
          append({
            url: "",
            altText: "",
            order: fields.length + 1, // автоматичний порядок нового зображення
          })
        }
      >
        + Add Image
      </Button>
    </div>
  );
};

export { VariantImages };


