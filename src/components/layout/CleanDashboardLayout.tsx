import { useState, useEffect } from 'react'
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
import ApiTestPage from '../../pages/ApiTestPage'
import { APIHealthDashboard } from '../monitoring/APIHealthDashboard'
import { APIConfigPanel } from '../admin/APIConfigPanel'
import { ApiConfiguration } from '../../pages/ApiConfiguration'
import { useLanguage } from '../../contexts/CleanLanguageContext'

export function CleanDashboardLayout() {
  const [activeModule, setActiveModule] = useState('dashboard')
  const { isRTL } = useLanguage()

  // Initialize API health monitoring on component mount
  useEffect(() => {
    // Load the health monitor script
    if (typeof window !== 'undefined' && !window.healthMonitor) {
      const script = document.createElement('script')
      script.src = '/src/utils/api-health-monitor.js'
      script.type = 'module'
      document.head.appendChild(script)
    }
  }, [])

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
      case 'api-test':
        return <ApiTestPage />
      case 'api-health':
        return <APIHealthDashboard />
      case 'api-config':
        return <ApiConfiguration />
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