// store/useLanguageStore.ts
import { create } from 'zustand';
import i18n from '../i18n';

interface LanguageState {
  lang: string;
  setLang: (lng: string) => void;
}

const storedLang = localStorage.getItem('language') || i18n.language;

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: storedLang,
  setLang: (lng: string) => {
    i18n.changeLanguage(lng); // змінюємо мову i18n
    localStorage.setItem('language', lng); // синхронізуємо
    set({ lang: lng }); // ререндер для компонентів
  },
}));

