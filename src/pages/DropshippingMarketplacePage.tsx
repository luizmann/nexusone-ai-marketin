import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { CJDropshippingBrowser } from '../components/dropshipping/CJDropshippingBrowser'
import { ProductCatalogBrowser } from '../components/dropshipping/ProductCatalogBrowser'
import { Package, ShoppingCart, TrendingUp, Users, DollarSign, Star, Zap, Globe, Truck } from '@phosphor-icons/react'
import { useLanguage } from '../contexts/LanguageContext'

export function DropshippingMarketplacePage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('browse')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('dropshipping.marketplace')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('dropshipping.marketplaceDescription')}
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Globe className="mr-1 h-4 w-4" />
          CJ Dropshipping
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dropshipping.availableProducts')}</p>
                <p className="text-2xl font-bold">1M+</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dropshipping.avgCommission')}</p>
                <p className="text-2xl font-bold">30%</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dropshipping.globalShipping')}</p>
                <p className="text-2xl font-bold">200+</p>
              </div>
              <Truck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dropshipping.qualityRating')}</p>
                <p className="text-2xl font-bold">4.8★</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            {t('dropshipping.automatedWorkflow')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">{t('dropshipping.step1')}</h3>
              <p className="text-sm text-muted-foreground">{t('dropshipping.step1Description')}</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-1">{t('dropshipping.step2')}</h3>
              <p className="text-sm text-muted-foreground">{t('dropshipping.step2Description')}</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">{t('dropshipping.step3')}</h3>
              <p className="text-sm text-muted-foreground">{t('dropshipping.step3Description')}</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-medium mb-1">{t('dropshipping.step4')}</h3>
              <p className="text-sm text-muted-foreground">{t('dropshipping.step4Description')}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">{t('dropshipping.completeCampaign')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('dropshipping.campaignDescription')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline">{t('dropshipping.landingPage')}</Badge>
              <Badge variant="outline">{t('dropshipping.videoAd')}</Badge>
              <Badge variant="outline">{t('dropshipping.facebookAds')}</Badge>
              <Badge variant="outline">{t('dropshipping.whatsappBot')}</Badge>
              <Badge variant="outline">{t('dropshipping.orderTracking')}</Badge>
              <Badge variant="outline">{t('dropshipping.fulfillment')}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse" className="flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            {t('dropshipping.browseProducts')}
          </TabsTrigger>
          <TabsTrigger value="catalog" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            {t('dropshipping.myCatalog')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <CJDropshippingBrowser />
        </TabsContent>

        <TabsContent value="catalog" className="space-y-6">
          <ProductCatalogBrowser />
        </TabsContent>
      </Tabs>

      {/* Success Stories */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dropshipping.successStories')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium mb-2">{t('dropshipping.story1Title')}</h3>
              <p className="text-sm text-muted-foreground mb-2">{t('dropshipping.story1Description')}</p>
              <div className="flex justify-center items-center gap-2">
                <Badge variant="default">$15K/month</Badge>
                <Badge variant="outline">6 months</Badge>
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">{t('dropshipping.story2Title')}</h3>
              <p className="text-sm text-muted-foreground mb-2">{t('dropshipping.story2Description')}</p>
              <div className="flex justify-center items-center gap-2">
                <Badge variant="default">$8K/month</Badge>
                <Badge variant="outline">3 months</Badge>
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-medium mb-2">{t('dropshipping.story3Title')}</h3>
              <p className="text-sm text-muted-foreground mb-2">{t('dropshipping.story3Description')}</p>
              <div className="flex justify-center items-center gap-2">
                <Badge variant="default">$25K/month</Badge>
                <Badge variant="outline">12 months</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dropshipping.gettingStarted')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-medium">{t('dropshipping.guide1Title')}</h3>
                <p className="text-sm text-muted-foreground">{t('dropshipping.guide1Description')}</p>
                <Progress value={100} className="w-32 mt-2" />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-medium">{t('dropshipping.guide2Title')}</h3>
                <p className="text-sm text-muted-foreground">{t('dropshipping.guide2Description')}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  {t('dropshipping.startBrowsing')}
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-medium">{t('dropshipping.guide3Title')}</h3>
                <p className="text-sm text-muted-foreground">{t('dropshipping.guide3Description')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <h3 className="font-medium">{t('dropshipping.guide4Title')}</h3>
                <p className="text-sm text-muted-foreground">{t('dropshipping.guide4Description')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DropshippingMarketplacePage