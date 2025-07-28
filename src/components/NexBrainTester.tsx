import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Brain, MessageSquare, Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { nexBrainService } from '../services/nexBrainService'
import { toast } from 'sonner'

interface TestResult {
  id: string
  prompt: string
  response: string
  status: 'success' | 'error'
  timestamp: Date
  duration: number
}

export function NexBrainTester() {
  const [customPrompt, setCustomPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])

  const predefinedTests = [
    {
      id: 'magic-page',
      name: 'Magic Page Generator',
      prompt: 'Create a sales page for a wireless bluetooth earbuds product with these details: name: "AirPro Max", price: $79.99, features: noise cancellation, 24h battery, waterproof. Generate compelling copy with headline, benefits, and CTA.',
      icon: Zap
    },
    {
      id: 'ads-campaign',
      name: 'Facebook Ads Campaign',
      prompt: 'Generate a Facebook ads campaign for a fitness tracker targeting health-conscious millennials with a $500 budget. Include ad copy variations, targeting suggestions, and creative concepts.',
      icon: MessageSquare
    },
    {
      id: 'whatsapp-flow',
      name: 'WhatsApp Sales Flow',
      prompt: 'Create a WhatsApp sales conversation flow for an online course about digital marketing. Include welcome message, objection handling, urgency tactics, and payment flow.',
      icon: MessageSquare
    }
  ]

  const runTest = async (prompt: string, testName: string = 'Custom Test') => {
    setIsLoading(true)
    const startTime = Date.now()

    try {
      const response = await nexBrainService.executeAssistantTask(prompt, {
        testMode: true,
        testName
      })

      const testResult: TestResult = {
        id: `test_${Date.now()}`,
        prompt,
        response,
        status: 'success',
        timestamp: new Date(),
        duration: Date.now() - startTime
      }

      setTestResults(prev => [testResult, ...prev.slice(0, 4)]) // Keep last 5 results
      toast.success(`${testName} completed successfully`)

    } catch (error) {
      const testResult: TestResult = {
        id: `test_${Date.now()}`,
        prompt,
        response: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        timestamp: new Date(),
        duration: Date.now() - startTime
      }

      setTestResults(prev => [testResult, ...prev.slice(0, 4)])
      toast.error(`${testName} failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const runCustomTest = () => {
    if (!customPrompt.trim()) {
      toast.error('Please enter a test prompt')
      return
    }
    runTest(customPrompt, 'Custom Test')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            NexBrain AI Assistant Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Predefined Tests */}
          <div>
            <h3 className="font-medium mb-3">Quick Function Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {predefinedTests.map((test) => (
                <Button
                  key={test.id}
                  variant="outline"
                  className="flex items-center gap-2 h-auto p-4 text-left"
                  onClick={() => runTest(test.prompt, test.name)}
                  disabled={isLoading}
                >
                  <test.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{test.name}</div>
                    <div className="text-xs text-muted-foreground">Test {test.id}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Test */}
          <div>
            <h3 className="font-medium mb-3">Custom Test</h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Enter your custom prompt to test NexBrain capabilities..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={runCustomTest} 
                disabled={isLoading || !customPrompt.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing NexBrain...
                  </>
                ) : (
                  'Run Custom Test'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {testResults.map((result) => (
              <div key={result.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <Badge variant={result.status === 'success' ? 'secondary' : 'destructive'}>
                      {result.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.timestamp.toLocaleTimeString()} • {result.duration}ms
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Prompt:</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {result.prompt.length > 150 
                      ? `${result.prompt.substring(0, 150)}...` 
                      : result.prompt
                    }
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Response:</h4>
                  <div className="text-sm bg-muted p-2 rounded max-h-32 overflow-y-auto">
                    {result.status === 'success' ? (
                      <pre className="whitespace-pre-wrap">{result.response}</pre>
                    ) : (
                      <span className="text-red-600">{result.response}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}