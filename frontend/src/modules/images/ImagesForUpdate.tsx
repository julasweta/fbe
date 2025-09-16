// VariantImages.tsx
import React, { useState } from "react";
import {
  useFieldArray,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import type { IProduct } from "../../interfaces/IProduct";
import ImageUpload from "../admin/upload-img/ImageUploader";
import { Button } from "../../components/ui/Buttons/Button";
import Input from "../../components/ui/Inputs/Input";
import styles from "./Images.module.scss";

type VariantImagesProps = {
  control: Control<IProduct>;
  register: UseFormRegister<IProduct>;
  setValue: UseFormSetValue<IProduct>;
  watch: UseFormWatch<IProduct>;
  variantIndex: number;
};

const VariantImagesForUpdate: React.FC<VariantImagesProps> = ({
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

  return (
    <div className={styles.imagesBlock}>
      <h5>Images</h5>

      {fields.map((field, iIndex) => {
        const currentUrl = watch(`variants.${variantIndex}.images.${iIndex}.url`);

        return (
          <div key={field.id} style={{ margin: "1rem" }}>
            {currentUrl ? (
              // Існуюче фото
              <div className={styles.photoBox}>
                <img
                  src={currentUrl}
                  alt={watch(`variants.${variantIndex}.images.${iIndex}.altText`) || "preview"}
                />
                <Button type="button" onClick={() => remove(iIndex)} variant="small">
                  ✕ Видалити фото
                </Button>
              </div>

            ) : (
              // Нове фото
              <div className={styles.newphoto}>
                <Input
                  placeholder="опис фото"
                  style={{ marginBottom: "0.5rem" }}
                  {...register(`variants.${variantIndex}.images.${iIndex}.altText`)}
                />
                <ImageUpload
                  onUpload={(url) =>
                    setValue(`variants.${variantIndex}.images.${iIndex}.url`, url)
                  }
                />
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <Input
                    type="text"
                    placeholder="Встав URL вручну"
                    value={manualImage}
                    onChange={(e) => setManualImage(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (manualImage.trim()) {
                        setValue(
                          `variants.${variantIndex}.images.${iIndex}.url`,
                          manualImage.trim()
                        );
                        setManualImage("");
                      }
                    }}
                  >
                    Завантажити фото
                  </Button>
                </div>
                <Button type="button" onClick={() => remove(iIndex)} style={{ marginTop: "0.5rem" }} variant="small">
                  ✕ Видалити фото
                </Button>
              </div>
            )}
          </div>
        );
      })}

      <Button type="button" onClick={() => append({ url: "", altText: "" })}>
        + Add Image
      </Button>
    </div>
  );
};

export { VariantImagesForUpdate };

