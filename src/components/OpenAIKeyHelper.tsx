import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Key, Info, CheckCircle } from 'lucide-react'

export function OpenAIKeyHelper() {
  const steps = [
    {
      step: 1,
      title: 'Visit OpenAI Platform',
      description: 'Go to platform.openai.com and sign in to your account',
      action: 'https://platform.openai.com'
    },
    {
      step: 2,
      title: 'Navigate to API Keys',
      description: 'Click on "API Keys" in the left sidebar or your profile menu',
      action: null
    },
    {
      step: 3,
      title: 'Create New Key',
      description: 'Click "Create new secret key" and give it a name like "NexusOne"',
      action: null
    },
    {
      step: 4,
      title: 'Copy Your Key',
      description: 'Copy the generated key (starts with sk-proj-...) and paste it above',
      action: null
    }
  ]

  const requirements = [
    { item: 'OpenAI account with API access', status: 'required' },
    { item: 'Payment method added to OpenAI', status: 'required' },
    { item: 'GPT-4 API access (usually automatic)', status: 'recommended' },
    { item: 'Usage limits configured', status: 'recommended' }
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            How to Get Your OpenAI API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step) => (
              <div key={step.step} className="flex gap-3 p-3 border rounded-lg">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  {step.action && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={step.action} target="_blank" rel="noopener noreferrer">
                        Open <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Requirements Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{req.item}</span>
                <Badge variant={req.status === 'required' ? 'destructive' : 'secondary'}>
                  {req.status}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Important Notes:</p>
                <ul className="text-amber-700 mt-1 space-y-1">
                  <li>• API usage will be charged to your OpenAI account</li>
                  <li>• Set usage limits to control costs</li>
                  <li>• Keep your API key secure and never share it</li>
                  <li>• NexBrain uses GPT-4o model for best results</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}