import { useCollectionStore } from "../../store/useCollectionStore";
import styles from "./CollectionSelect.module.scss";

interface CollectionSelectProps<T extends string | number> {
  value?: T;
  onChange: (value: T) => void;
  multiple?: boolean;
  valueKey?: "id" | "slug";
}

export function CollectionSelect<T extends string | number>({
  value,
  onChange,
  multiple = false,
  valueKey = "id",
}: CollectionSelectProps<T>) {
  const { collections, loading } = useCollectionStore();

  if (loading) return <p>Завантаження...</p>;

  return (
    <select
      multiple={multiple}
      value={value ?? ""}
      onChange={(e) => {
        if (multiple) {
          const values = Array.from(e.target.selectedOptions, (opt) =>
            valueKey === "id" ? Number(opt.value) : opt.value
          ) as unknown as T;
          onChange(values);
        } else {
          const val =
            valueKey === "id"
              ? (Number(e.target.value) as T)
              : (e.target.value as T);
          onChange(val);
        }
      }}
      className={styles.select}
    >
      {!multiple && <option value="">Виберіть колекцію</option>}
      {collections.map((col) => (
        <option
          key={col.id}
          value={valueKey === "slug" ? col.slug : col.id}
        >
          {col.name}
        </option>
      ))}
    </select>
  );
}


