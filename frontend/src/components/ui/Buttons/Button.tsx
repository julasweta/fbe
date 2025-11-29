import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "link" | "small" | "full";
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "button",
      onClick,
      disabled = false,
      loading = false,
      variant = "primary",
      children,
      className,
      style,
      title,
      ...rest // <-- ✅ збираємо всі інші стандартні пропси
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        style={style}
        title={title}
        className={classNames(
          styles.button,
          styles[variant],
          { [styles.disabled]: disabled || loading },
          className
        )}
        {...rest} // ✅ передаємо далі (наприклад, onKeyDown, aria-label тощо)
      >
        {loading && <span className={styles.loader}></span>}
        {title || children}
      </button>
    );
  }
);

Button.displayName = "Button";
