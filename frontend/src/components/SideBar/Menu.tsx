import React from 'react';
import { MenuItem } from './MenuItem';
import styles from './Menu.module.scss';

interface MenuItemType {
  href: string;
  label: string;
}

interface MenuProps {
  items: MenuItemType[];
  onItemClick?: (href: string) => void;
}

export const Menu: React.FC<MenuProps> = ({ items, onItemClick }) => {
  const handleClick = (href: string) => {
    if (onItemClick) onItemClick(href);
  };

  return (
    <ul className={styles.menu}>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          href={item.href}
          label={item.label}
          onClick={() => handleClick(item.href)}
        />
      ))}
    </ul>
  );
};