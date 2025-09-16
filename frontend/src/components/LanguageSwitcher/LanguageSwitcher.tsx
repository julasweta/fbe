import React, { useState } from 'react';
import { useLanguageStore } from '../../store/useLanguageStore';
import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher: React.FC = () => {
  const lang = useLanguageStore((state) => state.lang);
  const setLang = useLanguageStore((state) => state.setLang);
  const [hover, setHover] = useState(false);

  const otherLang = lang === 'uk' ? 'en' : 'uk';

  const handleSwitch = () => {
    setLang(otherLang);
    setHover(false); // приховуємо кнопку після кліку
  };

  return (
    <div
      className={styles.switcher}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Поточна мова */}
      <button className={`${styles['lang-btn']} ${styles[lang]}`}>
        {lang.toUpperCase()}
      </button>

      {/* Друга мова, показується при hover */}
      <button
        className={`${styles['lang-btn']} ${styles[otherLang]}`}
        onClick={handleSwitch}
        style={{
          opacity: hover ? 1 : 0,
          pointerEvents: hover ? 'auto' : 'none',
          transform: hover ? 'translateX(0)' : 'translateX(-10px)',
        }}
      >
        {otherLang.toUpperCase()}
      </button>
    </div>
  );
};

export default LanguageSwitcher;






