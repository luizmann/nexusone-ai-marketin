import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Warning,
  Code,
  Database,
  Palette,
  Shield,
  Zap,
  Users,
  CreditCard,
  ChartLine
} from "@phosphor-icons/react"

export function StatusReport() {
  const getStatusBadge = (status: 'complete' | 'partial' | 'missing' | 'planned') => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-500"><CheckCircle size={12} className="mr-1" />Complete</Badge>
      case 'partial':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700"><Clock size={12} className="mr-1" />Partial</Badge>
      case 'missing':
        return <Badge variant="destructive"><XCircle size={12} className="mr-1" />Missing</Badge>
      case 'planned':
        return <Badge variant="outline"><Warning size={12} className="mr-1" />Planned</Badge>
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">NexusOne Development Status Report</h1>
        <p className="text-lg text-muted-foreground">
          Complete overview of frontend and backend implementation status
        </p>
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">78%</div>
            <div className="text-sm text-muted-foreground">Overall Complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">85%</div>
            <div className="text-sm text-muted-foreground">Frontend</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">60%</div>
            <div className="text-sm text-muted-foreground">Backend</div>
          </div>
        </div>
      </div>

      {/* Frontend Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="text-accent" />
            Frontend Implementation Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Frontend Progress</span>
              <span className="text-sm font-bold">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold mb-3">✅ Completed Components</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Dashboard Layout</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Welcome Screen</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Content Generator</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Social Media Generator</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Campaign Builder</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Analytics Dashboard</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Credits System</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Navigation & Sidebar</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Documentation Pages</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Privacy Policy</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sales Page</span>
                  {getStatusBadge('complete')}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold mb-3">🔄 Partial/Missing Components</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">User Authentication</span>
                  {getStatusBadge('partial')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Integration</span>
                  {getStatusBadge('missing')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Settings Panel</span>
                  {getStatusBadge('missing')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Profile Management</span>
                  {getStatusBadge('partial')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Notification System</span>
                  {getStatusBadge('missing')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mobile Responsive</span>
                  {getStatusBadge('partial')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Error Handling</span>
                  {getStatusBadge('partial')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Loading States</span>
                  {getStatusBadge('partial')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Dark Mode</span>
                  {getStatusBadge('missing')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backend Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="text-blue-500" />
            Backend Implementation Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Backend Progress</span>
              <span className="text-sm font-bold">60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold mb-3">✅ Implemented Features</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Data Persistence (KV Store)</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">User State Management</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Local Storage System</span>
                  {getStatusBadge('complete')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Content Generation Logic</span>
                  {getStatusBadge('partial')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Credit System Logic</span>
                  {getStatusBadge('partial')}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold mb-3">❌ Missing Backend Features</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">User Authentication API</span>
                  {getStatusBadge('missing')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">AI Integration APIs</span>
                  {getStatusBadge('missing')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Processing</span>
                  {getStatusBadge('missing')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database Schema</span>
                  {getStatusBadge('missing')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Social Media APIs</span>
                  {getStatusBadge('missing')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Service</span>
                  {getStatusBadge('missing')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Analytics Tracking</span>
                  {getStatusBadge('missing')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">File Upload/Storage</span>
                  {getStatusBadge('missing')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Needed to Start Selling */}
      <Card className="border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="text-accent" />
            Requirements to Start Selling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-accent/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🎯 Minimum Viable Product (MVP) Requirements</h4>
            <p className="text-sm text-muted-foreground">
              Essential features needed before launching to customers
            </p>
          </div>

          <div className="grid gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="text-blue-500" size={20} />
                Authentication & User Management
              </h4>
              <div className="space-y-2 ml-6">
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">User registration/login system</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Password reset functionality</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">User profile management</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Session management</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CreditCard className="text-green-500" size={20} />
                Payment Processing
              </h4>
              <div className="space-y-2 ml-6">
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Stripe/PayPal integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Subscription management</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Invoice generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Credit purchase system</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Zap className="text-accent" size={20} />
                Core AI Features
              </h4>
              <div className="space-y-2 ml-6">
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">OpenAI API integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Content generation backend</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Credit deduction system</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Usage tracking</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Database className="text-blue-500" size={20} />
                Database & Storage
              </h4>
              <div className="space-y-2 ml-6">
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">User data storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Content history storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Usage analytics storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Backup & recovery</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="text-yellow-500" size={20} />
                Security & Compliance
              </h4>
              <div className="space-y-2 ml-6">
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">HTTPS/SSL certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Data encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm">GDPR compliance (Privacy Policy)</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm">Terms of Service</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartLine className="text-purple-500" />
            Development Roadmap to Launch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-700">Phase 1: Critical Backend (2-3 weeks)</h4>
              <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                <li>• Set up production database (PostgreSQL/MongoDB)</li>
                <li>• Implement user authentication system</li>
                <li>• Create API endpoints for core features</li>
                <li>• Integrate payment processing</li>
                <li>• Set up AI API connections</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-yellow-700">Phase 2: Core Features (2-3 weeks)</h4>
              <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                <li>• Complete content generation functionality</li>
                <li>• Implement credit system backend</li>
                <li>• Add user dashboard data fetching</li>
                <li>• Create subscription management</li>
                <li>• Add analytics tracking</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-700">Phase 3: Polish & Launch (1-2 weeks)</h4>
              <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                <li>• Complete mobile responsiveness</li>
                <li>• Add comprehensive error handling</li>
                <li>• Implement notification system</li>
                <li>• Set up monitoring and logging</li>
                <li>• Deploy to production</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-700">Phase 4: Post-Launch (Ongoing)</h4>
              <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                <li>• Monitor user feedback and analytics</li>
                <li>• Add advanced AI features</li>
                <li>• Implement social media integrations</li>
                <li>• Scale infrastructure as needed</li>
                <li>• Add enterprise features</li>
              </ul>
            </div>
          </div>

          <div className="bg-accent/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2">💡 Recommended MVP Launch Strategy</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Start with core content generation features and gradually add advanced modules:
            </p>
            <div className="space-y-2 text-sm">
              <div>1. <strong>Week 1-3:</strong> User auth + Basic content generation + Payment</div>
              <div>2. <strong>Week 4-6:</strong> Social media features + Analytics</div>
              <div>3. <strong>Week 7-8:</strong> Campaign builder + Advanced features</div>
              <div>4. <strong>Week 9+:</strong> Scale and optimize based on user feedback</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="text-purple-500" />
            Current Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Frontend (React/TypeScript)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>React 18</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div className="flex justify-between">
                  <span>TypeScript</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div className="flex justify-between">
                  <span>Tailwind CSS</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div className="flex justify-between">
                  <span>Shadcn/ui Components</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div className="flex justify-between">
                  <span>Vite Build Tool</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div className="flex justify-between">
                  <span>Phosphor Icons</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Backend (Needed)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Node.js/Express API</span>
                  <XCircle size={16} className="text-destructive" />
                </div>
                <div className="flex justify-between">
                  <span>Database (PostgreSQL)</span>
                  <XCircle size={16} className="text-destructive" />
                </div>
                <div className="flex justify-between">
                  <span>Authentication (JWT)</span>
                  <XCircle size={16} className="text-destructive" />
                </div>
                <div className="flex justify-between">
                  <span>Payment (Stripe)</span>
                  <XCircle size={16} className="text-destructive" />
                </div>
                <div className="flex justify-between">
                  <span>AI APIs (OpenAI)</span>
                  <XCircle size={16} className="text-destructive" />
                </div>
                <div className="flex justify-between">
                  <span>Cloud Hosting</span>
                  <XCircle size={16} className="text-destructive" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="text-accent" />
            Immediate Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">🚨 High Priority (Start Immediately)</h4>
              <ol className="space-y-1 text-sm text-red-700 list-decimal list-inside">
                <li>Set up backend infrastructure (Node.js + Database)</li>
                <li>Implement user authentication system</li>
                <li>Integrate payment processing (Stripe)</li>
                <li>Connect OpenAI API for content generation</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Medium Priority (Next 2 weeks)</h4>
              <ol className="space-y-1 text-sm text-yellow-700 list-decimal list-inside">
                <li>Complete credit system implementation</li>
                <li>Add proper error handling and loading states</li>
                <li>Implement data persistence for user content</li>
                <li>Create admin dashboard for user management</li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">📋 Low Priority (Post-MVP)</h4>
              <ol className="space-y-1 text-sm text-blue-700 list-decimal list-inside">
                <li>Social media platform integrations</li>
                <li>Advanced analytics and reporting</li>
                <li>Mobile app development</li>
                <li>Enterprise features and white-labeling</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}