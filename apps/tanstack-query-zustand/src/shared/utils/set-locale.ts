import i18n from 'i18next'

export type Locale = 'en' | 'ru'

const LOCALE_KEY = 'locale'

/**
 * Switches application locale using i18next and persists it to localStorage.
 * Note: language change is async inside i18next, this function does not await it.
 *
 * @param {Locale} lng - Target locale code (e.g. "en" or "ru").
 * @returns {void}
 */
export const setLocale = (lng: Locale): void => {
  void i18n.changeLanguage(lng)
  localStorage.setItem(LOCALE_KEY, lng)
}
