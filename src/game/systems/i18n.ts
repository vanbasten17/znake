import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { applyStaticDomTranslations } from './i18nDomAdapter'
import { resources } from './i18nResources'

export const initI18n = async (): Promise<void> => {
  if (!i18next.isInitialized) {
    await i18next.use(LanguageDetector).init({
      resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'ca'],
      interpolation: { escapeValue: false },
      detection: {
        order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'znake_lang',
      },
    })
  }
  applyStaticDomTranslations()
  i18next.off('languageChanged', applyStaticDomTranslations)
  i18next.on('languageChanged', applyStaticDomTranslations)
}

export const t = (key: string, vars?: Record<string, unknown>): string => i18next.t(key, vars)

export const getLanguage = (): 'en' | 'ca' => (i18next.resolvedLanguage === 'ca' ? 'ca' : 'en')

export const setLanguage = async (lang: 'en' | 'ca'): Promise<void> => {
  await i18next.changeLanguage(lang)
}

export const toggleLanguage = async (): Promise<'en' | 'ca'> => {
  const next = getLanguage() === 'ca' ? 'en' : 'ca'
  await setLanguage(next)
  return next
}
