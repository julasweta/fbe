// VariantImages.tsx
import React, { useState } from "react";
import { useFieldArray, type Control, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import type { ICreateProduct } from "../../interfaces/IProduct";
import ImageUpload from "../admin/upload-img/ImageUploader";

type VariantImagesProps = {
  control: Control<ICreateProduct>;
  register: UseFormRegister<ICreateProduct>;
  setValue: UseFormSetValue<ICreateProduct>;
  watch: UseFormWatch<ICreateProduct>;
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

  // Локальний стан для ручного вводу URL
  const [manualImage, setManualImage] = useState("");

  return (
    <div>
      <h5>Images</h5>
      {fields.map((field, iIndex) => {
        const currentUrl = watch(`variants.${variantIndex}.images.${iIndex}.url`);
        return (
          <div key={field.id} style={{ marginBottom: "1rem" }}>
            <input
              placeholder="Alt text"
              {...register(`variants.${variantIndex}.images.${iIndex}.altText` as const)}
            />

            {/* Компонент для завантаження фото */}
            <ImageUpload
              onUpload={(url) => setValue(`variants.${variantIndex}.images.${iIndex}.url`, url)}
            />

            {/* Поле для ручного вставлення URL */}
            <div style={{ display: "flex", marginTop: "0.5rem", gap: "0.5rem" }}>
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
                    setValue(`variants.${variantIndex}.images.${iIndex}.url`, manualImage.trim());
                    setManualImage("");
                  }
                }}
              >
                Add URL
              </button>
            </div>

            {currentUrl && (
              <img
                src={currentUrl}
                alt="preview"
                style={{ width: 100, height: "auto", marginTop: "0.5rem" }}
              />
            )}

            <button type="button" onClick={() => remove(iIndex)}>
              ✕
            </button>
          </div>
        );
      })}

      <button type="button" onClick={() => append({ url: "", altText: "" })}>
        + Add Image
      </button>
    </div>
  );
};

export { VariantImages };

