import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  Eye, 
  Lock, 
  UserCheck, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Download,
  ExternalLink
} from "@phosphor-icons/react"
import { useLanguage } from '../contexts/CleanLanguageContext'
import { LanguageSelector } from './LanguageSelector'

export function PrivacyPolicy() {
  const { t, isRTL } = useLanguage()
  const lastUpdated = "January 15, 2025"
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-background to-secondary/10 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield size={32} className="text-green-600" />
            <h1 className="text-2xl font-bold">{t('privacy.title')}</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              {t('privacy.subtitle')}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{t('privacy.last_updated')}: {lastUpdated}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Globe size={16} />
                <span>{t('privacy.available_languages')}: 5</span>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                {t('privacy.download_pdf')}
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink size={16} className="mr-2" />
                {t('privacy.gdpr_rights')}
              </Button>
            </div>
          </div>

          {/* Key Highlights */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <UserCheck size={24} />
                {t('privacy.key_highlights')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('privacy.highlight_1')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('privacy.highlight_2')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('privacy.highlight_3')}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('privacy.highlight_4')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('privacy.highlight_5')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t('privacy.highlight_6')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.introduction')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('privacy.intro_text_1')}
              </p>
              <p>
                {t('privacy.intro_text_2')}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>{t('privacy.important_note')}:</strong> {t('privacy.intro_important')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="text-blue-500" />
                {t('privacy.info_we_collect')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('privacy.account_info')}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground pl-4">
                    <li>• {t('privacy.account_info_1')}</li>
                    <li>• {t('privacy.account_info_2')}</li>
                    <li>• {t('privacy.account_info_3')}</li>
                    <li>• {t('privacy.account_info_4')}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">{t('privacy.usage_data')}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground pl-4">
                    <li>• {t('privacy.usage_data_1')}</li>
                    <li>• {t('privacy.usage_data_2')}</li>
                    <li>• {t('privacy.usage_data_3')}</li>
                    <li>• {t('privacy.usage_data_4')}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">{t('privacy.content_data')}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground pl-4">
                    <li>• {t('privacy.content_data_1')}</li>
                    <li>• {t('privacy.content_data_2')}</li>
                    <li>• {t('privacy.content_data_3')}</li>
                    <li>• {t('privacy.content_data_4')}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="text-purple-500" />
                {t('privacy.how_we_use')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">{t('privacy.service_provision')}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {t('privacy.service_provision_1')}</li>
                    <li>• {t('privacy.service_provision_2')}</li>
                    <li>• {t('privacy.service_provision_3')}</li>
                    <li>• {t('privacy.service_provision_4')}</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">{t('privacy.communication')}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {t('privacy.communication_1')}</li>
                    <li>• {t('privacy.communication_2')}</li>
                    <li>• {t('privacy.communication_3')}</li>
                    <li>• {t('privacy.communication_4')}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-green-500" />
                {t('privacy.data_security')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t('privacy.security_intro')}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">{t('privacy.technical_measures')}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {t('privacy.technical_measures_1')}</li>
                    <li>• {t('privacy.technical_measures_2')}</li>
                    <li>• {t('privacy.technical_measures_3')}</li>
                    <li>• {t('privacy.technical_measures_4')}</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">{t('privacy.organizational_measures')}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {t('privacy.organizational_measures_1')}</li>
                    <li>• {t('privacy.organizational_measures_2')}</li>
                    <li>• {t('privacy.organizational_measures_3')}</li>
                    <li>• {t('privacy.organizational_measures_4')}</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={20} className="text-green-600" />
                  <h5 className="font-semibold text-green-800">{t('privacy.compliance_certifications')}</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-green-700 border-green-300">GDPR Compliant</Badge>
                  <Badge variant="outline" className="text-green-700 border-green-300">CCPA Compliant</Badge>
                  <Badge variant="outline" className="text-green-700 border-green-300">SOC 2 Type II</Badge>
                  <Badge variant="outline" className="text-green-700 border-green-300">ISO 27001</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing and Third Parties */}
          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.data_sharing')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t('privacy.sharing_intro')}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('privacy.service_providers')}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{t('privacy.service_providers_desc')}</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="text-sm">
                      <strong>{t('privacy.ai_providers')}:</strong>
                      <span className="text-muted-foreground"> OpenAI, D-ID, ElevenLabs</span>
                    </div>
                    <div className="text-sm">
                      <strong>{t('privacy.payment_processors')}:</strong>
                      <span className="text-muted-foreground"> Stripe, PayPal</span>
                    </div>
                    <div className="text-sm">
                      <strong>{t('privacy.analytics')}:</strong>
                      <span className="text-muted-foreground"> Google Analytics, Mixpanel</span>
                    </div>
                    <div className="text-sm">
                      <strong>{t('privacy.infrastructure')}:</strong>
                      <span className="text-muted-foreground"> Supabase, Vercel</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">{t('privacy.legal_requirements')}</h4>
                  <p className="text-sm text-muted-foreground">{t('privacy.legal_requirements_desc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="text-orange-500" />
                {t('privacy.your_rights')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t('privacy.rights_intro')}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">{t('privacy.access_rights')}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {t('privacy.access_rights_1')}</li>
                    <li>• {t('privacy.access_rights_2')}</li>
                    <li>• {t('privacy.access_rights_3')}</li>
                    <li>• {t('privacy.access_rights_4')}</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">{t('privacy.control_rights')}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {t('privacy.control_rights_1')}</li>
                    <li>• {t('privacy.control_rights_2')}</li>
                    <li>• {t('privacy.control_rights_3')}</li>
                    <li>• {t('privacy.control_rights_4')}</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h5 className="font-semibold text-orange-800 mb-2">{t('privacy.exercise_rights')}</h5>
                <p className="text-sm text-orange-700 mb-3">{t('privacy.exercise_rights_desc')}</p>
                <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  <Mail size={16} className="mr-2" />
                  {t('privacy.contact_privacy_team')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.data_retention')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t('privacy.retention_intro')}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{t('privacy.account_data')}</span>
                  <span className="text-sm text-muted-foreground">{t('privacy.account_data_retention')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{t('privacy.usage_analytics')}</span>
                  <span className="text-sm text-muted-foreground">{t('privacy.usage_analytics_retention')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{t('privacy.generated_content')}</span>
                  <span className="text-sm text-muted-foreground">{t('privacy.generated_content_retention')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{t('privacy.marketing_data')}</span>
                  <span className="text-sm text-muted-foreground">{t('privacy.marketing_data_retention')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="text-blue-500" />
                {t('privacy.international_transfers')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t('privacy.transfers_intro')}</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-2">🇺🇸</div>
                  <div className="font-semibold">{t('privacy.usa_servers')}</div>
                  <div className="text-sm text-muted-foreground">{t('privacy.primary_hosting')}</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-2">🇪🇺</div>
                  <div className="font-semibold">{t('privacy.eu_servers')}</div>
                  <div className="text-sm text-muted-foreground">{t('privacy.gdpr_compliance')}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="font-semibold">{t('privacy.safeguards')}</div>
                  <div className="text-sm text-muted-foreground">{t('privacy.adequacy_decisions')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="text-green-500" />
                {t('privacy.contact_info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t('privacy.contact_intro')}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">{t('privacy.data_protection_officer')}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />
                      <span>privacy@nexusone.ai</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span>{t('privacy.address')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">{t('privacy.general_inquiries')}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />
                      <span>support@nexusone.ai</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-muted-foreground" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  {t('privacy.response_time')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.policy_changes')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t('privacy.changes_intro')}</p>
              <p>{t('privacy.notification_method')}</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2">{t('privacy.version_history')}</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>v2.0 - {lastUpdated}</span>
                    <span className="text-blue-600">{t('privacy.current_version')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>v1.5 - December 1, 2024</span>
                    <span className="text-muted-foreground">{t('privacy.gdpr_updates')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>v1.0 - November 1, 2024</span>
                    <span className="text-muted-foreground">{t('privacy.initial_version')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center p-6 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {t('privacy.footer_text')}
              </p>
              <div className="flex gap-2">
                <Button size="sm">
                  <Download size={16} className="mr-2" />
                  {t('privacy.download_policy')}
                </Button>
                <Button size="sm" variant="outline">
                  <Mail size={16} className="mr-2" />
                  {t('privacy.contact_us')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export with the expected name
export { PrivacyPolicy as ComprehensivePrivacyPolicy }