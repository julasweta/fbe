import React, {  type ReactNode } from 'react';
import { Menu } from './Menu';
import styles from './SideBar.module.scss';

interface SidebarProps {
  children: ReactNode;
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ children}) => {


  return (
    <div className={styles.sidebarBox}>
      
      <div className={styles.sidebar}>
        
        {React.Children.map(children, (child) =>
          React.isValidElement(child) && child.type === Menu ? React.cloneElement(child) : null
        )}
      </div>
    </div>
  );
};
