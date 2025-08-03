import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Sparkles, 
  Video, 
  MessageCircle, 
  TrendingUp, 
  Target,
  Globe,
  BarChart3,
  Brain,
  Settings,
  Shield,
  X
} from '@phosphor-icons/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    name: 'nav.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    category: 'main'
  },
  {
    name: 'nav.magic_pages',
    href: '/magic-pages',
    icon: Sparkles,
    category: 'ai'
  },
  {
    name: 'nav.video_creator',
    href: '/video-creator',
    icon: Video,
    category: 'ai'
  },
  {
    name: 'nav.whatsapp',
    href: '/whatsapp',
    icon: MessageCircle,
    category: 'marketing'
  },
  {
    name: 'nav.facebook_ads',
    href: '/facebook-ads',
    icon: Target,
    category: 'marketing'
  },
  {
    name: 'nav.dropshipping',
    href: '/dropshipping',
    icon: TrendingUp,
    category: 'business'
  },
  {
    name: 'international.title',
    href: '/international',
    icon: Globe,
    category: 'business'
  },
  {
    name: 'Cultural Marketing',
    href: '/cultural-marketing',
    icon: Globe,
    category: 'marketing'
  },
  {
    name: 'nav.analytics',
    href: '/analytics',
    icon: BarChart3,
    category: 'insights'
  },
  {
    name: 'ai.nexbrain_assistant',
    href: '/nexbrain',
    icon: Brain,
    category: 'ai'
  },
  {
    name: 'nav.settings',
    href: '/settings',
    icon: Settings,
    category: 'system'
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: Shield,
    category: 'system'
  }
];

const categories = {
  main: { label: 'Dashboard', color: 'text-blue-600' },
  ai: { label: 'AI Tools', color: 'text-purple-600' },
  marketing: { label: 'Marketing', color: 'text-green-600' },
  business: { label: 'Business', color: 'text-orange-600' },
  insights: { label: 'Analytics', color: 'text-pink-600' },
  system: { label: 'System', color: 'text-gray-600' }
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose(); // Close mobile sidebar after navigation
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const groupedItems = navigationItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full",
        currentLanguage.rtl && "right-0 left-auto"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">NexusOne AI</h1>
              <p className="text-xs text-muted-foreground">Global Marketing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
              const items = groupedItems[categoryKey];
              if (!items || items.length === 0) return null;

              return (
                <div key={categoryKey}>
                  <h3 className={cn(
                    "text-xs font-semibold uppercase tracking-wider mb-3",
                    categoryInfo.color
                  )}>
                    {categoryInfo.label}
                  </h3>
                  <div className="space-y-1">
                    {items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      
                      return (
                        <button
                          key={item.href}
                          onClick={() => handleNavigation(item.href)}
                          className={cn(
                            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                            active 
                              ? "bg-primary text-primary-foreground shadow-sm" 
                              : "hover:bg-muted/50 text-foreground"
                          )}
                        >
                          <Icon className={cn(
                            "h-5 w-5 flex-shrink-0",
                            active ? "text-primary-foreground" : categoryInfo.color
                          )} />
                          <span className="font-medium">
                            {t(item.name) || item.name}
                          </span>
                          {item.href === '/international' && (
                            <Globe className="h-3 w-3 ml-auto text-blue-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Pro Plan</p>
                <p className="text-xs text-muted-foreground">
                  {currentLanguage.code === 'en' ? '500 credits remaining' :
                   currentLanguage.code === 'pt' ? '500 créditos restantes' :
                   currentLanguage.code === 'es' ? '500 créditos restantes' :
                   currentLanguage.code === 'he' ? '500 קרדיטים נותרו' :
                   '500 نقطة متبقية'}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}