import React from "react";
import styles from "./PrivacyPage.module.scss";

const PrivacyPage: React.FC = () => {
  return (
    <div className="page">
      <h1 className={styles.title}>Політика конфіденційності</h1>

      <section className={styles.section}>
        <p>
          У цій Політиці конфіденційності описано, як FBE («Сайт», «ми», «нас» або «наш») збирає,
          використовує та розкриває вашу особисту інформацію, коли ви відвідуєте, користуєтеся нашими послугами
          або робите покупки на сайті desse-swim.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Зміни в цій Політиці конфіденційності</h2>
        <p>
          Ми можемо час від часу оновлювати цю Політику, у тому числі для відображення змін у нашій практиці або
          з інших операційних, юридичних чи нормативних причин.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Як ми збираємо та використовуємо вашу особисту інформацію</h2>
        <p>
          Для надання Послуг ми збираємо вашу особисту інформацію з різних джерел. Інформація, яку ми збираємо,
          залежить від того, як ви взаємодієте з нашим сайтом та послугами.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Інформація, яку ми збираємо</h2>
        <ul className={styles.list}>
          <li>Основні контактні дані (ім'я, адреса, телефон, email)</li>
          <li>Інформація про замовлення та покупки</li>
          <li>Дані облікового запису (логін, пароль)</li>
          <li>Дані про підтримку клієнтів</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Використання cookies</h2>
        <p>
          Ми використовуємо файли cookie для роботи сайту, аналітики та персоналізації досвіду користувача.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Розкриття інформації</h2>
        <p>
          Ми можемо передавати інформацію третім сторонам для виконання послуг, аналітики, маркетингу та безпеки.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPage;

