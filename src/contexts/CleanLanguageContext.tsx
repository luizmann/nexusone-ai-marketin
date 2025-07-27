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

// Import clean translations
import cleanPtTranslations from '../translations/clean-pt.json'

// Simple translations for demonstration
const translations = {
  en: {
    dashboard: "Dashboard",
    magic_pages: "Magic Pages",
    smart_campaigns: "Smart Campaigns",
    video_generator: "Video Generator",
    winner_products: "Winner Products",
    whatsapp_ai: "WhatsApp AI",
    smart_appointments: "Smart Appointments",
    nexbrain: "NexBrain",
    credits: "Credits",
    settings: "Settings",
    overview_and_stats: "Overview and stats",
    ai_landing_pages: "AI landing pages",
    facebook_ads_automation: "Facebook Ads automation",
    ai_video_creation: "AI video creation",
    dropshipping_products: "Dropshipping products",
    automated_sales: "Automated sales",
    booking_automation: "Booking automation",
    ai_assistant: "AI assistant",
    usage_and_billing: "Usage and billing",
    preferences: "Preferences",
    marketing_automation: "Marketing Automation"
  },
  pt: cleanPtTranslations,
  es: {
    dashboard: "Panel",
    magic_pages: "Páginas Mágicas",
    smart_campaigns: "Campañas Inteligentes",
    video_generator: "Generador de Video",
    winner_products: "Productos Ganadores",
    whatsapp_ai: "WhatsApp IA",
    smart_appointments: "Citas Inteligentes",
    nexbrain: "NexBrain",
    credits: "Créditos",
    settings: "Configuraciones",
    overview_and_stats: "Resumen y estadísticas",
    ai_landing_pages: "Landing pages con IA",
    facebook_ads_automation: "Automatización Facebook Ads",
    ai_video_creation: "Creación de videos con IA",
    dropshipping_products: "Productos Dropshipping",
    automated_sales: "Ventas automatizadas",
    booking_automation: "Automatización de reservas",
    ai_assistant: "Asistente IA",
    usage_and_billing: "Uso y facturación",
    preferences: "Preferencias",
    marketing_automation: "Automatización de Marketing"
  },
  he: {
    dashboard: "לוח בקרה",
    magic_pages: "דפים קסומים",
    smart_campaigns: "קמפיינים חכמים",
    video_generator: "מחולל וידאו",
    winner_products: "מוצרים מנצחים",
    whatsapp_ai: "וואטסאפ AI",
    smart_appointments: "תורים חכמים",
    nexbrain: "NexBrain",
    credits: "נקודות זכות",
    settings: "הגדרות",
    overview_and_stats: "סקירה וסטטיסטיקות",
    ai_landing_pages: "דפי נחיתה עם AI",
    facebook_ads_automation: "אוטומציית פייסבוק",
    ai_video_creation: "יצירת וידאו עם AI",
    dropshipping_products: "מוצרי דרופשיפינג",
    automated_sales: "מכירות אוטומטיות",
    booking_automation: "אוטומציית הזמנות",
    ai_assistant: "עוזר AI",
    usage_and_billing: "שימוש וחיוב",
    preferences: "העדפות",
    marketing_automation: "אוטומציית שיווק"
  },
  ar: {
    dashboard: "لوحة التحكم",
    magic_pages: "الصفحات السحرية",
    smart_campaigns: "الحملات الذكية",
    video_generator: "مولد الفيديو",
    winner_products: "المنتجات الرابحة",
    whatsapp_ai: "واتساب AI",
    smart_appointments: "المواعيد الذكية",
    nexbrain: "NexBrain",
    credits: "النقاط",
    settings: "الإعدادات",
    overview_and_stats: "نظرة عامة وإحصائيات",
    ai_landing_pages: "صفحات الهبوط بالذكاء الاصطناعي",
    facebook_ads_automation: "أتمتة إعلانات فيسبوك",
    ai_video_creation: "إنشاء فيديو بالذكاء الاصطناعي",
    dropshipping_products: "منتجات الدروب شيبينغ",
    automated_sales: "المبيعات الآلية",
    booking_automation: "أتمتة الحجز",
    ai_assistant: "مساعد ذكي",
    usage_and_billing: "الاستخدام والفوترة",
    preferences: "التفضيلات",
    marketing_automation: "أتمتة التسويق"
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useKV<Language>('user-language', 'pt')
  
  const isRTL = languages[language].dir === 'rtl'
  
  const t = (key: string): string => {
    const languageTranslations = translations[language] || translations.en
    return languageTranslations[key] || key
  }
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} lang={language}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}