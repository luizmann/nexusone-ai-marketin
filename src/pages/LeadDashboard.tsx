import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  TrendingUp, 
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Filter,
  Download,
  MessageCircle,
  Target,
  Eye,
  ShoppingBag
} from '@phosphor-icons/react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'cold'
  score: number
  value: number
  lastContact: string
  location: string
  notes: string
  tags: string[]
}

export const LeadDashboard: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const leads: Lead[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      source: 'Landing Page',
      status: 'new',
      score: 85,
      value: 299,
      lastContact: '2 hours ago',
      location: 'New York, NY',
      notes: 'Interested in fitness tracker, asked about warranty',
      tags: ['fitness', 'high-value']
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1 (555) 987-6543',
      source: 'Facebook Ads',
      status: 'contacted',
      score: 72,
      value: 149,
      lastContact: '1 day ago',
      location: 'Los Angeles, CA',
      notes: 'Price sensitive, mentioned competitor comparison',
      tags: ['price-conscious']
    },
    {
      id: '3',
      name: 'David Johnson',
      email: 'david.j@email.com',
      phone: '+1 (555) 456-7890',
      source: 'WhatsApp Bot',
      status: 'converted',
      score: 95,
      value: 450,
      lastContact: '3 days ago',
      location: 'Chicago, IL',
      notes: 'Purchased premium package, very satisfied',
      tags: ['converted', 'premium']
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.w@email.com',
      phone: '+1 (555) 321-9876',
      source: 'Winner Products',
      status: 'qualified',
      score: 78,
      value: 199,
      lastContact: '5 hours ago',
      location: 'Miami, FL',
      notes: 'Ready to buy, waiting for discount code',
      tags: ['ready-to-buy']
    },
    {
      id: '5',
      name: 'Michael Brown',
      email: 'mike.brown@email.com',
      phone: '+1 (555) 654-3210',
      source: 'Instagram',
      status: 'cold',
      score: 45,
      value: 0,
      lastContact: '2 weeks ago',
      location: 'Dallas, TX',
      notes: 'Showed initial interest but not responding',
      tags: ['follow-up']
    }
  ]

  const statuses = ['all', 'new', 'contacted', 'qualified', 'converted', 'cold']
  const sources = ['all', 'Landing Page', 'Facebook Ads', 'WhatsApp Bot', 'Winner Products', 'Instagram', 'Google Ads']

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesStatus && matchesSource && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'qualified': return 'bg-purple-100 text-purple-800'
      case 'converted': return 'bg-green-100 text-green-800'
      case 'cold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
    totalValue: leads.reduce((sum, lead) => sum + lead.value, 0),
    avgScore: Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
            <Users className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Lead Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Manage and track your potential customers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Leads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.new}</div>
            <div className="text-sm text-muted-foreground">New</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.qualified}</div>
            <div className="text-sm text-muted-foreground">Qualified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.converted}</div>
            <div className="text-sm text-muted-foreground">Converted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">${stats.totalValue}</div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.avgScore}</div>
            <div className="text-sm text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source === 'all' ? 'All Sources' : source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Leads ({filteredLeads.length})</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Target className="h-4 w-4 mr-2" />
                Bulk Actions
              </Button>
              <Button size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Campaign
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{lead.name}</h3>
                        <Badge className={getStatusColor(lead.status)} variant="secondary">
                          {lead.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                            {lead.score}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {lead.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {lead.location}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm mb-3">
                        <span>Source: <strong>{lead.source}</strong></span>
                        <span>Value: <strong className="text-green-600">${lead.value}</strong></span>
                        <span>Last Contact: <strong>{lead.lastContact}</strong></span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{lead.notes}</p>

                      <div className="flex flex-wrap gap-1">
                        {lead.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No leads found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Lead Management Actions</h3>
              <p className="text-muted-foreground">
                Take action on your leads to improve conversion rates
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Score Leads
              </Button>
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Follow-up
              </Button>
              <Button>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LeadDashboard