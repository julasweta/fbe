// VariantImages.tsx
import React, { useState } from "react";
import { useFieldArray, type Control, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import type { IProduct } from "../../interfaces/IProduct";
import ImageUpload from "../admin/upload-img/ImageUploader";
import { Button } from "../../components/ui/Buttons/Button";
import Input from "../../components/ui/Inputs/Input";
import styles from "./Images.module.scss"

type VariantImagesProps = {
  control: Control<IProduct>;
  register: UseFormRegister<IProduct>;
  setValue: UseFormSetValue< IProduct>;
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

  // Локальний стан для ручного вводу URL
  const [manualImage, setManualImage] = useState("");

  return (
    <div className= { styles.imagesBlock } >
    <h5>Images </h5>
  {
    fields.map((field, iIndex) => {
      const currentUrl = watch(`variants.${variantIndex}.images.${iIndex}.url`);
      return (
        <div key= { field.id } style = {{ margin: "1rem" }
    }>
    <Input
              placeholder="опис фото"
              style = {{ margin: "0.5rem" }}
  {...register(`variants.${variantIndex}.images.${iIndex}.altText`) }
            />

  {/* Компонент для завантаження фото */ }
  <ImageUpload
              onUpload={ (url) => setValue(`variants.${variantIndex}.images.${iIndex}.url`, url) }
            />

  {/* Поле для ручного вставлення URL */ }
  <div style={ { display: "flex", marginTop: "0.5rem", gap: "0.5rem" } }>
    <Input
                type="text"
  placeholder = "Встав URL вручну"
  value = { manualImage }
  onChange = {(e) => setManualImage(e.target.value)}
id = "urlhandle"
  />
  <Button
                type="button"
onClick = {() => {
  if (manualImage.trim()) {
    setValue(`variants.${variantIndex}.images.${iIndex}.url`, manualImage.trim());
    setManualImage("");
  }
}}
              >
  Завантажити фото
    </Button>
    </div>

{
  currentUrl && (
    <img
                src={ currentUrl }
  alt = "preview"
  style = {{ width: 100, height: "auto", marginTop: "0.5rem" }
}
              />
            )}

<button type="button" onClick = {() => remove(iIndex)}>
              ✕ Видалити фото
  </button>
  </div>
        );
      })}

<button type="button" onClick = {() => append({ url: "", altText: "" })}>
  + Add Image
    </button>
    </div>
  );
};

export { VariantImagesForUpdate };

