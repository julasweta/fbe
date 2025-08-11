
import { LoginForm } from "../modules/auth/LoginForm";
import styles from "./pages.module.scss";

export default function AuthPage() {


  return (
    <div className={styles.centerWrapper}>
      <LoginForm />
    </div>
  );
}

