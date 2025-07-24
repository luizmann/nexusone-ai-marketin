import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Dashboard } from '../Dashboard'
import { ContentGenerator } from '../ContentGenerator'
import { SocialMediaGenerator } from '../SocialMediaGenerator'
import { CampaignBuilder } from '../CampaignBuilder'
import { Analytics } from '../Analytics'
import { MonitoringDashboard } from '../MonitoringDashboard'
import { Credits } from '../Credits'
import { SalesPage } from '../SalesPage'
import { Documentation } from '../Documentation'
import { PrivacyPolicy } from '../PrivacyPolicy'
import { StatusReport } from '../StatusReport'
import { useLanguage } from '../../contexts/LanguageContext'

export function DashboardLayout() {
  const [activeModule, setActiveModule] = useState('dashboard')
  const { isRTL } = useLanguage()

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard onModuleChange={setActiveModule} />
      case 'content':
        return <ContentGenerator />
      case 'social-media':
        return <SocialMediaGenerator />
      case 'campaigns':
        return <CampaignBuilder />
      case 'analytics':
        return <Analytics />
      case 'monitoring':
        return <MonitoringDashboard />
      case 'credits':
        return <Credits />
      case 'sales-page':
        return <SalesPage />
      case 'documentation':
        return <Documentation />
      case 'privacy':
        return <PrivacyPolicy />
      case 'status':
        return <StatusReport />
      default:
        return <Dashboard onModuleChange={setActiveModule} />
    }
  }

  return (
    <div className={`flex h-screen bg-background ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  )
}