import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  Search, 
  Download, 
  Eye, 
  Heart, 
  Filter, 
  Grid3X3, 
  Grid, 
  List,
  Image as ImageIcon,
  Settings,
  Key,
  Zap
} from '@phosphor-icons/react'

interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  user: {
    name: string
    username: string
    profile_image: {
      small: string
    }
  }
  description: string | null
  alt_description: string | null
  likes: number
  downloads: number
  width: number
  height: number
  color: string
  tags: Array<{
    title: string
  }>
}

interface UnsplashCollection {
  id: string
  title: string
  description: string | null
  total_photos: number
  preview_photos: UnsplashPhoto[]
  user: {
    name: string
    username: string
  }
}

export function UnsplashIntegration() {
  const [apiKey, setApiKey] = useKV('unsplash-api-key', '')
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [collections, setCollections] = useState<UnsplashCollection[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'masonry' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('search')
  const [filters, setFilters] = useState({
    orientation: 'all',
    color: 'all',
    order_by: 'relevant',
    per_page: 20
  })
  
  // Search trending and featured photos on component mount
  useEffect(() => {
    if (apiKey) {
      searchPhotos('marketing automation', true)
      loadFeaturedCollections()
    }
  }, [apiKey])

  const searchPhotos = async (query?: string, isInitial = false) => {
    if (!apiKey) {
      toast.error('Please configure your Unsplash API key first')
      return
    }

    setIsLoading(true)
    const searchTerm = query || searchQuery || 'business technology'
    
    try {
      // Real API call would go here when API key is properly configured
      // const response = await fetch('/api/unsplash', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     action: 'search_photos',
      //     query: searchTerm,
      //     ...filters
      //   })
      // })
      
      // Mock API response for development - replace with real API call
      const mockPhotos: UnsplashPhoto[] = [
        {
          id: '1',
          urls: {
            raw: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
            full: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
            regular: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1080',
            small: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
            thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200'
          },
          user: {
            name: 'Carlos Muza',
            username: 'kmuza',
            profile_image: {
              small: 'https://images.unsplash.com/profile-1446404465118-3a53b909cc82?w=32'
            }
          },
          description: 'Business charts and graphs on laptop',
          alt_description: 'person using MacBook Pro with business analytics',
          likes: 2847,
          downloads: 124580,
          width: 5472,
          height: 3648,
          color: '#0c0c0c',
          tags: [
            { title: 'business' },
            { title: 'analytics' },
            { title: 'charts' },
            { title: 'data' },
            { title: 'technology' }
          ]
        },
        {
          id: '2',
          urls: {
            raw: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
            full: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
            regular: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1080',
            small: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
            thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200'
          },
          user: {
            name: 'Stephen Phillips',
            username: 'hostreviews',
            profile_image: {
              small: 'https://images.unsplash.com/profile-1551288049-bebda4e38f71?w=32'
            }
          },
          description: 'Data visualization and analytics dashboard',
          alt_description: 'data charts and graphs on laptop screen',
          likes: 1924,
          downloads: 98765,
          width: 4928,
          height: 3264,
          color: '#262626',
          tags: [
            { title: 'data' },
            { title: 'visualization' },
            { title: 'technology' },
            { title: 'dashboard' },
            { title: 'analytics' }
          ]
        },
        {
          id: '3',
          urls: {
            raw: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3',
            full: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3',
            regular: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1080',
            small: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400',
            thumb: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=200'
          },
          user: {
            name: 'Hal Gatewood',
            username: 'halacious',
            profile_image: {
              small: 'https://images.unsplash.com/profile-1504868584819-f8e8b4b6d7e3?w=32'
            }
          },
          description: 'Social media marketing on mobile device',
          alt_description: 'social media icons and apps on smartphone',
          likes: 3456,
          downloads: 156789,
          width: 4000,
          height: 6000,
          color: '#f3f3f3',
          tags: [
            { title: 'social media' },
            { title: 'marketing' },
            { title: 'mobile' },
            { title: 'apps' },
            { title: 'digital' }
          ]
        },
        {
          id: '4',
          urls: {
            raw: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44',
            full: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44',
            regular: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1080',
            small: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400',
            thumb: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200'
          },
          user: {
            name: 'Campaign Creators',
            username: 'campaign_creators',
            profile_image: {
              small: 'https://images.unsplash.com/profile-1559526324-4b87b5e36e44?w=32'
            }
          },
          description: 'Digital marketing team collaboration',
          alt_description: 'team working on marketing campaign with laptops',
          likes: 2156,
          downloads: 89432,
          width: 6000,
          height: 4000,
          color: '#404040',
          tags: [
            { title: 'team' },
            { title: 'collaboration' },
            { title: 'marketing' },
            { title: 'office' },
            { title: 'work' }
          ]
        },
        {
          id: '5',
          urls: {
            raw: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
            full: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
            regular: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1080',
            small: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
            thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200'
          },
          user: {
            name: 'Myriam Jessier',
            username: 'mjessier',
            profile_image: {
              small: 'https://images.unsplash.com/profile-1516321318423-f06f85e504b3?w=32'
            }
          },
          description: 'SEO and digital marketing analytics',
          alt_description: 'Google Analytics dashboard on computer screen',
          likes: 1789,
          downloads: 67543,
          width: 5184,
          height: 3456,
          color: '#8c8c8c',
          tags: [
            { title: 'SEO' },
            { title: 'analytics' },
            { title: 'Google' },
            { title: 'marketing' },
            { title: 'data' }
          ]
        },
        {
          id: '6',
          urls: {
            raw: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
            full: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
            regular: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1080',
            small: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
            thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200'
          },
          user: {
            name: 'Austin Distel',
            username: 'austindistel',
            profile_image: {
              small: 'https://images.unsplash.com/profile-1552664730-d307ca884978?w=32'
            }
          },
          description: 'Business growth and startup meeting',
          alt_description: 'people in business meeting discussing growth charts',
          likes: 2892,
          downloads: 112456,
          width: 4896,
          height: 3264,
          color: '#f5f5f5',
          tags: [
            { title: 'business' },
            { title: 'meeting' },
            { title: 'growth' },
            { title: 'startup' },
            { title: 'team' }
          ]
        }
      ]

      // Filter based on current search term for demo
      const filteredPhotos = mockPhotos.filter(photo => 
        photo.tags.some(tag => 
          tag.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) || 
        photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.alt_description?.toLowerCase().includes(searchTerm.toLowerCase())
      )

      setPhotos(filteredPhotos.length > 0 ? filteredPhotos : mockPhotos)
      if (!isInitial) {
        toast.success(`Found ${filteredPhotos.length > 0 ? filteredPhotos.length : mockPhotos.length} photos for "${searchTerm}"`)
      }
    } catch (error) {
      console.error('Error searching photos:', error)
      toast.error('Failed to search photos')
    } finally {
      setIsLoading(false)
    }
  }

  const loadFeaturedCollections = async () => {
    if (!apiKey) return
    
    try {
      // Mock collections for development
      const mockCollections: UnsplashCollection[] = [
        {
          id: 'marketing',
          title: 'Digital Marketing',
          description: 'High-quality images for digital marketing campaigns',
          total_photos: 1250,
          preview_photos: photos.slice(0, 3),
          user: {
            name: 'Unsplash',
            username: 'unsplash'
          }
        },
        {
          id: 'business',
          title: 'Business & Finance',
          description: 'Professional business and finance imagery',
          total_photos: 2847,
          preview_photos: photos.slice(0, 3),
          user: {
            name: 'Unsplash',
            username: 'unsplash'
          }
        }
      ]
      
      setCollections(mockCollections)
    } catch (error) {
      console.error('Error loading collections:', error)
    }
  }

  const downloadPhoto = async (photo: UnsplashPhoto) => {
    try {
      // In a real implementation, you would trigger the download API
      const link = document.createElement('a')
      link.href = photo.urls.full
      link.download = `unsplash-${photo.id}.jpg`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Photo download started')
    } catch (error) {
      console.error('Error downloading photo:', error)
      toast.error('Failed to download photo')
    }
  }

  const PhotoCard = ({ photo }: { photo: UnsplashPhoto }) => (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden">
        <img
          src={photo.urls.small}
          alt={photo.alt_description || photo.description || 'Unsplash photo'}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
          onClick={() => setSelectedPhoto(photo)}
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhoto(photo)
              }}
            >
              <Eye size={16} />
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                downloadPhoto(photo)
              }}
            >
              <Download size={16} />
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={photo.user.profile_image.small}
            alt={photo.user.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-muted-foreground">{photo.user.name}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart size={14} />
            {photo.likes.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Download size={14} />
            {photo.downloads.toLocaleString()}
          </span>
        </div>
        {photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {photo.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag.title}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const PhotoDetailModal = () => {
    if (!selectedPhoto) return null

    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {selectedPhoto.description || selectedPhoto.alt_description || 'Untitled'}
                </h3>
                <div className="flex items-center gap-2">
                  <img
                    src={selectedPhoto.user.profile_image.small}
                    alt={selectedPhoto.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{selectedPhoto.user.name}</p>
                    <p className="text-sm text-muted-foreground">@{selectedPhoto.user.username}</p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedPhoto(null)}
              >
                Close
              </Button>
            </div>
            
            <img
              src={selectedPhoto.urls.regular}
              alt={selectedPhoto.alt_description || selectedPhoto.description || 'Unsplash photo'}
              className="w-full rounded-lg mb-4"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <Label>Dimensions</Label>
                <p>{selectedPhoto.width} × {selectedPhoto.height}</p>
              </div>
              <div>
                <Label>Likes</Label>
                <p>{selectedPhoto.likes.toLocaleString()}</p>
              </div>
              <div>
                <Label>Downloads</Label>
                <p>{selectedPhoto.downloads.toLocaleString()}</p>
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: selectedPhoto.color }}
                  />
                  <span>{selectedPhoto.color}</span>
                </div>
              </div>
            </div>
            
            {selectedPhoto.tags.length > 0 && (
              <div className="mt-4">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPhoto.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag.title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2 mt-6">
              <Button onClick={() => downloadPhoto(selectedPhoto)} className="flex-1">
                <Download size={16} className="mr-2" />
                Download Original
              </Button>
              <Button variant="outline" onClick={() => downloadPhoto(selectedPhoto)}>
                Download Small
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon size={32} className="text-primary" />
            <h1 className="text-3xl font-bold">Unsplash Integration</h1>
          </div>
          <p className="text-muted-foreground">
            Access millions of high-quality photos for your marketing campaigns
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search size={20} />
                  Photo Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for photos... (e.g., business, technology, marketing)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchPhotos()}
                    className="flex-1"
                  />
                  <Button onClick={() => searchPhotos()} disabled={isLoading} className="px-6">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Search size={16} />
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Orientation:</Label>
                    <Select value={filters.orientation} onValueChange={(value) => setFilters({...filters, orientation: value})}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="squarish">Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Color:</Label>
                    <Select value={filters.color} onValueChange={(value) => setFilters({...filters, color: value})}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Color</SelectItem>
                        <SelectItem value="black_and_white">B&W</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="magenta">Magenta</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="teal">Teal</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Sort by:</Label>
                    <Select value={filters.order_by} onValueChange={(value) => setFilters({...filters, order_by: value})}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevant">Relevant</SelectItem>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="popular">Popular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-1 ml-auto">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      title="Grid View"
                    >
                      <Grid3X3 size={16} />
                    </Button>
                    <Button
                      variant={viewMode === 'masonry' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('masonry')}
                      title="Masonry View"
                    >
                      <Grid size={16} />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      title="List View"
                    >
                      <List size={16} />
                    </Button>
                  </div>
                </div>
                
                {/* Quick Search Suggestions */}
                <div className="flex flex-wrap gap-2">
                  <Label className="text-sm text-muted-foreground">Quick searches:</Label>
                  {['business', 'technology', 'marketing', 'office', 'team', 'startup', 'analytics', 'growth'].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(suggestion)
                        searchPhotos(suggestion)
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Searching photos...</p>
                </div>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : viewMode === 'masonry'
                  ? 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 space-y-4'
                  : 'grid-cols-1'
              }`}>
                {photos.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {collections.map((collection) => (
                    <Card key={collection.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-3 mb-3">
                          {collection.preview_photos.slice(0, 3).map((photo, index) => (
                            <img
                              key={index}
                              src={photo.urls.thumb}
                              alt=""
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                        <h3 className="font-semibold mb-1">{collection.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {collection.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {collection.total_photos.toLocaleString()} photos
                          </span>
                          <span className="text-sm text-muted-foreground">
                            by {collection.user.name}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap size={20} />
                  Trending Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {photos.map((photo) => (
                    <PhotoCard key={photo.id} photo={photo} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings size={20} />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="api-key">Unsplash API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your Unsplash API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Get your API key from{' '}
                    <a
                      href="https://unsplash.com/developers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Unsplash Developers
                    </a>
                  </p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Key size={16} />
                    API Status & Guidelines
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm">{apiKey ? 'API Key Configured' : 'API Key Required'}</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Demo plan: 50 requests per hour</li>
                      <li>• Production plan: 5,000 requests per hour</li>
                      <li>• Always credit photographers when using their photos</li>
                      <li>• Follow Unsplash API guidelines and terms of service</li>
                      <li>• Free to use for commercial and personal projects</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Test API Connection</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Verify your API key is working properly
                  </p>
                  <Button 
                    onClick={() => searchPhotos('test', false)}
                    disabled={!apiKey || isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <PhotoDetailModal />
      </div>
    </div>
  )
}