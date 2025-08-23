
import Header from "../components/Header/Header";
import styles from "./MainLayout/MainLayout.module.scss";

export default function SeccondLayout({ children }: { children: React.ReactNode }) {
  return (

    <div className={styles.layout}>
      <section data-bg="light" className={`content-section ${styles.contentSection} `}>
        <ul className={styles.headerTop}>
          <li>Швидка доставка</li>
          <li >Доставка від 4000грн безкоштовна</li>
          <li>Обмін і Повернення</li>
        </ul>
        <Header />
      </section>
      <section data-bg="light" className={`content-section ${styles.contentSection}`}>
        <main className={styles.content}>
          {children}
        </main>
      </section >
    </div>



  );
}