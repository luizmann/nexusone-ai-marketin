import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Dashboard } from '../Dashboard'
import { ContentGenerator } from '../ContentGenerator'
import { SocialMediaGenerator } from '../SocialMediaGenerator'
import { CampaignBuilder } from '../CampaignBuilder'
import { AppointmentScheduler } from '../AppointmentScheduler'
import { WhatsAppBookingSystem } from '../WhatsAppBookingSystem'
import { GupShupWhatsAppAI } from '../WhatsAppAIAutomation'
import { Analytics } from '../Analytics'
import { MonitoringDashboard } from '../MonitoringDashboard'
import { AffiliateProgram } from '../AffiliateProgram'
import { PartnerIntegrations } from '../PartnerIntegrations'
import { Credits } from '../Credits'
import { SalesPage } from '../SalesPage'
import { Documentation } from '../Documentation'
import { PrivacyPolicy } from '../PrivacyPolicy'
import { StatusReport } from '../StatusReport'
import { DropshippingDashboard } from '../dropshipping/DropshippingDashboard'
import { DragDropPageEditor } from '../DragDropPageEditor'
import { DropMagic } from '../../pages/DropMagic'
import { SmartAppointments } from '../../pages/SmartAppointments'
import { DragDropEditor } from '../../pages/DragDropEditor'
import DropshippingMarketplacePage from '../../pages/DropshippingMarketplacePage'
import { LaunchCampaignManager } from '../../pages/LaunchCampaignManager'
import { ApiTestingPage } from '../../pages/ApiTestingPage'
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
      case 'appointment':
        return <AppointmentScheduler />
      case 'whatsapp-booking':
        return <WhatsAppBookingSystem />
      case 'whatsapp-ai':
        return <GupShupWhatsAppAI />
      case 'analytics':
        return <Analytics />
      case 'monitoring':
        return <MonitoringDashboard />
      case 'affiliate':
        return <AffiliateProgram />
      case 'partners':
        return <PartnerIntegrations />
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
      case 'dropshipping':
        return <DropshippingDashboard />
      case 'dropshipping-marketplace':
        return <DropshippingMarketplacePage />
      case 'drop-magic':
        return <DropMagic />
      case 'smart-appointments':
        return <SmartAppointments />
      case 'page-editor':
        return <DragDropPageEditor />
      case 'drag-drop-editor':
        return <DragDropEditor />
      case 'launch-campaigns':
        return <LaunchCampaignManager />
      case 'api-testing':
        return <ApiTestingPage />
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