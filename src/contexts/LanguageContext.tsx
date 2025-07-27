import React, { createContext, useContext, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'

export type Language = 'en' | 'es' | 'pt' | 'he' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const languages = {
  en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
  es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  pt: { name: 'Português', flag: '🇧🇷', dir: 'ltr' },
  he: { name: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
}

// Static imports for all translations
import enTranslations from '../translations/en.json'
import esTranslations from '../translations/es.json'
import ptTranslations from '../translations/pt.json'
import heTranslations from '../translations/he.json'
import arTranslations from '../translations/ar.json'

const allTranslations = {
  en: enTranslations,
  es: esTranslations,
  pt: ptTranslations,
  he: heTranslations,
  ar: arTranslations
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useKV<Language>('user-language', 'en')
  
  const isRTL = languages[language].dir === 'rtl'
  
  const t = (key: string): string => {
    const translations = allTranslations[language]
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }
  
  // Apply RTL direction to document
  React.useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [isRTL, language])
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}