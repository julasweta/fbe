import { useState, useRef, useEffect } from "react";
import styles from "./Select.module.scss";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

export const Select = ({
  options,
  placeholder = "Select...",
  onChange,
  value,
  disabled = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Закриває випадаючий список при кліку поза компонентом
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    setSelectedValue(option.value);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={styles.selectWrapper} ref={wrapperRef}>
      <div
        className={`${styles.selectInput} ${disabled ? styles.disabled : ""}`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        <span className={!selectedValue ? styles.placeholder : ""}>
          {options.find((opt) => opt.value === selectedValue)?.label || placeholder}
        </span>
        <span
          className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
        ></span>
      </div>

      <ul
        className={`${styles.optionsList} ${isOpen ? styles.open : ""}`}
      >
        {options.map((option) => (
          <li
            key={option.value}
            className={`${styles.option} ${option.value === selectedValue ? styles.selected : ""
              }`}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
