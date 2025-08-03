import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  languages: Language[];
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true }
];

// Comprehensive translations for the SaaS platform
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation & Layout
    'nav.dashboard': 'Dashboard',
    'nav.campaigns': 'Campaigns',
    'nav.magic_pages': 'Magic Pages',
    'nav.video_creator': 'Video Creator',
    'nav.whatsapp': 'WhatsApp',
    'nav.facebook_ads': 'Facebook Ads',
    'nav.dropshipping': 'Dropshipping',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'nav.upgrade': 'Upgrade',
    'nav.logout': 'Logout',

    // Dashboard
    'dashboard.welcome': 'Welcome to NexusOneAI',
    'dashboard.subtitle': 'Your AI-powered marketing automation platform',
    'dashboard.quick_stats': 'Quick Stats',
    'dashboard.total_campaigns': 'Total Campaigns',
    'dashboard.active_pages': 'Active Pages',
    'dashboard.total_leads': 'Total Leads',
    'dashboard.conversion_rate': 'Conversion Rate',
    'dashboard.recent_activity': 'Recent Activity',
    'dashboard.create_campaign': 'Create Campaign',
    'dashboard.view_all': 'View All',

    // Authentication
    'auth.sign_in': 'Sign In',
    'auth.sign_up': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.forgot_password': 'Forgot Password?',
    'auth.dont_have_account': "Don't have an account?",
    'auth.already_have_account': 'Already have an account?',
    'auth.create_account': 'Create Account',
    'auth.signing_in': 'Signing in...',
    'auth.creating_account': 'Creating account...',

    // Plans & Pricing
    'plans.free': 'Free',
    'plans.pro': 'Pro',
    'plans.premium': 'Premium',
    'plans.current_plan': 'Current Plan',
    'plans.upgrade_to': 'Upgrade to',
    'plans.features': 'Features',
    'plans.credits_per_month': 'credits per month',
    'plans.videos_per_month': 'videos per month',
    'plans.whatsapp_numbers': 'WhatsApp numbers',
    'plans.landing_pages': 'landing pages',
    'plans.unlimited': 'Unlimited',

    // AI Features
    'ai.generate_campaign': 'Generate Campaign',
    'ai.creating_page': 'Creating page with AI...',
    'ai.generating_video': 'Generating video...',
    'ai.optimizing_ads': 'Optimizing ads...',
    'ai.analyzing_data': 'Analyzing data...',
    'ai.nexbrain_assistant': 'NexBrain AI Assistant',
    'ai.ask_nexbrain': 'Ask NexBrain anything...',

    // Magic Pages
    'magic_pages.title': 'Magic Pages',
    'magic_pages.subtitle': 'AI-generated sales pages that convert',
    'magic_pages.create_new': 'Create New Page',
    'magic_pages.product_url': 'Product URL',
    'magic_pages.enter_url': 'Enter product URL to generate sales page',
    'magic_pages.generating': 'Generating your magic page...',
    'magic_pages.preview': 'Preview',
    'magic_pages.publish': 'Publish',
    'magic_pages.edit': 'Edit',

    // Video Creator
    'video.title': 'AI Video Creator',
    'video.subtitle': 'Create professional marketing videos in seconds',
    'video.create_new': 'Create New Video',
    'video.product_demo': 'Product Demo',
    'video.social_short': 'Social Media Short',
    'video.avatar_promo': 'Avatar Promo',
    'video.generating': 'Generating your video...',
    'video.download': 'Download',
    'video.share': 'Share',

    // WhatsApp
    'whatsapp.title': 'WhatsApp Marketing',
    'whatsapp.subtitle': 'Automate your sales conversations',
    'whatsapp.connect_number': 'Connect Number',
    'whatsapp.scan_qr': 'Scan QR Code',
    'whatsapp.conversations': 'Conversations',
    'whatsapp.templates': 'Templates',
    'whatsapp.analytics': 'Analytics',

    // Facebook Ads
    'facebook.title': 'Facebook Ads Creator',
    'facebook.subtitle': 'AI-generated campaigns that convert',
    'facebook.create_campaign': 'Create Campaign',
    'facebook.audience': 'Target Audience',
    'facebook.budget': 'Daily Budget',
    'facebook.objective': 'Campaign Objective',
    'facebook.generating_ads': 'Generating ads...',

    // Dropshipping
    'dropshipping.title': 'Dropshipping Hub',
    'dropshipping.subtitle': 'Find winning products and automate sales',
    'dropshipping.browse_products': 'Browse Products',
    'dropshipping.trending': 'Trending',
    'dropshipping.bestsellers': 'Bestsellers',
    'dropshipping.add_to_store': 'Add to Store',
    'dropshipping.create_campaign': 'Create Campaign',

    // Common Actions
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.generate': 'Generate',
    'common.loading': 'Loading...',
    'common.success': 'Success!',
    'common.error': 'Error',
    'common.try_again': 'Try Again',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.view': 'View',
    'common.download': 'Download',
    'common.share': 'Share',
    'common.copy': 'Copy',
    'common.copied': 'Copied!',

    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.api_keys': 'API Keys',
    'settings.billing': 'Billing',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',

    // Credits & Usage
    'credits.remaining': 'Credits Remaining',
    'credits.used_this_month': 'Used This Month',
    'credits.resets_on': 'Resets on',
    'credits.buy_more': 'Buy More Credits',
    'credits.insufficient': 'Insufficient credits',

    // Status Messages
    'status.campaign_created': 'Campaign created successfully!',
    'status.page_published': 'Page published successfully!',
    'status.video_generated': 'Video generated successfully!',
    'status.saving': 'Saving...',
    'status.saved': 'Saved successfully!',
    'status.failed': 'Operation failed. Please try again.',

    // Upgrade Prompts
    'upgrade.feature_locked': 'This feature is available in Pro plan',
    'upgrade.credits_needed': 'You need more credits for this action',
    'upgrade.videos_limit': 'You have reached your video limit',
    'upgrade.unlock_now': 'Unlock Now',
    'upgrade.learn_more': 'Learn More'
  },

  es: {
    // Navigation & Layout
    'nav.dashboard': 'Panel',
    'nav.campaigns': 'Campañas',
    'nav.magic_pages': 'Páginas Mágicas',
    'nav.video_creator': 'Creador de Videos',
    'nav.whatsapp': 'WhatsApp',
    'nav.facebook_ads': 'Anuncios Facebook',
    'nav.dropshipping': 'Dropshipping',
    'nav.analytics': 'Analíticas',
    'nav.settings': 'Configuración',
    'nav.upgrade': 'Actualizar',
    'nav.logout': 'Cerrar Sesión',

    // Dashboard
    'dashboard.welcome': 'Bienvenido a NexusOneAI',
    'dashboard.subtitle': 'Tu plataforma de automatización de marketing con IA',
    'dashboard.quick_stats': 'Estadísticas Rápidas',
    'dashboard.total_campaigns': 'Campañas Totales',
    'dashboard.active_pages': 'Páginas Activas',
    'dashboard.total_leads': 'Leads Totales',
    'dashboard.conversion_rate': 'Tasa de Conversión',
    'dashboard.recent_activity': 'Actividad Reciente',
    'dashboard.create_campaign': 'Crear Campaña',
    'dashboard.view_all': 'Ver Todo',

    // Authentication
    'auth.sign_in': 'Iniciar Sesión',
    'auth.sign_up': 'Registrarse',
    'auth.email': 'Correo',
    'auth.password': 'Contraseña',
    'auth.confirm_password': 'Confirmar Contraseña',
    'auth.forgot_password': '¿Olvidaste tu contraseña?',
    'auth.dont_have_account': '¿No tienes cuenta?',
    'auth.already_have_account': '¿Ya tienes cuenta?',
    'auth.create_account': 'Crear Cuenta',
    'auth.signing_in': 'Iniciando sesión...',
    'auth.creating_account': 'Creando cuenta...',

    // Common translations for other languages would follow...
    // For brevity, showing pattern - full implementation would include all keys
  },

  pt: {
    // Navigation & Layout
    'nav.dashboard': 'Painel',
    'nav.campaigns': 'Campanhas',
    'nav.magic_pages': 'Páginas Mágicas',
    'nav.video_creator': 'Criador de Vídeos',
    'nav.whatsapp': 'WhatsApp',
    'nav.facebook_ads': 'Anúncios Facebook',
    'nav.dropshipping': 'Dropshipping',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Configurações',
    'nav.upgrade': 'Upgrade',
    'nav.logout': 'Sair',

    // Dashboard
    'dashboard.welcome': 'Bem-vindo ao NexusOneAI',
    'dashboard.subtitle': 'Sua plataforma de automação de marketing com IA',
    'dashboard.quick_stats': 'Estatísticas Rápidas',
    'dashboard.total_campaigns': 'Total de Campanhas',
    'dashboard.active_pages': 'Páginas Ativas',
    'dashboard.total_leads': 'Total de Leads',
    'dashboard.conversion_rate': 'Taxa de Conversão',
    'dashboard.recent_activity': 'Atividade Recente',
    'dashboard.create_campaign': 'Criar Campanha',
    'dashboard.view_all': 'Ver Tudo',
  },

  he: {
    // Navigation & Layout (RTL)
    'nav.dashboard': 'לוח בקרה',
    'nav.campaigns': 'קמפיינים',
    'nav.magic_pages': 'דפים קסומים',
    'nav.video_creator': 'יוצר וידיאו',
    'nav.whatsapp': 'וואטסאפ',
    'nav.facebook_ads': 'פרסומות פייסבוק',
    'nav.dropshipping': 'דרופשיפינג',
    'nav.analytics': 'אנליטיקס',
    'nav.settings': 'הגדרות',
    'nav.upgrade': 'שדרוג',
    'nav.logout': 'התנתק',

    // Dashboard
    'dashboard.welcome': 'ברוכים הבאים ל-NexusOneAI',
    'dashboard.subtitle': 'פלטפורמת האוטומציה שלך לשיווק עם AI',
    'dashboard.quick_stats': 'סטטיסטיקות מהירות',
    'dashboard.total_campaigns': 'סך כל הקמפיינים',
    'dashboard.active_pages': 'דפים פעילים',
    'dashboard.total_leads': 'סך כל הלידים',
    'dashboard.conversion_rate': 'שיעור המרה',
    'dashboard.recent_activity': 'פעילות אחרונה',
    'dashboard.create_campaign': 'צור קמפיין',
    'dashboard.view_all': 'הצג הכל',
  },

  ar: {
    // Navigation & Layout (RTL)
    'nav.dashboard': 'لوحة التحكم',
    'nav.campaigns': 'الحملات',
    'nav.magic_pages': 'الصفحات السحرية',
    'nav.video_creator': 'منشئ الفيديو',
    'nav.whatsapp': 'واتساب',
    'nav.facebook_ads': 'إعلانات فيسبوك',
    'nav.dropshipping': 'دروبشيبينغ',
    'nav.analytics': 'التحليلات',
    'nav.settings': 'الإعدادات',
    'nav.upgrade': 'ترقية',
    'nav.logout': 'تسجيل الخروج',

    // Dashboard
    'dashboard.welcome': 'مرحباً بك في NexusOneAI',
    'dashboard.subtitle': 'منصة أتمتة التسويق بالذكاء الاصطناعي',
    'dashboard.quick_stats': 'إحصائيات سريعة',
    'dashboard.total_campaigns': 'إجمالي الحملات',
    'dashboard.active_pages': 'الصفحات النشطة',
    'dashboard.total_leads': 'إجمالي العملاء المحتملين',
    'dashboard.conversion_rate': 'معدل التحويل',
    'dashboard.recent_activity': 'النشاط الأخير',
    'dashboard.create_campaign': 'إنشاء حملة',
    'dashboard.view_all': 'عرض الكل',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('nexusone-language');
    if (savedLanguage) {
      const language = languages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split('-')[0];
      const detectedLanguage = languages.find(lang => lang.code === browserLang);
      if (detectedLanguage) {
        setCurrentLanguage(detectedLanguage);
      }
    }
  }, []);

  useEffect(() => {
    // Apply RTL direction for Hebrew and Arabic
    document.documentElement.dir = currentLanguage.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage.code;
    
    // Add appropriate font classes for different languages
    document.body.className = document.body.className.replace(/font-\w+/g, '');
    if (currentLanguage.code === 'ar') {
      document.body.classList.add('font-arabic');
    } else if (currentLanguage.code === 'he') {
      document.body.classList.add('font-hebrew');
    }
  }, [currentLanguage]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('nexusone-language', language.code);
  };

  const t = (key: string): string => {
    const translation = translations[currentLanguage.code]?.[key];
    return translation || translations.en[key] || key;
  };

  const value = {
    currentLanguage,
    setLanguage,
    t,
    languages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}