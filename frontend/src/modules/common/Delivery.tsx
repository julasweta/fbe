import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Delivery.module.scss";
import { Link } from "react-router-dom";

const Delivery: React.FC = () => {
  const { t } = useTranslation();



  return (
    <div className="page">
      <div className={styles.delivery}>
        <h1>{t("delivery-title")}</h1>

        <section className={styles.section}>
          <h2>{t("delivery-conditions-title")}</h2>
          <p className={styles.warning}>{t("delivery-warning")}</p>
          <ul className={styles.list}>
            <li>{t("delivery-ua")}</li>
            <li>{t("delivery-pl")}</li>
            <li>{t("delivery-us-ca")}</li>
          </ul>
          <p className={styles.freeShipping}>{t("delivery-free")}</p>
          <p>{t("delivery-restrictions")}</p>
        </section>

        <section className={styles.section}>
          <h2>{t("tracking-title")}</h2>
          <p>{t("tracking-info")}</p>
          <p>{t("tracking-taxes")}</p>
        </section>

        <section className={styles.section}>
          <h2>{t("exchange-title")}</h2>
          <p>{t("exchange-info")}</p>
          <p>{t("exchange-costs")}</p>
        </section>

        <section className={styles.section}>
          <h2>{t("return-title")}</h2>
          <p>{t("return-info")}</p>
        </section>

        <section className={`${styles.section}`}>
          <h2>{t("exchange-return-how-title")}</h2>
          <ul>
            <li>
              {t("exchange-return-step1")}{" "}
              <Link to="/contact" className="blue">
                {t("exchange-return-contact")}
              </Link>
            </li>
            <li>{t("exchange-return-step2")}</li>
            <li>{t("exchange-return-step3")}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t("payment-title")}</h2>
          <div className={styles.payment}>
            <h3>{t("payment-invoice-title")}</h3>
            <p>{t("payment-invoice-info")}</p>

            <h3>{t("payment-prepay-title")}</h3>
            <p>{t("payment-prepay-info")}</p>

            <h3>{t("payment-postpay-title")}</h3>
            <p>{t("payment-postpay-info")}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Delivery;


