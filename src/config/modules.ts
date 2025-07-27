import { useLanguage } from '@/contexts/LanguageContext'

export interface ModuleConfig {
  id: string
  name: string
  description: string
  icon: string
  path: string
  creditCost: number
  requiredPlan: 'free' | 'pro' | 'premium'
  category: 'core' | 'generation' | 'marketing' | 'automation'
  beta?: boolean
  comingSoon?: boolean
}

export function useModules(): ModuleConfig[] {
  const { t } = useLanguage()
  
  return [
    // Core SaaS Features
    {
      id: 'magic-sales-generator',
      name: t('modules.magic_sales_generator.title'),
      description: t('modules.magic_sales_generator.description'),
      icon: '🪄',
      path: '/magic-sales-generator',
      creditCost: 15,
      requiredPlan: 'free',
      category: 'core'
    },
    {
      id: 'drag-drop-editor',
      name: t('modules.drag_drop_editor.title'),
      description: t('modules.drag_drop_editor.description'),
      icon: '🎨',
      path: '/page-editor',
      creditCost: 5,
      requiredPlan: 'free',
      category: 'core'
    },
    {
      id: 'campaign-generator',
      name: t('modules.campaign_generator.title'),
      description: t('modules.campaign_generator.description'),
      icon: '🚀',
      path: '/campaign-generator',
      creditCost: 20,
      requiredPlan: 'pro',
      category: 'marketing'
    },
    
    // AI Generation Tools
    {
      id: 'magic-video-creator',
      name: t('modules.magic_video_creator.title'),
      description: t('modules.magic_video_creator.description'),
      icon: '🎬',
      path: '/video-creator',
      creditCost: 30,
      requiredPlan: 'pro',
      category: 'generation'
    },
    {
      id: 'nexbrain-assistant',
      name: t('modules.nexbrain_assistant.title'),
      description: t('modules.nexbrain_assistant.description'),
      icon: '🧠',
      path: '/nexbrain',
      creditCost: 10,
      requiredPlan: 'free',
      category: 'core'
    },
    
    // Marketing & Automation
    {
      id: 'auto-whatsapp',
      name: t('modules.auto_whatsapp.title'),
      description: t('modules.auto_whatsapp.description'),
      icon: '💬',
      path: '/whatsapp',
      creditCost: 5,
      requiredPlan: 'free',
      category: 'automation'
    },
    {
      id: 'smart-analytics',
      name: t('modules.smart_analytics.title'),
      description: t('modules.smart_analytics.description'),
      icon: '📊',
      path: '/analytics',
      creditCost: 12,
      requiredPlan: 'pro',
      category: 'marketing'
    },
    
    // Business Growth
    {
      id: 'winner-products-hub',
      name: t('modules.winner_products_hub.title'),
      description: t('modules.winner_products_hub.description'),
      icon: '🏆',
      path: '/winner-products',
      creditCost: 8,
      requiredPlan: 'pro',
      category: 'generation'
    },
    {
      id: 'income-generator',
      name: t('modules.income_generator.title'),
      description: t('modules.income_generator.description'),
      icon: '💰',
      path: '/income-generator',
      creditCost: 8,
      requiredPlan: 'free',
      category: 'generation'
    },
    
    // Premium Features
    {
      id: 'nexusone-marketplace',
      name: t('modules.nexusone_marketplace.title'),
      description: t('modules.nexusone_marketplace.description'),
      icon: '🏪',
      path: '/marketplace',
      creditCost: 0,
      requiredPlan: 'premium',
      category: 'core'
    }
  ]
}

export const moduleCategories = {
  core: 'Core Features',
  generation: 'AI Generation',
  marketing: 'Marketing Tools', 
  automation: 'Automation'
}

export function getModulesByCategory(modules: ModuleConfig[]) {
  const grouped = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = []
    }
    acc[module.category].push(module)
    return acc
  }, {} as Record<string, ModuleConfig[]>)
  
  return grouped
}

export function getUserAccessibleModules(modules: ModuleConfig[], userPlan: 'free' | 'pro' | 'premium') {
  const planHierarchy = { free: 0, pro: 1, premium: 2 }
  const userLevel = planHierarchy[userPlan]
  
  return modules.filter(module => {
    const moduleLevel = planHierarchy[module.requiredPlan]
    return userLevel >= moduleLevel
  })
}