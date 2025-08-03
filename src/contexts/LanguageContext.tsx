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
    'upgrade.learn_more': 'Learn More',

    // International Markets
    'international.title': 'International Markets',
    'international.subtitle': 'Create localized landing pages for global markets',
    'international.target_market': 'Target Market',
    'international.market_insights': 'Market Insights',
    'international.cultural_considerations': 'Cultural Considerations',
    'international.create_for_market': 'Create for Market',
    'international.localized_page': 'Localized Page',
    'international.global_opportunities': 'Global Market Opportunities',
    'international.best_hours': 'Best Hours',
    'international.population': 'Population',
    'international.gdp_per_capita': 'GDP per Capita',
    'international.internet_penetration': 'Internet Penetration',
    'international.ecommerce_growth': 'E-commerce Growth',
    'international.currency': 'Currency',
    'international.all_markets': 'All Markets',
    'international.live_pages': 'Live Pages',
    'international.ab_testing': 'A/B Testing',
    'international.performance': 'Performance',
    'international.total_revenue': 'Total Revenue',
    'international.best_performing': 'Best Performing Market',
    'international.active_markets': 'Active Markets',
    'international.countries_reached': 'Countries Reached',
    'international.conversion_rate': 'Conversion Rate',
    'international.market_adaptation': 'Market Adaptation',
    'international.cultural_notes': 'Cultural Notes',
    'international.clone_page': 'Clone Page',
    'international.live_in': 'Live in',
    'international.creating_localized': 'Creating localized page',
    'international.page_created_for': 'Landing page created for market',

    // Geo-targeting
    'geo.targeting': 'Geo-targeting',
    'geo.location_based': 'Location-based Content',
    'geo.timezone_optimization': 'Timezone Optimization',
    'geo.local_payment_methods': 'Local Payment Methods',
    'geo.shipping_options': 'Shipping Options',
    'geo.tax_compliance': 'Tax Compliance',
    'geo.language_detection': 'Auto Language Detection',
    'geo.currency_conversion': 'Currency Conversion',

    // Market Analysis
    'market.analysis': 'Market Analysis',
    'market.competitor_research': 'Competitor Research',
    'market.trend_analysis': 'Trend Analysis',
    'market.price_optimization': 'Price Optimization',
    'market.seasonal_trends': 'Seasonal Trends',
    'market.local_holidays': 'Local Holidays',
    'market.buying_behavior': 'Buying Behavior',
    'market.payment_preferences': 'Payment Preferences',

    // Cultural Marketing
    'cultural.marketing.title': 'Cultural Marketing Copy Generator',
    'cultural.marketing.subtitle': 'Generate culturally adapted marketing copy for global markets',
    'cultural.single_market': 'Single Market',
    'cultural.multiple_markets': 'Multiple Markets',
    'cultural.cultural_insights': 'Cultural Insights',
    'cultural.product_information': 'Product Information',
    'cultural.product_name': 'Product Name',
    'cultural.product_description': 'Product Description',
    'cultural.target_market': 'Target Market',
    'cultural.copy_type': 'Copy Type',
    'cultural.tone': 'Tone',
    'cultural.industry': 'Industry',
    'cultural.target_audience': 'Target Audience',
    'cultural.generate_copy': 'Generate Cultural Copy',
    'cultural.generating': 'Generating Cultural Copy...',
    'cultural.multi_market_campaign': 'Multi-Market Campaign',
    'cultural.select_markets': 'Target Markets',
    'cultural.selected_markets': 'Selected Markets',
    'cultural.cultural_notes': 'Cultural Notes',
    'cultural.preferred_tone': 'Preferred Tone',
    'cultural.working_hours': 'Working Hours',
    'cultural.major_holidays': 'Major Holidays',
    'cultural.generated_copy': 'Generated Cultural Copy',
    'cultural.adapted_copy': 'Adapted Copy',
    'cultural.cultural_adaptations': 'Cultural Adaptations',
    'cultural.localized_elements': 'Localized Elements',
    'cultural.best_timing': 'Best Timing',
    'cultural.recommended_cta': 'Recommended CTA',
    'cultural.export_results': 'Export Results',
    'cultural.copy_success': 'Cultural copy generated successfully!',
    'cultural.copy_error': 'Failed to generate copy. Please try again.',
    'cultural.copied_clipboard': 'Copied to clipboard!',
    'cultural.exported_success': 'Results exported successfully!'
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

    // International Markets
    'international.title': 'Mercados Internacionales',
    'international.subtitle': 'Crea páginas de destino localizadas para mercados globales',
    'international.target_market': 'Mercado Objetivo',
    'international.market_insights': 'Información del Mercado',
    'international.cultural_considerations': 'Consideraciones Culturales',
    'international.create_for_market': 'Crear para Mercado',
    'international.localized_page': 'Página Localizada',
    'international.global_opportunities': 'Oportunidades de Mercado Global',
    'international.best_hours': 'Mejores Horas',
    'international.population': 'Población',
    'international.gdp_per_capita': 'PIB per Cápita',
    'international.internet_penetration': 'Penetración de Internet',
    'international.ecommerce_growth': 'Crecimiento E-commerce',
    'international.currency': 'Moneda',
    'international.all_markets': 'Todos los Mercados',
    'international.live_pages': 'Páginas Activas',
    'international.ab_testing': 'Pruebas A/B',
    'international.performance': 'Rendimiento',
    'international.total_revenue': 'Ingresos Totales',
    'international.best_performing': 'Mejor Mercado',
    'international.active_markets': 'Mercados Activos',
    'international.countries_reached': 'Países Alcanzados',

    // Common Actions
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.create': 'Crear',
    'common.generate': 'Generar',
    'common.loading': 'Cargando...',
    'common.success': '¡Éxito!',
    'common.error': 'Error',
    'common.try_again': 'Intentar de Nuevo',
    'common.close': 'Cerrar',
    'common.open': 'Abrir',
    'common.view': 'Ver',
    'common.download': 'Descargar',
    'common.share': 'Compartir',
    'common.copy': 'Copiar',
    'common.copied': '¡Copiado!',

    // Cultural Marketing
    'cultural.marketing.title': 'Generador de Copy de Marketing Cultural',
    'cultural.marketing.subtitle': 'Genera copy de marketing adaptado culturalmente para mercados globales',
    'cultural.single_market': 'Mercado Individual',
    'cultural.multiple_markets': 'Múltiples Mercados',
    'cultural.cultural_insights': 'Insights Culturales',
    'cultural.product_information': 'Información del Producto',
    'cultural.product_name': 'Nombre del Producto',
    'cultural.product_description': 'Descripción del Producto',
    'cultural.target_market': 'Mercado Objetivo',
    'cultural.copy_type': 'Tipo de Copy',
    'cultural.tone': 'Tono',
    'cultural.industry': 'Industria',
    'cultural.target_audience': 'Audiencia Objetivo',
    'cultural.generate_copy': 'Generar Copy Cultural',
    'cultural.generating': 'Generando Copy Cultural...',
    'cultural.multi_market_campaign': 'Campaña Multi-Mercado',
    'cultural.select_markets': 'Mercados Objetivo',
    'cultural.selected_markets': 'Mercados Seleccionados',
    'cultural.cultural_notes': 'Notas Culturales',
    'cultural.preferred_tone': 'Tono Preferido',
    'cultural.working_hours': 'Horarios de Trabajo',
    'cultural.major_holidays': 'Festividades Principales',
    'cultural.generated_copy': 'Copy Cultural Generado',
    'cultural.adapted_copy': 'Copy Adaptado',
    'cultural.cultural_adaptations': 'Adaptaciones Culturales',
    'cultural.localized_elements': 'Elementos Localizados',
    'cultural.best_timing': 'Mejor Momento',
    'cultural.recommended_cta': 'CTA Recomendado',
    'cultural.export_results': 'Exportar Resultados',
    'cultural.copy_success': '¡Copy cultural generado exitosamente!',
    'cultural.copy_error': 'Error al generar copy. Inténtalo de nuevo.',
    'cultural.copied_clipboard': '¡Copiado al portapapeles!',
    'cultural.exported_success': '¡Resultados exportados exitosamente!'

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

    // International Markets
    'international.title': 'Mercados Internacionais',
    'international.subtitle': 'Crie páginas de destino localizadas para mercados globais',
    'international.target_market': 'Mercado Alvo',
    'international.market_insights': 'Insights do Mercado',
    'international.cultural_considerations': 'Considerações Culturais',
    'international.create_for_market': 'Criar para Mercado',
    'international.localized_page': 'Página Localizada',
    'international.global_opportunities': 'Oportunidades de Mercado Global',
    'international.best_hours': 'Melhores Horários',
    'international.population': 'População',
    'international.gdp_per_capita': 'PIB per Capita',
    'international.internet_penetration': 'Penetração da Internet',
    'international.ecommerce_growth': 'Crescimento E-commerce',
    'international.currency': 'Moeda',
    'international.all_markets': 'Todos os Mercados',
    'international.live_pages': 'Páginas Ativas',
    'international.ab_testing': 'Teste A/B',
    'international.performance': 'Performance',
    'international.total_revenue': 'Receita Total',
    'international.best_performing': 'Melhor Mercado',
    'international.active_markets': 'Mercados Ativos',
    'international.countries_reached': 'Países Alcançados',

    // Cultural Marketing
    'cultural.marketing.title': 'Gerador de Copy de Marketing Cultural',
    'cultural.marketing.subtitle': 'Gere copy de marketing adaptado culturalmente para mercados globais',
    'cultural.single_market': 'Mercado Individual',
    'cultural.multiple_markets': 'Múltiplos Mercados',
    'cultural.cultural_insights': 'Insights Culturais',
    'cultural.product_information': 'Informações do Produto',
    'cultural.product_name': 'Nome do Produto',
    'cultural.product_description': 'Descrição do Produto',
    'cultural.target_market': 'Mercado Alvo',
    'cultural.copy_type': 'Tipo de Copy',
    'cultural.tone': 'Tom',
    'cultural.industry': 'Indústria',
    'cultural.target_audience': 'Público-Alvo',
    'cultural.generate_copy': 'Gerar Copy Cultural',
    'cultural.generating': 'Gerando Copy Cultural...',
    'cultural.multi_market_campaign': 'Campanha Multi-Mercado',
    'cultural.select_markets': 'Mercados Alvo',
    'cultural.selected_markets': 'Mercados Selecionados',
    'cultural.cultural_notes': 'Notas Culturais',
    'cultural.preferred_tone': 'Tom Preferido',
    'cultural.working_hours': 'Horários de Trabalho',
    'cultural.major_holidays': 'Feriados Principais',
    'cultural.generated_copy': 'Copy Cultural Gerado',
    'cultural.adapted_copy': 'Copy Adaptado',
    'cultural.cultural_adaptations': 'Adaptações Culturais',
    'cultural.localized_elements': 'Elementos Localizados',
    'cultural.best_timing': 'Melhor Momento',
    'cultural.recommended_cta': 'CTA Recomendado',
    'cultural.export_results': 'Exportar Resultados',
    'cultural.copy_success': 'Copy cultural gerado com sucesso!',
    'cultural.copy_error': 'Falha ao gerar copy. Tente novamente.',
    'cultural.copied_clipboard': 'Copiado para a área de transferência!',
    'cultural.exported_success': 'Resultados exportados com sucesso!'
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

    // International Markets (Hebrew - RTL)
    'international.title': 'שווקים בינלאומיים',
    'international.subtitle': 'צור דפי נחיתה מותאמים לשווקים גלובליים',
    'international.target_market': 'שוק יעד',
    'international.market_insights': 'תובנות שוק',
    'international.cultural_considerations': 'שיקולים תרבותיים',
    'international.create_for_market': 'צור עבור שוק',
    'international.localized_page': 'דף מותאם מקומית',
    'international.global_opportunities': 'הזדמנויות שוק גלובליות',
    'international.best_hours': 'שעות מומלצות',
    'international.population': 'אוכלוסייה',
    'international.gdp_per_capita': 'תמ"ג לנפש',
    'international.internet_penetration': 'חדירת אינטרנט',
    'international.ecommerce_growth': 'צמיחת מסחר אלקטרוני',
    'international.currency': 'מטבע',
    'international.all_markets': 'כל השווקים',
    'international.live_pages': 'דפים פעילים',
    'international.ab_testing': 'בדיקת A/B',
    'international.performance': 'ביצועים',
    'international.total_revenue': 'הכנסות כוללות',
    'international.best_performing': 'השוק הטוב ביותר',
    'international.active_markets': 'שווקים פעילים',
    'international.countries_reached': 'מדינות שהושגו'
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

    // International Markets (Arabic - RTL)
    'international.title': 'الأسواق الدولية',
    'international.subtitle': 'إنشاء صفحات هبوط مخصصة للأسواق العالمية',
    'international.target_market': 'السوق المستهدف',
    'international.market_insights': 'رؤى السوق',
    'international.cultural_considerations': 'الاعتبارات الثقافية',
    'international.create_for_market': 'إنشاء للسوق',
    'international.localized_page': 'صفحة محلية',
    'international.global_opportunities': 'الفرص العالمية',
    'international.best_hours': 'أفضل الأوقات',
    'international.population': 'عدد السكان',
    'international.gdp_per_capita': 'الناتج المحلي للفرد',
    'international.internet_penetration': 'انتشار الإنترنت',
    'international.ecommerce_growth': 'نمو التجارة الإلكترونية',
    'international.currency': 'العملة',
    'international.all_markets': 'جميع الأسواق',
    'international.live_pages': 'الصفحات المباشرة',
    'international.ab_testing': 'اختبار A/B',
    'international.performance': 'الأداء',
    'international.total_revenue': 'إجمالي الإيرادات',
    'international.best_performing': 'أفضل سوق',
    'international.active_markets': 'الأسواق النشطة',
    'international.countries_reached': 'البلدان المستهدفة'
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