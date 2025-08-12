import React from "react";
import styles from "./HeaderMenu.module.scss";
import type { ICollection } from "../../../interfaces/IColection";

interface CollectionsSubmenuProps {
  collections: ICollection[];
}

const CollectionsSubmenu: React.FC<CollectionsSubmenuProps> = ({ collections }) => {
  return (
    <>
      {collections.map((col) => (
        <li key={col.id} className={styles.submenuItem}>
          <a href={`/group/${col.slug || col.id}`} className={styles.submenuLink}>
            {col.name}
          </a>
        </li>
      ))}
    </>
  );
};

export default CollectionsSubmenu;
