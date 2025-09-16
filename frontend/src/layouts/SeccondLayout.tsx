

import { useTranslation } from "react-i18next";
import Futter from "../components/Footter/Footer";
import Header from "../components/Header/Header";
import styles from "./MainLayout/MainLayout.module.scss";

export default function SeccondLayout({ children }: { children: React.ReactNode }) {
    const { t} = useTranslation();
  return (

    <div className={styles.layout}>
      
      <section data-bg="light" className={`content-section ${styles.contentSection} `}>
        <ul className={styles.headerTop}>
          <li>{t('fast-delivery')}</li>
          <li >{t('free-delivery')}</li>
          <li>{t('change-return')}</li>
        </ul>
        <Header />
      </section>
      <section data-bg="light" className={`content-section ${styles.contentSection}`}>
        <main className={styles.content}>
          {children}
        </main>
      </section >
      <Futter />
    </div>



  );
}