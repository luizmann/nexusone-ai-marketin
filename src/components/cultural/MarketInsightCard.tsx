import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  Heart,
  Globe,
  ShoppingCart
} from 'lucide-react';

interface MarketInsightCardProps {
  marketCode: string;
  marketData: {
    name: string;
    language: string;
    culturalNotes: string;
    marketingStyle: string;
    buyingBehavior: string;
    preferredTone: string;
    holidays: string[];
    workingHours: string;
    currency: string;
    demographics: string;
  };
}

export default function MarketInsightCard({ marketCode, marketData }: MarketInsightCardProps) {
  const getMarketMetrics = (marketCode: string) => {
    // Mock market metrics - in real app would come from analytics
    const metrics = {
      'en-US': { internetPenetration: 95, ecommerceGrowth: 78, avgOrderValue: 120, competition: 85 },
      'es-ES': { internetPenetration: 88, ecommerceGrowth: 65, avgOrderValue: 95, competition: 70 },
      'es-MX': { internetPenetration: 72, ecommerceGrowth: 89, avgOrderValue: 75, competition: 60 },
      'pt-BR': { internetPenetration: 81, ecommerceGrowth: 92, avgOrderValue: 85, competition: 65 },
      'he-IL': { internetPenetration: 96, ecommerceGrowth: 73, avgOrderValue: 110, competition: 75 },
      'ar-SA': { internetPenetration: 98, ecommerceGrowth: 85, avgOrderValue: 150, competition: 55 },
      'ar-AE': { internetPenetration: 99, ecommerceGrowth: 88, avgOrderValue: 200, competition: 70 }
    };
    
    return metrics[marketCode as keyof typeof metrics] || metrics['en-US'];
  };

  const getMarketOpportunity = (metrics: any) => {
    const score = (metrics.ecommerceGrowth + metrics.internetPenetration - metrics.competition) / 3;
    if (score >= 70) return { level: 'High', color: 'bg-green-500', text: 'text-green-700' };
    if (score >= 50) return { level: 'Medium', color: 'bg-yellow-500', text: 'text-yellow-700' };
    return { level: 'Low', color: 'bg-red-500', text: 'text-red-700' };
  };

  const metrics = getMarketMetrics(marketCode);
  const opportunity = getMarketOpportunity(metrics);
  
  const getCountryFlag = (marketCode: string) => {
    const flags = {
      'en-US': '🇺🇸',
      'es-ES': '🇪🇸',
      'es-MX': '🇲🇽',
      'pt-BR': '🇧🇷',
      'he-IL': '🇮🇱',
      'ar-SA': '🇸🇦',
      'ar-AE': '🇦🇪'
    };
    return flags[marketCode as keyof typeof flags] || '🌍';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCountryFlag(marketCode)}</span>
            <div>
              <div className="font-semibold">{marketData.name}</div>
              <div className="text-sm text-muted-foreground">{marketData.language}</div>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${opportunity.text} border-current`}
          >
            {opportunity.level} Opportunity
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Market Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Market Metrics
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Internet Penetration</span>
              <span className="font-medium">{metrics.internetPenetration}%</span>
            </div>
            <Progress value={metrics.internetPenetration} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>E-commerce Growth</span>
              <span className="font-medium">{metrics.ecommerceGrowth}%</span>
            </div>
            <Progress value={metrics.ecommerceGrowth} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Competition Level</span>
              <span className="font-medium">{metrics.competition}%</span>
            </div>
            <Progress value={metrics.competition} className="h-2" />
          </div>
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Currency</div>
              <div className="font-medium">{marketData.currency}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Avg Order</div>
              <div className="font-medium">${metrics.avgOrderValue}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Work Hours</div>
              <div className="font-medium text-xs">{marketData.workingHours}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Tone</div>
              <div className="font-medium text-xs">{marketData.preferredTone}</div>
            </div>
          </div>
        </div>

        {/* Cultural Notes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Cultural Notes
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {marketData.culturalNotes}
          </p>
        </div>

        {/* Marketing Style */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Marketing Style</h4>
          <p className="text-sm text-muted-foreground">
            {marketData.marketingStyle}
          </p>
        </div>

        {/* Holidays */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Key Holidays
          </h4>
          <div className="flex flex-wrap gap-1">
            {marketData.holidays.slice(0, 4).map((holiday) => (
              <Badge key={holiday} variant="secondary" className="text-xs">
                {holiday}
              </Badge>
            ))}
            {marketData.holidays.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{marketData.holidays.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Demographics */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            Demographics
          </h4>
          <p className="text-sm text-muted-foreground">
            {marketData.demographics}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}