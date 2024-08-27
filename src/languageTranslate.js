import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations for different languages
import translationEN from './locales/en/translation.json';
import translationTE from './locales/te/translation.json';
import translationHI from './locales/hi/translation.json';
import translationTA from './locales/ta/translation.json';
import translationKN from './locales/kn/translation.json';

// Define the resources
const resources = {
  en: {
    translation: translationEN,
  },
  te: {
    translation: translationTE,
  },
  hi: {
    translation: translationHI,
  },
  ta: {
    translation: translationTA,
  },
  kn: {
    translation: translationKN,
  },
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
