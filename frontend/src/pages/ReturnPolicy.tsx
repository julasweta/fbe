import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ReturnPolicy: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="page">
      <h1 >Політика повернення та обміну</h1>

      <section className="form">
        <h2>Країни</h2>
        <ul>
          {(t("deliveryInfo", { returnObjects: true }) as string[]).map((item, index) => (
            <li key={index}> - {item}</li>
          ))}

        </ul>
      </section>

      <section className="form">
        <h2>Повернення товарів</h2>
        <p>
          Повернення можливе <strong>лише у випадку, якщо товар має виробничий дефект  або був пошкоджений під час доставки. </strong>
                   
          </p>
        <p>
          Для оформлення повернення, будь ласка, зв'яжіться з нашою службою підтримки протягом{" "}
          <strong>14 днів</strong> з моменту отримання замовлення.
        </p>
      </section>

      <section className="form">
        <h2>Обміни</h2>
        <p>
          Ми приймаємо обміни товарів на інший розмір чи модель у випадку наявності
          відповідного товару на складі.
        </p>
        <p>
          Витрати на пересилання при обміні оплачує покупець, за винятком випадків браку
          чи дефекту.
        </p>
      </section>

      <section className="form">
        <h2>Як оформити повернення чи обмін</h2>
        <ul>
          <li>Зверніться до нашої підтримки  <Link to ="/contact" className="blue"> у розділі Контакти</Link></li>
          <li>Надайте фото товару та опис проблеми.</li>
          <li>Очікуйте підтвердження та інструкції від менеджера.</li>
        </ul>
      </section>
    </div>
  );
};

export default ReturnPolicy;
