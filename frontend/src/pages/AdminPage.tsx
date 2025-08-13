import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from "../components/SideBar/Menu";
import { Sidebar } from "../components/SideBar/SideBar";
import styles from './pages.module.scss';

const AdminPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { href: 'dashboard', label: 'Dashboard' },
    { href: 'createproduct', label: 'Create Product' },
    { href: 'edit-product/1', label: 'Edit Product' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleItemClick = (href: string) => {
    navigate(href);
    setIsSidebarOpen(false); // закриваємо меню після кліку
  };

  return (
    <div className={styles.adminPage}>
      {/* Кнопка бургер-меню (тільки на мобільних) */}
      <button className={styles.burger} onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Сайдбар */}
      <div className={`${styles.sidebarWrapper} ${isSidebarOpen ? styles.open : ''}`}>
        <Sidebar isOpen={isSidebarOpen}>
          <Menu items={menuItems} onItemClick={handleItemClick} />
        </Sidebar>
      </div>

      {/* Контент */}
      <div className={styles.adminContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
