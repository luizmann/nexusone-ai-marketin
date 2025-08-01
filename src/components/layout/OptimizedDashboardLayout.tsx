import { useState, useEffect } from 'react'
import { OptimizedSidebar } from './OptimizedSidebar'
import { Header } from './Header'
import { Dashboard } from '../../pages/CleanDashboard'
import { MagicPages } from '../features/MagicPages'
import { SmartCampaigns } from '../features/SmartCampaigns'
import { VideoGenerator } from '../features/VideoGenerator'
import { WinnerProducts } from '../features/WinnerProducts'
import { WhatsAppAI } from '../features/WhatsAppAI'
import { SmartAppointments } from '../features/SmartAppointments'
import { NexBrain } from '../features/NexBrain'
import { AIFeaturesTester } from '../features/AIFeaturesTester'
import { AITestSuite } from '../AITestSuite'
import { ComprehensiveAITestSuite } from '../ComprehensiveAITestSuite'
import { AIIntegrationTester } from '../testing/AIIntegrationTester'
import { PublicRepositoryExplorer } from '../PublicRepositoryExplorer'
import { EnhancedMagicPagesWithCopyPaste } from '../EnhancedMagicPagesWithCopyPaste'
import SalesPageBuilder from '../../pages/SalesPageBuilder'
import { Credits } from '../../pages/Credits'
import { Settings } from '../../pages/Settings'
import { AdminDashboard } from '../../pages/AdminDashboard'
import { ApiConfiguration } from '../../pages/ApiConfiguration'
import { useLanguage } from '../../contexts/CleanLanguageContext'

export function OptimizedDashboardLayout() {
  const [activeModule, setActiveModule] = useState('dashboard')
  const { isRTL } = useLanguage()

  useEffect(() => {
    // Initialize API health monitoring
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
      case 'sales-page-builder':
        return <SalesPageBuilder />
      case 'enhanced-magic-pages':
        return <EnhancedMagicPagesWithCopyPaste />
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
      case 'public-repos':
        return <PublicRepositoryExplorer />
      case 'ai-tester':
        return <AITestSuite />
      case 'comprehensive-ai-test':
        return <ComprehensiveAITestSuite />
      case 'ai-integration-test':
        return <AIIntegrationTester />
      case 'credits':
        return <Credits />
      case 'settings':
        return <Settings />
      case 'admin':
        return <AdminDashboard />
      case 'api-config':
        return <ApiConfiguration />
      default:
        return <Dashboard onModuleChange={setActiveModule} />
    }
  }

  return (
    <div className={`flex h-screen bg-background ${isRTL ? 'flex-row-reverse' : ''}`}>
      <OptimizedSidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  )
}