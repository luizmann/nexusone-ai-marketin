import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useKV } from '@github/spark/hooks'
import { Target, Plus, Play, Pause, BarChart } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function CampaignBuilder() {
  const [campaigns, setCampaigns] = useKV('campaigns', [])
  const [user, setUser] = useKV('user-profile', null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const [campaignName, setCampaignName] = useState('')
  const [campaignType, setCampaignType] = useState('')
  const [campaignObjective, setCampaignObjective] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [budget, setBudget] = useState('')
  const [duration, setDuration] = useState('')
  const [description, setDescription] = useState('')

  const campaignTypes = [
    { value: 'email', label: 'Email Marketing' },
    { value: 'social', label: 'Social Media' },
    { value: 'ppc', label: 'Pay-Per-Click' },
    { value: 'content', label: 'Content Marketing' },
    { value: 'seo', label: 'SEO Campaign' }
  ]

  const objectives = [
    { value: 'awareness', label: 'Brand Awareness' },
    { value: 'leads', label: 'Lead Generation' },
    { value: 'sales', label: 'Drive Sales' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'traffic', label: 'Website Traffic' }
  ]

  const createCampaign = () => {
    if (!campaignName || !campaignType || !campaignObjective) {
      toast.error('Please fill in all required fields')
      return
    }

    if (user && user.credits < 15) {
      toast.error('Insufficient credits. You need 15 credits to create a campaign.')
      return
    }

    const newCampaign = {
      id: Date.now(),
      name: campaignName,
      type: campaignType,
      objective: campaignObjective,
      targetAudience,
      budget,
      duration,
      description,
      status: 'draft',
      createdAt: new Date().toISOString(),
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spent: 0
      }
    }

    setCampaigns((prev) => [newCampaign, ...prev])
    
    if (user) {
      setUser({ ...user, credits: user.credits - 15 })
    }

    toast.success('Campaign created successfully!')
    setShowCreateForm(false)
    resetForm()
  }

  const resetForm = () => {
    setCampaignName('')
    setCampaignType('')
    setCampaignObjective('')
    setTargetAudience('')
    setBudget('')
    setDuration('')
    setDescription('')
  }

  const toggleCampaignStatus = (campaignId: number) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === campaignId
          ? {
              ...campaign,
              status: campaign.status === 'active' ? 'paused' : 'active'
            }
          : campaign
      )
    )
    toast.success('Campaign status updated!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'paused':
        return 'text-yellow-600 bg-yellow-100'
      case 'draft':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Campaign Builder</h2>
          <p className="text-muted-foreground">
            Create and manage your marketing campaigns
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
            <CardDescription>Fill in the details to create your marketing campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name *</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Summer Sale 2024"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-type">Campaign Type *</Label>
                <Select value={campaignType} onValueChange={setCampaignType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">Objective *</Label>
                <Select value={campaignObjective} onValueChange={setCampaignObjective}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectives.map((obj) => (
                      <SelectItem key={obj.value} value={obj.value}>
                        {obj.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $1,000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 2 weeks"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="e.g., Adults 25-45, Tech enthusiasts"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign goals and strategy..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={createCampaign} disabled={!campaignName || !campaignType || !campaignObjective}>
                Create Campaign (15 credits)
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription className="capitalize">
                    {campaign.type.replace('-', ' ')} • {campaign.objective.replace('-', ' ')}
                  </CardDescription>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaign.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {campaign.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Impressions</p>
                  <p className="font-semibold">{campaign.performance.impressions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Clicks</p>
                  <p className="font-semibold">{campaign.performance.clicks.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Conversions</p>
                  <p className="font-semibold">{campaign.performance.conversions}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Spent</p>
                  <p className="font-semibold">${campaign.performance.spent}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={campaign.status === 'active' ? 'secondary' : 'default'}
                  onClick={() => toggleCampaignStatus(campaign.id)}
                >
                  {campaign.status === 'active' ? (
                    <>
                      <Pause className="w-3 h-3 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      Start
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline">
                  <BarChart className="w-3 h-3 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && !showCreateForm && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Campaigns Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first marketing campaign to get started
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}