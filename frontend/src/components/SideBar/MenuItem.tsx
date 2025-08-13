import styles from './MenuItem.module.scss';

interface MenuItemProps {
  href: string;
  label: string;
  onClick?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ href, label, onClick }) => {
  return (
    <li className={styles.menuItem}>
      <a href={href} className={styles.menuLink }onClick={(e) => { e.preventDefault(); onClick?.(); }}>
        {label}
      </a>
    </li>
  );
};