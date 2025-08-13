import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";
import HeaderMenu from "./HeaderMenu/HeaderMenu";
import styles from "./Header.module.scss";
import { useEffect } from "react";
import { Button } from "../ui/Buttons/Button";

const Header = () => {
  const { logout, accessToken, user } = useAuthStore();


  useEffect(() => {
    useAuthStore.getState();
  }, [user]);

  return (
    <div className={styles.header}>
      <HeaderMenu />
      <div className={styles.logo}>FBE</div>
      <div className={styles.authBlock}>

        {user && user.role === "ADMIN" && <Link to="/admin" >Admin Panel</Link>}
        {accessToken ? (
          <>
            <span className={styles.userName}>
              {user?.first_name.toUpperCase()}
            </span>
            <Button className={styles.authButton} onClick={logout}>
              Logout
            </Button>
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

