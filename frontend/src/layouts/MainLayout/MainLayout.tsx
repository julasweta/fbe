
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footter/Footer";
import Header from "../../components/Header/Header";
import styles from "./MainLayout.module.scss";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { t} = useTranslation();
  return (
    <div className={styles.layout}>
    
      <Header />
     

      <main className={styles.content}>

        <section data-bg="dark" className={`hero-section ${styles.headerSection}`}>
          <div className={styles.dark}>
            <div className={styles.darkContent}>
              <h1 className={styles.title}>FULL BODY ERA</h1>
              {<p className={styles.description}>{t('whoplay')}</p> }
            </div>
          </div>
        </section>
        <section data-bg="light" className={`content-section ${styles.contentSection}`}>
          {children}
        </section>
      </main>

      <Footer/>
    </div>
  );
}