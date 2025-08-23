import React from "react";
import { useCategoryStore } from "../../store/useCategoryStore";
import styles from "./Category.module.scss";

interface CategorySelectProps<T extends string | number> {
  value?: T;
  onChange: (value: T) => void;
  includeEmpty?: boolean;
  valueKey?: "id" | "slug";
}

export function CategorySelect<T extends string | number>({
  value,
  onChange,
  includeEmpty = true,
  valueKey = "id",
}: CategorySelectProps<T>) {
  const { categories } = useCategoryStore();

  const renderCategories = (
    parentId: number | null = null,
    level = 0
  ) =>
    categories
      .filter((cat) => cat.parentId === parentId)
      .map((cat) => (
        <React.Fragment key={cat.id}>
          <option value={valueKey === "slug" ? cat.slug : cat.id}>
            {"— ".repeat(level)}
            {cat.name}
          </option>
          {renderCategories(cat.id, level + 1)}
        </React.Fragment>
      ));

  return (
    <select
      value={value ?? ""}
      onChange={(e) =>
        valueKey === "id"
          ? onChange(Number(e.target.value) as T)
          : onChange(e.target.value as T)
      }
      className={styles.select}
    >
      {includeEmpty && <option value="">Виберіть категорію</option>}
      {renderCategories(null, 0)}
    </select>
  );
}
