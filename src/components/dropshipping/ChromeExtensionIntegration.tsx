import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Download, 
  Link, 
  Chrome, 
  Shield, 
  Key, 
  Settings, 
  CheckCircle, 
  XCircle,
  Copy,
  RefreshCw,
  Zap,
  Package,
  TrendingUp,
  Clock
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useLanguage } from '../../contexts/CleanLanguageContext'

interface ExtensionSession {
  id: string
  session_token: string
  permissions: string[]
  expires_at: string
  is_active: boolean
  created_at: string
}

export function ChromeExtensionIntegration() {
  const { t } = useLanguage()
  const [user] = useKV('user-profile', null)
  const [sessions, setSessions] = useState<ExtensionSession[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingToken, setGeneratingToken] = useState(false)
  const [extensionConnected, setExtensionConnected] = useState(false)
  const [showInstallDialog, setShowInstallDialog] = useState(false)

  useEffect(() => {
    if (user) {
      loadSessions()
      checkExtensionConnection()
    }
  }, [user])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chrome-extension/sessions', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error('Failed to load sessions:', error)
      toast.error('Failed to load extension sessions')
    } finally {
      setLoading(false)
    }
  }

  const checkExtensionConnection = () => {
    // Check if extension is connected by looking for extension-specific events
    const handleExtensionMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NEXUS_EXTENSION_CONNECTED') {
        setExtensionConnected(true)
      }
    }

    window.addEventListener('message', handleExtensionMessage)
    
    // Send ping to extension
    window.postMessage({ type: 'NEXUS_PING' }, '*')
    
    return () => window.removeEventListener('message', handleExtensionMessage)
  }

  const generateSessionToken = async () => {
    try {
      setGeneratingToken(true)
      const response = await fetch('/api/chrome-extension/generate-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          permissions: ['product_import', 'bulk_selection']
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        toast.success('Session token generated successfully')
        await loadSessions()
        
        // Copy token to clipboard
        await navigator.clipboard.writeText(result.token)
        toast.success('Token copied to clipboard')
      } else {
        toast.error(result.error || 'Failed to generate token')
      }
    } catch (error) {
      console.error('Generate token error:', error)
      toast.error('Failed to generate session token')
    } finally {
      setGeneratingToken(false)
    }
  }

  const revokeSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chrome-extension/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success('Session revoked successfully')
        await loadSessions()
      } else {
        toast.error('Failed to revoke session')
      }
    } catch (error) {
      console.error('Revoke session error:', error)
      toast.error('Failed to revoke session')
    }
  }

  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token)
      toast.success('Token copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy token')
    }
  }

  const downloadExtension = () => {
    // In a real implementation, this would link to Chrome Web Store or provide download
    window.open('https://chrome.google.com/webstore/category/extensions', '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Chrome Extension</h1>
          <p className="text-muted-foreground">
            Integrate with CJ Dropshipping for rapid product import
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={downloadExtension} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Extension
          </Button>
          <Button onClick={generateSessionToken} disabled={generatingToken}>
            <Key className="h-4 w-4 mr-2" />
            {generatingToken ? 'Generating...' : 'Generate Token'}
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${extensionConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <h3 className="font-semibold">Extension Status</h3>
              <p className="text-sm text-muted-foreground">
                {extensionConnected ? 'Connected and ready' : 'Not connected'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Chrome className="h-8 w-8 text-blue-500" />
            {extensionConnected ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
          </div>
        </div>
        
        {!extensionConnected && (
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Extension Not Connected</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Install the NexusOne Chrome extension and connect it with a session token to enable rapid product importing from CJ Dropshipping.
                </p>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setShowInstallDialog(true)}
                >
                  Setup Instructions
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="h-8 w-8 text-yellow-500" />
            <h3 className="font-semibold">Rapid Import</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Browse CJ Dropshipping and import products with a single click directly from product pages.
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Package className="h-8 w-8 text-blue-500" />
            <h3 className="font-semibold">Bulk Selection</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Select multiple products at once and import them in bulk with customizable settings.
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <h3 className="font-semibold">Smart Filtering</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Automatically filter products by profit margins, ratings, and shipping times.
          </p>
        </Card>
      </div>

      {/* Active Sessions */}
      <Card>
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Active Sessions</h3>
              <p className="text-sm text-muted-foreground">
                Manage your Chrome extension authentication tokens
              </p>
            </div>
            <Button onClick={loadSessions} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No active sessions</p>
              <p className="text-sm text-muted-foreground">Generate a token to connect your Chrome extension</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${session.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Session {session.id.slice(0, 8)}</p>
                        <div className="flex gap-1">
                          {session.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Created: {new Date(session.created_at).toLocaleDateString()}</span>
                        <span>Expires: {new Date(session.expires_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToken(session.session_token)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => revokeSession(session.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Setup Instructions Dialog */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chrome Extension Setup</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="install" className="w-full">
            <TabsList>
              <TabsTrigger value="install">Install</TabsTrigger>
              <TabsTrigger value="connect">Connect</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="install" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Step 1: Install the Extension</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Visit the Chrome Web Store</li>
                    <li>Search for "NexusOne CJ Dropshipping Importer"</li>
                    <li>Click "Add to Chrome" and confirm the installation</li>
                    <li>Pin the extension to your toolbar for easy access</li>
                  </ol>
                </div>
                
                <div className="flex justify-center">
                  <Button onClick={downloadExtension}>
                    <Chrome className="h-4 w-4 mr-2" />
                    Open Chrome Web Store
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="connect" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Step 2: Connect with Token</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Generate a session token using the button above</li>
                    <li>Click the extension icon in your browser</li>
                    <li>Paste the token in the connection field</li>
                    <li>Click "Connect" to authenticate</li>
                  </ol>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Security Note</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Session tokens expire automatically for security. Generate a new token when needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="usage" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Step 3: Import Products</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Navigate to CJ Dropshipping website</li>
                    <li>Browse products or search for specific items</li>
                    <li>Click the NexusOne extension icon on product pages</li>
                    <li>Select import options (markup, category, etc.)</li>
                    <li>Click "Import to NexusOne" to add to your catalog</li>
                  </ol>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Bulk Import Features:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Select multiple products from category pages</li>
                    <li>Apply bulk markup and categorization</li>
                    <li>Filter by profit margins and ratings</li>
                    <li>Import trending products with one click</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}