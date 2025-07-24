import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Eye, Lock, UserCheck } from "@phosphor-icons/react"

export function PrivacyPolicy() {
  const lastUpdated = "January 15, 2025"
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Shield size={32} className="text-accent" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Your privacy is important to us. This policy explains how we collect, use, and protect your data.
        </p>
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
      </div>

      <div className="space-y-6">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              NexusOne ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
              This privacy policy describes how we collect, use, store, and share your information when you use our 
              AI-powered marketing automation platform.
            </p>
            <p>
              By using NexusOne, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with this policy, please do not use our services.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="text-accent" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">1. Personal Information</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Account Information:</strong> Name, email address, username, password</p>
                <p><strong>Profile Information:</strong> Company name, industry, job title, phone number</p>
                <p><strong>Billing Information:</strong> Credit card details, billing address, tax information</p>
                <p><strong>Communication Data:</strong> Messages, support tickets, feedback</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">2. Usage Data</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Platform Activity:</strong> Features used, content generated, campaigns created</p>
                <p><strong>Technical Data:</strong> IP address, browser type, device information, operating system</p>
                <p><strong>Analytics Data:</strong> Page views, click-through rates, engagement metrics</p>
                <p><strong>Performance Data:</strong> Campaign results, conversion rates, ROI metrics</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">3. Content Data</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Generated Content:</strong> AI-created text, images, and campaigns</p>
                <p><strong>User Content:</strong> Content you upload, edit, or customize</p>
                <p><strong>Integration Data:</strong> Data from connected social media and marketing platforms</p>
                <p><strong>Templates:</strong> Saved templates and campaign structures</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">4. Cookies and Tracking</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Essential Cookies:</strong> Required for platform functionality and security</p>
                <p><strong>Analytics Cookies:</strong> Help us understand how you use our platform</p>
                <p><strong>Preference Cookies:</strong> Remember your settings and preferences</p>
                <p><strong>Marketing Cookies:</strong> Used to personalize ads and measure campaign effectiveness</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">🎯 Platform Services</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Provide and maintain our AI marketing automation services</li>
                  <li>• Generate personalized content and campaigns</li>
                  <li>• Process payments and manage subscriptions</li>
                  <li>• Provide customer support and technical assistance</li>
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">📊 Improvement and Analytics</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Analyze usage patterns to improve our services</li>
                  <li>• Develop new features and capabilities</li>
                  <li>• Monitor platform performance and security</li>
                  <li>• Conduct research and development</li>
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">📢 Communication</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Send important account and service notifications</li>
                  <li>• Provide customer support responses</li>
                  <li>• Share product updates and new features</li>
                  <li>• Send marketing communications (with consent)</li>
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">⚖️ Legal and Security</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Comply with legal obligations and regulations</li>
                  <li>• Protect against fraud and security threats</li>
                  <li>• Enforce our terms of service</li>
                  <li>• Resolve disputes and investigate issues</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing and Disclosure */}
        <Card>
          <CardHeader>
            <CardTitle>Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We do not sell your personal information. We may share your data in the following circumstances:</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <p className="text-sm text-muted-foreground">
                  We work with trusted third-party providers for payment processing, cloud hosting, 
                  analytics, and customer support. These providers are bound by confidentiality agreements.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">AI and Platform Integrations</h4>
                <p className="text-sm text-muted-foreground">
                  Content you generate may be processed by AI providers (OpenAI, Anthropic) and 
                  social media platforms you connect to our service.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p className="text-sm text-muted-foreground">
                  We may disclose information if required by law, court order, or to protect our 
                  rights, property, or safety.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Business Transfers</h4>
                <p className="text-sm text-muted-foreground">
                  In the event of a merger, acquisition, or sale, your information may be transferred 
                  to the new entity with appropriate notice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="text-accent" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement industry-standard security measures to protect your personal information:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded">
                  <h5 className="font-medium">🔐 Encryption</h5>
                  <p className="text-sm text-muted-foreground">
                    All data is encrypted in transit and at rest using AES-256 encryption
                  </p>
                </div>
                
                <div className="p-3 bg-muted rounded">
                  <h5 className="font-medium">🛡️ Access Controls</h5>
                  <p className="text-sm text-muted-foreground">
                    Strict access controls and authentication requirements for all systems
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded">
                  <h5 className="font-medium">🔍 Monitoring</h5>
                  <p className="text-sm text-muted-foreground">
                    24/7 security monitoring and threat detection systems
                  </p>
                </div>
                
                <div className="p-3 bg-muted rounded">
                  <h5 className="font-medium">🏢 Compliance</h5>
                  <p className="text-sm text-muted-foreground">
                    SOC 2 Type II compliance and regular security audits
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="text-accent" />
              Your Rights and Choices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have the following rights regarding your personal data:</p>
            
            <div className="grid gap-3">
              <div className="flex gap-3 p-3 bg-muted rounded">
                <div className="w-6 h-6 bg-accent text-accent-foreground rounded text-xs flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <h5 className="font-medium">Access</h5>
                  <p className="text-sm text-muted-foreground">
                    Request a copy of the personal data we hold about you
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 p-3 bg-muted rounded">
                <div className="w-6 h-6 bg-accent text-accent-foreground rounded text-xs flex items-center justify-center font-bold">
                  U
                </div>
                <div>
                  <h5 className="font-medium">Update</h5>
                  <p className="text-sm text-muted-foreground">
                    Correct or update your personal information through your account settings
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 p-3 bg-muted rounded">
                <div className="w-6 h-6 bg-accent text-accent-foreground rounded text-xs flex items-center justify-center font-bold">
                  D
                </div>
                <div>
                  <h5 className="font-medium">Delete</h5>
                  <p className="text-sm text-muted-foreground">
                    Request deletion of your personal data (subject to legal requirements)
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 p-3 bg-muted rounded">
                <div className="w-6 h-6 bg-accent text-accent-foreground rounded text-xs flex items-center justify-center font-bold">
                  P
                </div>
                <div>
                  <h5 className="font-medium">Portability</h5>
                  <p className="text-sm text-muted-foreground">
                    Export your data in a machine-readable format
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 p-3 bg-muted rounded">
                <div className="w-6 h-6 bg-accent text-accent-foreground rounded text-xs flex items-center justify-center font-bold">
                  O
                </div>
                <div>
                  <h5 className="font-medium">Opt-out</h5>
                  <p className="text-sm text-muted-foreground">
                    Unsubscribe from marketing communications at any time
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-accent/10 rounded-lg">
              <p className="text-sm">
                <strong>To exercise your rights:</strong> Contact us at privacy@nexusone.app or through your account settings. 
                We will respond within 30 days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card>
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place:
            </p>
            
            <ul className="space-y-2 text-sm">
              <li>• <strong>Adequacy Decisions:</strong> Transfers to countries with adequate data protection laws</li>
              <li>• <strong>Standard Contractual Clauses:</strong> EU-approved contract terms for international transfers</li>
              <li>• <strong>Privacy Shield:</strong> Compliance with US-EU Privacy Shield framework where applicable</li>
              <li>• <strong>Binding Corporate Rules:</strong> Internal policies ensuring consistent protection</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We retain your information for as long as necessary to provide our services and comply with legal obligations:</p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="font-medium">Account Data</span>
                <span className="text-sm text-muted-foreground">Until account deletion + 30 days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="font-medium">Generated Content</span>
                <span className="text-sm text-muted-foreground">Until deletion by user or account closure</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="font-medium">Usage Analytics</span>
                <span className="text-sm text-muted-foreground">24 months after collection</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="font-medium">Financial Records</span>
                <span className="text-sm text-muted-foreground">7 years (legal requirement)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              NexusOne is not intended for use by children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you become aware that a child has provided us with 
              personal information, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting 
              the new policy on this page and updating the "Last updated" date. For significant changes, we will 
              provide additional notice through email or prominent notice on our platform.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>If you have questions about this privacy policy or our data practices, contact us:</p>
            
            <div className="space-y-2 text-sm">
              <div><strong>Email:</strong> privacy@nexusone.app</div>
              <div><strong>Address:</strong> NexusOne Privacy Team, 123 AI Street, San Francisco, CA 94105</div>
              <div><strong>Data Protection Officer:</strong> dpo@nexusone.app</div>
              <div><strong>EU Representative:</strong> eu-rep@nexusone.app</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}