import React from "react";
import styles from "./HeaderMenu.module.scss";

interface MenuItemComponentProps {
  label: string;
  link?: string;
  children?: React.ReactNode;
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({ label, link, children }) => {
  if (children) {
    return (
      <>
        <span className={styles.submenuLink}>{label}</span>
        <ul className={styles.subsubmenu}>{children}</ul>
      </>
    );
  }

  return (
    <a href={link} className={styles.submenuLink}>
      {label}
    </a>
  );
};

export default MenuItemComponent;
