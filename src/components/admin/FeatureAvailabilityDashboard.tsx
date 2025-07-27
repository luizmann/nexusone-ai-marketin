import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Lightbulb, Video, MessageCircle, ShoppingCart, Image, SpeakerHigh, CreditCard, Robot } from '@phosphor-icons/react';
import { apiConfigService } from '@/services/apiConfigurationService';
import { useLanguage } from '@/contexts/CleanLanguageContext';

interface FeatureStatus {
  name: string;
  icon: React.ReactNode;
  available: boolean;
  requiredApis: string[];
  description: string;
  priority: 'core' | 'enhanced' | 'premium';
}

export function FeatureAvailabilityDashboard() {
  const { t } = useLanguage();
  const [features, setFeatures] = useState<FeatureStatus[]>([]);
  const [availability, setAvailability] = useState<any>(null);

  useEffect(() => {
    loadFeatureAvailability();
  }, []);

  const loadFeatureAvailability = () => {
    const featureAvailability = apiConfigService.getFeatureAvailability();
    setAvailability(featureAvailability);

    const featureList: FeatureStatus[] = [
      // Core Features
      {
        name: 'Magic Pages (Landing Pages)',
        icon: <Lightbulb className="w-5 h-5" />,
        available: featureAvailability.magicPages,
        requiredApis: ['OpenAI GPT-4'],
        description: 'AI-generated landing pages with drag & drop editing',
        priority: 'core'
      },
      {
        name: 'Campaign Generator',
        icon: <Robot className="w-5 h-5" />,
        available: featureAvailability.campaignGenerator,
        requiredApis: ['OpenAI GPT-4', 'Replicate Images'],
        description: 'Complete marketing campaigns with AI-generated content',
        priority: 'core'
      },
      {
        name: 'Image Generation',
        icon: <Image className="w-5 h-5" />,
        available: featureAvailability.imageGeneration,
        requiredApis: ['Replicate API'],
        description: 'AI-generated images for campaigns and content',
        priority: 'core'
      },
      {
        name: 'Stock Images',
        icon: <Image className="w-5 h-5" />,
        available: featureAvailability.stockImages,
        requiredApis: ['Unsplash API'],
        description: 'Access to millions of professional stock photos',
        priority: 'core'
      },

      // Enhanced Features
      {
        name: 'Video Creator',
        icon: <Video className="w-5 h-5" />,
        available: featureAvailability.videoCreator,
        requiredApis: ['Luma AI', 'ElevenLabs TTS'],
        description: 'AI-generated videos with voiceovers and animations',
        priority: 'enhanced'
      },
      {
        name: 'WhatsApp Automation',
        icon: <MessageCircle className="w-5 h-5" />,
        available: featureAvailability.whatsappAutomation,
        requiredApis: ['Gupshup WhatsApp'],
        description: 'Automated WhatsApp messaging and chatbots',
        priority: 'enhanced'
      },
      {
        name: 'Facebook Ads',
        icon: <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">f</div>,
        available: featureAvailability.facebookAds,
        requiredApis: ['Facebook Marketing API'],
        description: 'Automated Facebook advertising campaigns',
        priority: 'enhanced'
      },
      {
        name: 'Dropshipping',
        icon: <ShoppingCart className="w-5 h-5" />,
        available: featureAvailability.dropshipping,
        requiredApis: ['CJ Dropshipping API'],
        description: 'Product sourcing and automated fulfillment',
        priority: 'enhanced'
      },
      {
        name: 'Text-to-Speech',
        icon: <SpeakerHigh className="w-5 h-5" />,
        available: featureAvailability.textToSpeech,
        requiredApis: ['ElevenLabs TTS'],
        description: 'High-quality voice synthesis for content',
        priority: 'enhanced'
      },

      // Premium Features
      {
        name: 'Payment Processing',
        icon: <CreditCard className="w-5 h-5" />,
        available: featureAvailability.payments,
        requiredApis: ['Stripe Payments'],
        description: 'Secure payment processing and subscriptions',
        priority: 'premium'
      },
      {
        name: 'Advanced Video',
        icon: <Video className="w-5 h-5" />,
        available: featureAvailability.advancedVideo,
        requiredApis: ['D-ID Avatars', 'Runway Video'],
        description: 'AI avatars and advanced video generation',
        priority: 'premium'
      }
    ];

    setFeatures(featureList);
  };

  const getFeaturesByPriority = (priority: 'core' | 'enhanced' | 'premium') => {
    return features.filter(feature => feature.priority === priority);
  };

  const getAvailabilityStats = () => {
    const total = features.length;
    const available = features.filter(f => f.available).length;
    const core = getFeaturesByPriority('core');
    const coreAvailable = core.filter(f => f.available).length;
    
    return {
      total,
      available,
      percentage: Math.round((available / total) * 100),
      core: core.length,
      coreAvailable,
      corePercentage: Math.round((coreAvailable / core.length) * 100)
    };
  };

  const renderFeature = (feature: FeatureStatus) => {
    const statusIcon = feature.available ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> :
      <XCircle className="w-4 h-4 text-red-500" />;

    const statusBadge = feature.available ?
      <Badge variant="default" className="bg-green-100 text-green-800">✅ Available</Badge> :
      <Badge variant="destructive">❌ Unavailable</Badge>;

    return (
      <Card key={feature.name} className={`${feature.available ? 'border-green-200' : 'border-red-200'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {feature.icon}
              <div>
                <CardTitle className="text-base">{feature.name}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {statusIcon}
              {statusBadge}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Required APIs:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {feature.requiredApis.map((api) => (
                  <Badge key={api} variant="outline" className="text-xs">
                    {api}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPrioritySection = (priority: 'core' | 'enhanced' | 'premium', title: string, description: string, color: string) => {
    const priorityFeatures = getFeaturesByPriority(priority);
    const available = priorityFeatures.filter(f => f.available).length;
    const total = priorityFeatures.length;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${color}`}>{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${color}`}>{available}/{total}</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priorityFeatures.map(renderFeature)}
        </div>
      </div>
    );
  };

  if (!features.length) return <div>Loading feature availability...</div>;

  const stats = getAvailabilityStats();

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}/{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.percentage}% available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Core Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.coreAvailable}/{stats.core}</div>
            <p className="text-xs text-muted-foreground">{stats.corePercentage}% core ready</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Launch Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.corePercentage === 100 ? 'text-green-600' : 'text-orange-600'}`}>
              {stats.corePercentage === 100 ? '🚀' : '⚠️'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.corePercentage === 100 ? 'Ready to launch' : 'Setup required'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Launch Readiness */}
      {stats.corePercentage === 100 ? (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            🎉 <strong>All core features are available!</strong> Your platform is ready for launch with full functionality.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-orange-500 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            🔧 <strong>Core setup required:</strong> {stats.core - stats.coreAvailable} core feature(s) need API configuration.
          </AlertDescription>
        </Alert>
      )}

      {/* Core Features */}
      {renderPrioritySection('core', 'Core Features', 'Essential functionality for basic operation', 'text-blue-600')}

      {/* Enhanced Features */}
      {renderPrioritySection('enhanced', 'Enhanced Features', 'Advanced functionality for competitive advantage', 'text-purple-600')}

      {/* Premium Features */}
      {renderPrioritySection('premium', 'Premium Features', 'Advanced monetization and professional features', 'text-amber-600')}
    </div>
  );
}