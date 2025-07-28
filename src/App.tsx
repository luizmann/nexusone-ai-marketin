import { useKV } from '@github/spark/hooks'
import { CleanDashboardLayout } from './components/layout/CleanDashboardLayout'
import { WelcomeScreen } from './components/WelcomeScreen'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from '@/components/ui/sonner'
import { LanguageProvider } from './contexts/CleanLanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { CreditProvider } from './contexts/CreditContext'
import { useEffect, useState } from 'react'

function App() {
  const [user] = useKV('user-profile', null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Initialize the application
  useEffect(() => {
    // Check if the application is properly initialized
    const initializeApp = async () => {
      try {
        // Initialize API keys
        const { apiKeyManager } = await import('./services/apiKeyManager')
        apiKeyManager.setDefaultKeys()
        await apiKeyManager.loadAPIKeys()
        
        console.log('✅ NexusOne AI Platform initialized with API keys')
        
        // Wait a moment for KV to load
        await new Promise(resolve => setTimeout(resolve, 100))
        setIsLoading(false)
      } catch (error) {
        console.error('App initialization error:', error)
        setIsLoading(false)
      }
    }
    
    initializeApp()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading NexusOne AI Platform...</p>
          <p className="text-xs text-muted-foreground mt-2">Initializing AI systems...</p>
        </div>
      </div>
    )
  }
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CreditProvider>
          <LanguageProvider>
            {!user ? <WelcomeScreen /> : <CleanDashboardLayout />}
            <Toaster />
          </LanguageProvider>
        </CreditProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App