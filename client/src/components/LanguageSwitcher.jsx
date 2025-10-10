import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang); // save preference
  };

  return (
    <div className="flex gap-2 justify-center mt-2">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 border rounded ${i18n.language === "en" ? "bg-green-600 text-white" : "bg-gray-200"}`}
      >
        🇬🇧 English
      </button>
      <button
        onClick={() => changeLanguage("sw")}
        className={`px-3 py-1 border rounded ${i18n.language === "sw" ? "bg-green-600 text-white" : "bg-gray-200"}`}
      >
        🇰🇪 Swahili
      </button>
    </div>
  );
}
