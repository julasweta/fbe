import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";
import HeaderMenu from "./HeaderMenu/HeaderMenu";
import styles from "./Header.module.scss";
import { useEffect } from "react";

const Header = () => {
  const { logout, accessToken, user } = useAuthStore();

  useEffect(() => {
    const user = useAuthStore.getState().user;
    console.log(user);
  }, []);

  return (
    <div className={styles.header}>
      <HeaderMenu />
      <div className={styles.logo}>FBE</div>
      <div className={styles.authBlock}>
        {accessToken ? (
          <>
            <span className={styles.userName}>
              {user?.first_name.toUpperCase()}
            </span>
            <button className={styles.authButton} onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.authButton}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;

