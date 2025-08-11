import React from "react"; // Імпорт значення
import type { InputHTMLAttributes, ForwardedRef } from "react"; // Імпорт типів
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  ref?: ForwardedRef<HTMLInputElement>;
}

export const Input = ({
  label,
  error,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  ...rest
}: InputProps) => {
  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`${styles.input} ${error ? styles.errorBorder : ""}`}
        {...rest}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

// Обгортаємо компонент у forwardRef
export default React.forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <Input {...props} ref={ref} />
));