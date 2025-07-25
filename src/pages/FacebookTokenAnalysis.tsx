import React from 'react';
import { FacebookTokenAnalyzer } from '@/components/FacebookTokenAnalyzer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Facebook } from '@phosphor-icons/react';

export function FacebookTokenAnalysisPage() {
  // Your provided Facebook access token
  const providedToken = "EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD";

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Facebook className="h-8 w-8 text-blue-600" />
              Facebook API Token Analysis
            </CardTitle>
            <CardDescription className="text-lg">
              Analyzing your Facebook access token for NexusOne marketing automation integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Facebook Marketing API</Badge>
              <Badge variant="secondary">Ad Campaign Automation</Badge>
              <Badge variant="secondary">Dropshipping Integration</Badge>
              <Badge variant="secondary">Performance Analytics</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Token Information */}
        <Card>
          <CardHeader>
            <CardTitle>Provided Token Information</CardTitle>
            <CardDescription>
              Analysis of the Facebook access token you provided
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Token Pattern Analysis:</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span>EAA* (Facebook App Access Token Pattern)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Length:</span>
                  <span>{providedToken.length} characters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>Appears to be a valid Facebook API token format</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">What this analysis will check:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Token validity and expiration</li>
                <li>• Available permissions and scopes</li>
                <li>• Connected Facebook ad accounts</li>
                <li>• Accessible Facebook pages</li>
                <li>• Marketing API capabilities</li>
                <li>• Dropshipping automation readiness</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Token Analyzer Component */}
        <FacebookTokenAnalyzer defaultToken={providedToken} />

        {/* Integration Guide */}
        <Card>
          <CardHeader>
            <CardTitle>NexusOne Facebook Integration</CardTitle>
            <CardDescription>
              How this token will be used in your marketing automation platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">Automated Campaign Creation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Generate Facebook ads for dropshipping products</li>
                  <li>• Create targeted audience segments</li>
                  <li>• Upload product images and videos</li>
                  <li>• Set up conversion tracking</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Performance Monitoring</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time campaign analytics</li>
                  <li>• ROAS and ROI tracking</li>
                  <li>• Automated bid optimization</li>
                  <li>• Conversion funnel analysis</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Expected Integration Benefits:</h4>
              <div className="grid gap-2 md:grid-cols-2 text-sm text-green-800 dark:text-green-200">
                <div>✅ Automated dropshipping campaigns</div>
                <div>✅ Multi-language ad creation</div>
                <div>✅ AI-powered audience targeting</div>
                <div>✅ Real-time performance optimization</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}