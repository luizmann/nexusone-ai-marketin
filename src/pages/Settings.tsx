import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/CleanLanguageContext'
import { 
  Gear, 
  User, 
  Bell,
  Shield,
  Globe,
  Palette,
  CreditCard,
  Code,
  Download
} from '@phosphor-icons/react'
import { toast } from 'sonner'

export const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const { language, setLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    twoFactorAuth: false,
    dataExport: false,
    theme: 'light'
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'language', label: 'Language', icon: <Globe className="h-4 w-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'api', label: 'API', icon: <Code className="h-4 w-4" /> }
  ]

  const saveSettings = () => {
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account preferences and configurations
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={user?.name || ''}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      onChange={(e) => updateProfile({ email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="plan">Current Plan</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <Input
                      id="plan"
                      value={user?.plan?.toUpperCase() || 'FREE'}
                      disabled
                      className="max-w-32"
                    />
                    <Button variant="outline">
                      Upgrade Plan
                    </Button>
                  </div>
                </div>

                <Button onClick={saveSettings}>Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Get notified about account activity</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">Real-time notifications in browser</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Emails</h3>
                    <p className="text-sm text-muted-foreground">Tips, updates, and promotional content</p>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, marketingEmails: checked }))
                    }
                  />
                </div>

                <Button onClick={saveSettings}>Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Protect your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, twoFactorAuth: checked }))
                    }
                  />
                </div>

                <Button onClick={saveSettings}>Update Security</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'language' && (
            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>Customize your language preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="language">Display Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="pt">🇧🇷 Português</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="he">🇮🇱 עברית</SelectItem>
                      <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="america/new_york">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/new_york">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="america/chicago">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="america/denver">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="america/los_angeles">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="europe/london">London (UTC+0)</SelectItem>
                      <SelectItem value="europe/paris">Paris (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      <SelectItem value="brl">BRL - Brazilian Real</SelectItem>
                      <SelectItem value="ils">ILS - Israeli Shekel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={saveSettings}>Save Language Settings</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Current Plan</h3>
                    <span className="text-2xl font-bold">{user?.plan?.toUpperCase()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user?.plan === 'free' ? 'Free forever with basic features' : 
                     user?.plan === 'pro' ? '$97/month - Professional features' :
                     '$297/month - Everything included'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{user?.credits}</div>
                    <div className="text-sm text-muted-foreground">AI Credits</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-accent">{user?.videoCredits}</div>
                    <div className="text-sm text-muted-foreground">Video Credits</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                  <Button variant="outline" className="w-full">
                    Buy Additional Credits
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Billing History
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Manage your API keys and integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="sk-proj-..."
                    value="sk-proj-••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"
                  />
                </div>

                <div>
                  <Label htmlFor="cj-key">CJ Dropshipping API Key</Label>
                  <Input
                    id="cj-key"
                    type="password"
                    placeholder="Enter your CJ API key"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp-token">WhatsApp Business Token</Label>
                  <Input
                    id="whatsapp-token"
                    type="password"
                    placeholder="Enter your WhatsApp token"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Data Export</h3>
                    <p className="text-sm text-muted-foreground">Allow data export via API</p>
                  </div>
                  <Switch
                    checked={settings.dataExport}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, dataExport: checked }))
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveSettings}>
                    Save API Settings
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings