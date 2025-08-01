import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  ArrowRight, 
  CheckCircle, 
  Copy,
  ExternalLink,
  Sparkles,
  Timer,
  DollarSign
} from '@phosphor-icons/react';

interface DemoExample {
  id: string;
  type: 'amazon' | 'shopify' | 'youtube' | 'social';
  originalUrl: string;
  title: string;
  description: string;
  generatedPage: {
    headline: string;
    subheadline: string;
    price: string;
    features: string[];
    cta: string;
    conversionRate: string;
  };
}

const demoExamples: DemoExample[] = [
  {
    id: 'amazon-headphones',
    type: 'amazon',
    originalUrl: 'https://amazon.com/dp/B08N5WRWNW',
    title: 'Sony WH-1000XM4 Headphones',
    description: 'Amazon product page',
    generatedPage: {
      headline: '🎵 Experience Perfect Sound with Sony WH-1000XM4',
      subheadline: 'Industry-leading noise cancellation meets premium comfort for the ultimate audio experience',
      price: '$279.99',
      features: ['30-hour battery life', 'Industry-leading noise cancellation', 'Touch sensor controls', 'Quick charge technology'],
      cta: 'Get Your Premium Headphones Now',
      conversionRate: '23.8%'
    }
  },
  {
    id: 'shopify-protein',
    type: 'shopify',
    originalUrl: 'https://example-store.myshopify.com/products/protein-powder',
    title: 'Organic Superfood Protein',
    description: 'Shopify store product',
    generatedPage: {
      headline: '💪 Transform Your Fitness with Organic Superfood Protein',
      subheadline: 'Plant-based protein that tastes amazing and delivers real results',
      price: '$49.99',
      features: ['100% organic ingredients', '25g protein per serving', 'No artificial sweeteners', 'Vegan and gluten-free'],
      cta: 'Start Your Transformation Today',
      conversionRate: '31.2%'
    }
  },
  {
    id: 'youtube-course',
    type: 'youtube',
    originalUrl: 'https://youtube.com/watch?v=example',
    title: 'Digital Marketing Masterclass',
    description: 'YouTube video content',
    generatedPage: {
      headline: '🚀 Master Digital Marketing in 30 Days',
      subheadline: 'Learn the exact strategies used by 7-figure businesses to dominate online',
      price: '$197',
      features: ['12 hours of video content', 'Step-by-step action plans', 'Private community access', '30-day money-back guarantee'],
      cta: 'Join the Masterclass Now',
      conversionRate: '18.5%'
    }
  }
];

export function URLSalesPageDemo() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const runDemo = async (demoId: string) => {
    setActiveDemo(demoId);
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
  };

  const resetDemo = () => {
    setActiveDemo(null);
    setIsGenerating(false);
  };

  const activeDemoData = demoExamples.find(demo => demo.id === activeDemo);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          🚀 URL to Sales Page Demo
        </h2>
        <p className="text-muted-foreground text-lg">
          Watch how any URL transforms into a high-converting sales page in seconds
        </p>
      </div>

      {!activeDemo ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoExamples.map((demo) => (
            <Card key={demo.id} className="cursor-pointer hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {demo.type}
                  </Badge>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">{demo.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{demo.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-muted p-2 rounded text-xs font-mono truncate">
                    {demo.originalUrl}
                  </div>
                  <Button 
                    onClick={() => runDemo(demo.id)}
                    className="w-full gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Run Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Processing Animation */}
          {isGenerating && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <h3 className="text-xl font-semibold">🤖 AI is analyzing your URL...</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Extracting product information</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Analyzing target audience</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating high-converting copy...</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Result */}
          {!isGenerating && activeDemoData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Before */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Copy className="h-5 w-5" />
                    Original URL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted p-3 rounded">
                      <code className="text-sm">{activeDemoData.originalUrl}</code>
                    </div>
                    <div>
                      <p className="font-medium">{activeDemoData.title}</p>
                      <p className="text-sm text-muted-foreground">{activeDemoData.description}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {activeDemoData.type} Product
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* After */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generated Sales Page
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">{activeDemoData.generatedPage.headline}</h3>
                      <p className="text-muted-foreground">{activeDemoData.generatedPage.subheadline}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-green-600">{activeDemoData.generatedPage.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-600">Generated in 2.3 seconds</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Features:</h4>
                      <ul className="text-sm space-y-1">
                        {activeDemoData.generatedPage.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full">
                      {activeDemoData.generatedPage.cta}
                    </Button>

                    <div className="text-center">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Projected Conversion Rate: {activeDemoData.generatedPage.conversionRate}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetDemo}>
              Try Another Demo
            </Button>
            <Button>
              Start Creating Your Own
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}