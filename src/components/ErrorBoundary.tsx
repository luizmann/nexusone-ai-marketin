import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Settings } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-xl font-bold text-red-600">
                System Error Detected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
                <p className="text-sm text-red-700 mb-2">
                  <strong>Message:</strong> {this.state.error?.message}
                </p>
                <details className="text-xs text-red-600">
                  <summary className="cursor-pointer">Stack Trace</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.error?.stack}
                  </pre>
                </details>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Possible Solutions:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Check if all API keys are properly configured in Admin settings</li>
                  <li>• Verify internet connection for external API calls</li>
                  <li>• Clear browser cache and reload the page</li>
                  <li>• Ensure all required environment variables are set</li>
                  <li>• Check browser console for additional error details</li>
                </ul>
              </div>

              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
                    window.location.reload()
                  }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Application
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
                    // Navigate to admin panel
                    window.location.hash = '#admin'
                    window.location.reload()
                  }}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Go to Admin Panel
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>If this error persists, please check the admin dashboard for API configuration.</p>
                <p className="mt-1">NexusOne AI Platform - Version 1.0</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}