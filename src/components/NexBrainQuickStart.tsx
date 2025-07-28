import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, ArrowRight, Play, CheckCircle } from 'lucide-react'

export function NexBrainQuickStart() {
  const quickStartSteps = [
    {
      step: 1,
      title: 'Configure OpenAI API',
      description: 'Add your OpenAI API key in Admin Dashboard',
      status: 'required',
      action: 'Go to Admin → API Configuration'
    },
    {
      step: 2,
      title: 'Choose Your Use Case',
      description: 'Select what you want to create first',
      status: 'next',
      action: 'Magic Pages, Facebook Ads, or WhatsApp Flow'
    },
    {
      step: 3,
      title: 'Let NexBrain Work',
      description: 'AI generates professional content in seconds',
      status: 'automated',
      action: 'Review and customize the output'
    },
    {
      step: 4,
      title: 'Launch & Optimize',
      description: 'Deploy your campaigns and track performance',
      status: 'ongoing',
      action: 'Monitor results and optimize with AI insights'
    }
  ]

  const popularStartingPoints = [
    {
      name: 'Magic Page Generator',
      description: 'Perfect for creating your first sales page',
      difficulty: 'Beginner',
      timeToComplete: '5 minutes',
      icon: '✨'
    },
    {
      name: 'Facebook Ads Campaign',
      description: 'Complete ad campaign with targeting and creatives',
      difficulty: 'Intermediate',
      timeToComplete: '10 minutes',
      icon: '📱'
    },
    {
      name: 'WhatsApp Sales Flow',
      description: 'Automated customer conversation sequences',
      difficulty: 'Advanced',
      timeToComplete: '15 minutes',
      icon: '💬'
    }
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl">Getting Started with NexBrain</h3>
              <p className="text-sm text-muted-foreground font-normal">
                Your AI assistant is ready to revolutionize your marketing
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            NexBrain is now configured and ready to help you create professional marketing content. 
            Follow these steps to get started:
          </p>
          
          <div className="grid gap-4">
            {quickStartSteps.map((step, index) => (
              <div key={step.step} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                  {step.step}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{step.title}</h4>
                    <Badge 
                      variant={
                        step.status === 'required' ? 'destructive' :
                        step.status === 'next' ? 'default' :
                        step.status === 'automated' ? 'secondary' :
                        'outline'
                      }
                      className="text-xs"
                    >
                      {step.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  <p className="text-xs text-primary font-medium">{step.action}</p>
                </div>
                
                {index < quickStartSteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Popular Starting Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {popularStartingPoints.map((option, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{option.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {option.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {option.timeToComplete}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <Button size="sm" variant="outline">
                  Try Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Pro Tips for Success</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Start with simple Magic Pages to learn the system</li>
                <li>• Use specific product details for better AI-generated content</li>
                <li>• Test different AI outputs and customize them to your brand</li>
                <li>• Monitor your credit usage and upgrade plan as needed</li>
                <li>• Use the Advanced Test feature to experiment with custom prompts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}