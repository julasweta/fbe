import React from "react";
import styles from "./About.module.scss";
import { useTranslation } from "react-i18next";

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section data-bg="dark" className={`content-section ${styles.contentSection}`}>
      <div className={styles.aboutWrapper}>
        <div className={styles.fbeAbout}>
          <h1 className={styles.title}>{t('about-h')}</h1>
          <p className={styles.description}>
            {t('about1')}
          </p>
          <h2 className={styles.subtitle}>{t('about-h1')}</h2>
          <p className={styles.description}>
            {t('about2')}
          </p>
          <h2 className={styles.subtitle}>{t('about-h2')}</h2>
          <ul className={styles.featuresList}>
            <li>{t('about3-1')}</li>
            <li>{t('about3-2')}</li>
            <li>{t('about3-3')}</li>
            <li>{t('about3-4')}</li>
          </ul>
          <h2 className={styles.subtitle}>{t('about-h3')}</h2>
          <ul className={styles.valuesList}>
            <li>{t('about4-1')}</li>
            <li>{t('about4-2')}</li>
            <li>{t('about4-3')}</li>
            <li>{t('about4-4')}</li>
          </ul>
          <h2 className={styles.subtitle}>{t('about-h4')}</h2>
          <ul className={styles.deliveryList}>
            <li>{t('about5-1')}</li>
            <li>{t('about5-2')}</li>
            <li>{t('about5-3')}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
