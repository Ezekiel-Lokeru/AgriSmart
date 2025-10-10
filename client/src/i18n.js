import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./Locales/en/translation.json";
import swTranslation from "./Locales/sw/translation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      sw: { translation: swTranslation },
    },
    lng: localStorage.getItem("lang") || "en", // default to saved language or English
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
