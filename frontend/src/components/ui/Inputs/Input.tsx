import React from "react";
import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id?: string;
  name?: string;

}

// Create the component with forwardRef and give it a display name 
const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  id,
  name,

  ...rest
}, ref) => {
  const isRadio = type === "radio";
  const isCheckbox = type === "checkbox";

  return (
    <div className={`${styles.inputWrapper} ${isRadio || isCheckbox ? styles.radioCheckboxWrapper : ""}`}>
      {isRadio || isCheckbox ? (
        // Для radio та checkbox кнопок
        <label className={`${styles.radioCheckboxLabel} ${disabled ? styles.disabled : ""}`}>
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            required={required}
            id={id}
            name={name?name:id}
            className={`${styles.radioCheckboxInput} ${error ? styles.errorBorder : ""}`}
            {...rest}
          />
          <span className={styles.radioCheckboxText}>
            {label} {required && <span className={styles.required}>*</span>}
          </span>
        </label>
      ) : (
        // Для звичайних input полів
        <>
          {label && (
            <label className={styles.label}>
              {label} {required && <span className={styles.required}>*</span>}
            </label>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
              required={required}
              id={id}
              name={name}
            className={`${styles.input} ${error ? styles.errorBorder : ""}`}
            {...rest}
          />
        </>
      )}
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
});

// Add display name for debugging and Fast Refresh 
Input.displayName = 'Input';

// Export both named and default 
export { Input };
export default Input;