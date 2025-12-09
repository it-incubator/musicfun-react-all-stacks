import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import translationEN from './languages/en.json'
import translationRu from './languages/ru.json'

const defaultLanguage = localStorage.getItem('locale') || 'en'

const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRu,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
