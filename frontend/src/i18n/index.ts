import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources, type SupportedLanguage } from './translations';

const supportedLanguages: SupportedLanguage[] = ['fr', 'en', 'es', 'de'];

const getInitialLanguage = (): SupportedLanguage => {
  const stored = localStorage.getItem('language');
  if (stored && supportedLanguages.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }

  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  if (supportedLanguages.includes(browserLang)) {
    return browserLang;
  }

  return 'fr';
};

const initialLanguage = getInitialLanguage();

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  if (supportedLanguages.includes(lng as SupportedLanguage)) {
    localStorage.setItem('language', lng);
  }
  document.documentElement.lang = lng;
});

document.documentElement.lang = initialLanguage;

export default i18n;
