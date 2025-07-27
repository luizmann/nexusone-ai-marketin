import { useState } from 'react'
import { CleanSidebar } from './CleanSidebar'
import { Header } from './Header'
import { Dashboard } from '../../pages/Dashboard'
import { MagicPages } from '../features/MagicPages'
import { SmartCampaigns } from '../features/SmartCampaigns'
import { VideoGenerator } from '../features/VideoGenerator'
import { WinnerProducts } from '../features/WinnerProducts'
import { WhatsAppAI } from '../features/WhatsAppAI'
import { SmartAppointments } from '../features/SmartAppointments'
import { NexBrain } from '../features/NexBrain'
import { Credits } from '../../pages/Credits'
import { Settings } from '../../pages/Settings'
import { useLanguage } from '../../contexts/CleanLanguageContext'

export function CleanDashboardLayout() {
  const [activeModule, setActiveModule] = useState('dashboard')
  const { isRTL } = useLanguage()

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard onModuleChange={setActiveModule} />
      case 'magic-pages':
        return <MagicPages />
      case 'smart-campaigns':
        return <SmartCampaigns />
      case 'video-generator':
        return <VideoGenerator />
      case 'winner-products':
        return <WinnerProducts />
      case 'whatsapp-ai':
        return <WhatsAppAI />
      case 'smart-appointments':
        return <SmartAppointments />
      case 'nexbrain':
        return <NexBrain />
      case 'credits':
        return <Credits />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard onModuleChange={setActiveModule} />
    }
  }

  return (
    <div className={`flex h-screen bg-background ${isRTL ? 'flex-row-reverse' : ''}`}>
      <CleanSidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  )
}