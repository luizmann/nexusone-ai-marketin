import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Dashboard } from '../Dashboard'
import { ContentGenerator } from '../ContentGenerator'
import { CampaignBuilder } from '../CampaignBuilder'
import { Analytics } from '../Analytics'
import { Credits } from '../Credits'

export function DashboardLayout() {
  const [activeModule, setActiveModule] = useState('dashboard')

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />
      case 'content':
        return <ContentGenerator />
      case 'campaigns':
        return <CampaignBuilder />
      case 'analytics':
        return <Analytics />
      case 'credits':
        return <Credits />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
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