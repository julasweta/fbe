import React from "react";
import styles from "./About.module.scss";

const About: React.FC = () => {
  return (
    <section data-bg="dark" className={`content-section ${styles.contentSection}`}>
    <div className={styles.fbeAbout}>
      <h1 className={styles.title}>Про FBE</h1>
      <p className={styles.description}>
        FBE — український бренд сучасного одягу, який поєднує якість, стиль та доступність.
        Ми створюємо речі для тих, хто цінує комфорт та індивідуальність у щоденному житті,
        а також для приємного спорту й активного відпочинку, що приносить задоволення.
      </p>

      <h2 className={styles.subtitle}>Наша місія</h2>
      <p className={styles.description}>
        Надавати якісний одяг, який підкреслює особистість кожного клієнта та робить їх впевненими в собі.
        Ми віримо, що стильний та функціональний одяг має бути доступним для кожного.
      </p>

      <h2 className={styles.subtitle}>Що нас відрізняє</h2>
      <ul className={styles.featuresList}>
        <li>Якість матеріалів — використовуємо тільки перевірені тканини та фурнітуру</li>
        <li>Актуальний дизайн — слідкуємо за світовими трендами та створюємо власні</li>
        <li>Доступні ціни — співвідношення ціна-якість, яке вас приємно здивує</li>
        <li>Швидка доставка — працюємо по всій Україні, Польщі, США та Канаді</li>
      </ul>

      <h2 className={styles.subtitle}>Наші цінності</h2>
      <ul className={styles.valuesList}>
        <li>Якість — кожна річ проходить ретельний контроль якості</li>
        <li>Стиль — створюємо одяг для сучасних та активних людей</li>
        <li>Сервіс — індивідуальний підхід до кожного клієнта</li>
        <li>Інновації — постійно вдосконалюємо наші процеси та продукти</li>
      </ul>

      <h2 className={styles.subtitle}>Доставка</h2>
      <ul className={styles.deliveryList}>
        <li>Україна: Нова пошта (2-3 робочих дні)</li>
        <li>Польща: Нова пошта (3-5 робочих днів)</li>
        <li>США та Канада: Canada Post (1-3 робочих дні)</li>
        <li>Міжнародна доставка: Meest Express (10-12 робочих днів)</li>
      </ul>
      </div>
    </section>
  );
};

export default About;
