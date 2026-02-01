import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import uk from "./locales/uk/translation.json";

const resources = {
  en: { translation: en },
  uk: { translation: uk },
};

const storedLang = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: storedLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
