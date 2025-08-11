import { useState, useEffect } from "react";
import { Button } from "../Buttons/Button";
import { Input } from "../Inputs/Input";
import classNames from "classnames";
import styles from "./ModalForm.module.scss";

interface Props<T extends Record<string, any>> {
  onClose: () => void;
  onSave: (data: T) => void;
  initialData: T | null;
  title?: string;
}

export default function ModalForm<T extends Record<string, any>>({
  onClose,
  onSave,
  initialData,
  title = "Edit Form",
}: Props<T>) {
  const [form, setForm] = useState<T>(initialData ?? ({} as T));

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    } else {
      setForm({} as T); // Скидаємо форму, якщо initialData === null
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose(); // Закриваємо модалку після збереження
  };

  const keys = initialData ? Object.keys(initialData).filter((key) => key !== "id") : [];

  return (
    <div className={styles.overlay}>
      <div className={classNames(styles.modal)}>
        <h2 className={styles.title}>
          {title}
        </h2>

        {keys.length > 0 ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            {keys.map((key) => (
              <Input
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)} // Капіталізуємо назву поля
                name={key}
                value={form[key] ?? ""}
                onChange={handleChange}
              />
            ))}
            <div className={styles.actions}>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </form>
        ) : (
          <p>No fields to edit</p>
        )}
      </div>
    </div>
  );
}
