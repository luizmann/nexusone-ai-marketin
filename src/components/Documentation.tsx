import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Code, Zap, Shield, CreditCard, Users } from "@phosphor-icons/react"

export function Documentation() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <BookOpen size={32} className="text-accent" />
          <h1 className="text-3xl font-bold">NexusOne Documentation</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Complete guide to using the most powerful AI marketing automation platform
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="text-accent" />
                What is NexusOne?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                NexusOne is a comprehensive AI-powered marketing automation platform that integrates 
                content generation, social media management, campaign building, and analytics into 
                one unified system.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• AI Content Generation</li>
                    <li>• Social Media Automation</li>
                    <li>• Campaign Management</li>
                    <li>• Advanced Analytics</li>
                    <li>• Multi-platform Integration</li>
                    <li>• Credit-based System</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Supported Platforms:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Facebook & Instagram</li>
                    <li>• Twitter / X</li>
                    <li>• LinkedIn</li>
                    <li>• TikTok</li>
                    <li>• YouTube</li>
                    <li>• WhatsApp Business</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex gap-4 p-4 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Create Your Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Sign up and choose your plan. Start with our Free tier to explore features.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Connect Your Platforms</h4>
                    <p className="text-sm text-muted-foreground">
                      Link your social media accounts and marketing tools through our integrations panel.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Start Creating</h4>
                    <p className="text-sm text-muted-foreground">
                      Use our AI modules to generate content, build campaigns, and automate your marketing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Content Generator</CardTitle>
                <Badge variant="outline">5 Credits per use</Badge>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Generate high-quality marketing content with advanced AI models.</p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Blog posts and articles</li>
                    <li>• Email marketing copy</li>
                    <li>• Product descriptions</li>
                    <li>• Ad copy variations</li>
                    <li>• SEO-optimized content</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media Generator</CardTitle>
                <Badge variant="outline">3 Credits per post</Badge>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Create engaging social media content for all major platforms.</p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Platform-specific optimization</li>
                    <li>• Hashtag suggestions</li>
                    <li>• Image generation</li>
                    <li>• Post scheduling</li>
                    <li>• Engagement analytics</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Builder</CardTitle>
                <Badge variant="outline">10 Credits per campaign</Badge>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Build comprehensive marketing campaigns across multiple channels.</p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Multi-channel campaigns</li>
                    <li>• Automated sequences</li>
                    <li>• A/B testing</li>
                    <li>• Performance tracking</li>
                    <li>• ROI optimization</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <Badge variant="outline">Included</Badge>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Track performance across all your marketing activities.</p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Real-time metrics</li>
                    <li>• Custom reports</li>
                    <li>• ROI calculations</li>
                    <li>• Conversion tracking</li>
                    <li>• Export capabilities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Credits Tab */}
        <TabsContent value="credits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-accent" />
                Credit System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                NexusOne uses a credit-based system to ensure fair usage and provide 
                transparent pricing for AI-powered features.
              </p>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-semibold">How Credits Work:</h4>
                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>AI Content Generation</span>
                    <Badge>5 Credits</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Social Media Post</span>
                    <Badge>3 Credits</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Campaign Creation</span>
                    <Badge>10 Credits</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Image Generation</span>
                    <Badge>2 Credits</Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-semibold">Credit Packages:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Free Plan: 50 credits/month</li>
                  <li>• Pro Plan: 500 credits/month</li>
                  <li>• Premium Plan: 2000 credits/month</li>
                  <li>• Additional credits available for purchase</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="text-accent" />
                API Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                NexusOne provides a RESTful API for developers to integrate our 
                AI marketing capabilities into their own applications.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Authentication</h4>
                  <div className="bg-muted p-4 rounded font-mono text-sm">
                    <div>Authorization: Bearer YOUR_API_KEY</div>
                    <div>Content-Type: application/json</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Base URL</h4>
                  <div className="bg-muted p-4 rounded font-mono text-sm">
                    https://api.nexusone.app/v1
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Example: Generate Content</h4>
                  <div className="bg-muted p-4 rounded font-mono text-sm">
                    <div>POST /content/generate</div>
                    <div className="mt-2">
                      {JSON.stringify({
                        "type": "blog_post",
                        "topic": "AI Marketing Trends",
                        "tone": "professional",
                        "length": "medium"
                      }, null, 2)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Social Media Platforms</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Facebook Pages & Ads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Instagram Business</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Twitter / X</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">LinkedIn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">TikTok (Coming Soon)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Marketing Tools</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Google Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Mailchimp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">HubSpot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Zapier</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Salesforce (Coming Soon)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="text-accent" />
                Support & Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Get Help</h4>
                  <div className="space-y-2 text-sm">
                    <div>📧 Email: support@nexusone.app</div>
                    <div>💬 Live Chat: Available 24/7</div>
                    <div>📱 WhatsApp: +1 (555) 123-4567</div>
                    <div>🎥 Video Tutorials: youtube.com/nexusone</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Response Times</h4>
                  <div className="space-y-2 text-sm">
                    <div>Free Plan: 48 hours</div>
                    <div>Pro Plan: 24 hours</div>
                    <div>Premium Plan: 4 hours</div>
                    <div>Critical Issues: 1 hour</div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-3">Learning Resources</h4>
                <div className="grid gap-3">
                  <div className="p-3 bg-muted rounded">
                    <h5 className="font-medium">Quick Start Guide</h5>
                    <p className="text-sm text-muted-foreground">
                      Get up and running in under 10 minutes
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <h5 className="font-medium">Video Academy</h5>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step tutorials for all features
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <h5 className="font-medium">Best Practices</h5>
                    <p className="text-sm text-muted-foreground">
                      Tips and tricks from marketing experts
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <h5 className="font-medium">Community Forum</h5>
                    <p className="text-sm text-muted-foreground">
                      Connect with other NexusOne users
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}