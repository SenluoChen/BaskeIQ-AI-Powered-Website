import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translate.json';
import fr from './locales/fr/translate.json';

// les traductions en français
const resources = {
  fr: {
    translation: fr,
  },
  en: {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'fr',
  fallbackLng: 'fr',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
