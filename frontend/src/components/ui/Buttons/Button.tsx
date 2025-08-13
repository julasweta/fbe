import type { ReactNode, MouseEvent, CSSProperties } from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";

interface ButtonProps {
  type?: "button" | "submit" | "reset"; // HTML button types должны быть lowercase
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>; // Правильная типизация
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  children?: ReactNode; // Зробили необов'язковим
  className?: string;
  style?: CSSProperties; // Добавлена поддержка style
  title?: string; // Добавлено для поддержки title
}

export const Button = ({
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  children,
  className,
  style, // Добавляем style в деструктуризацию
  title, // Добавляем title в деструктуризацию
}: ButtonProps) => {
  return (
    <button // используем HTML button, а не компонент Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={style} // Передаем style в button
      title={title} // Передаем title в button
      className={classNames(
        styles.Button,
        styles[variant],
        { [styles.disabled]: disabled || loading },
        className
      )}
    >
      {loading && <span className={styles.loader}></span>}
      {title || children}
    </button>
  );
};