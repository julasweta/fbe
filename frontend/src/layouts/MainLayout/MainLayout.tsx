import Header from "../../components/Header/Header";
import styles from "./MainLayout.module.scss";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
