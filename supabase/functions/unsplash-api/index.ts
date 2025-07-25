// Unsplash API Integration Functions
// API Key: -zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UnsplashPhoto {
  id: string
  created_at: string
  updated_at: string
  width: number
  height: number
  color: string
  blur_hash: string
  description: string | null
  alt_description: string | null
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  links: {
    self: string
    html: string
    download: string
    download_location: string
  }
  likes: number
  liked_by_user: boolean
  current_user_collections: any[]
  sponsorship: any
  topic_submissions: any
  user: {
    id: string
    updated_at: string
    username: string
    name: string
    first_name: string
    last_name: string | null
    twitter_username: string | null
    portfolio_url: string | null
    bio: string | null
    location: string | null
    links: {
      self: string
      html: string
      photos: string
      likes: string
      portfolio: string
      following: string
      followers: string
    }
    profile_image: {
      small: string
      medium: string
      large: string
    }
    instagram_username: string | null
    total_collections: number
    total_likes: number
    total_photos: number
    accepted_tos: boolean
    for_hire: boolean
    social: {
      instagram_username: string | null
      portfolio_url: string | null
      twitter_username: string | null
      paypal_email: string | null
    }
  }
  tags: Array<{
    type: string
    title: string
    source?: {
      ancestry: {
        type: {
          slug: string
          pretty_slug: string
        }
        category?: {
          slug: string
          pretty_slug: string
        }
        subcategory?: {
          slug: string
          pretty_slug: string
        }
      }
      title: string
      subtitle: string
      description: string
      meta_title: string
      meta_description: string
      cover_photo: any
    }
  }>
}

interface UnsplashSearchResult {
  total: number
  total_pages: number
  results: UnsplashPhoto[]
}

interface UnsplashCollection {
  id: string
  title: string
  description: string | null
  published_at: string
  last_collected_at: string
  updated_at: string
  curated: boolean
  featured: boolean
  total_photos: number
  private: boolean
  share_key: string
  tags: Array<{
    type: string
    title: string
    source?: any
  }>
  links: {
    self: string
    html: string
    photos: string
    related: string
  }
  user: {
    id: string
    updated_at: string
    username: string
    name: string
    first_name: string
    last_name: string | null
    twitter_username: string | null
    portfolio_url: string | null
    bio: string | null
    location: string | null
    links: {
      self: string
      html: string
      photos: string
      likes: string
      portfolio: string
      following: string
      followers: string
    }
    profile_image: {
      small: string
      medium: string
      large: string
    }
    instagram_username: string | null
    total_collections: number
    total_likes: number
    total_photos: number
    accepted_tos: boolean
    for_hire: boolean
    social: {
      instagram_username: string | null
      portfolio_url: string | null
      twitter_username: string | null
      paypal_email: string | null
    }
  }
  cover_photo: UnsplashPhoto | null
  preview_photos: UnsplashPhoto[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, query, page = 1, per_page = 20, orientation, color, order_by = 'relevant', collection_id, photo_id } = await req.json()
    
    const UNSPLASH_API_KEY = '-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE'
    const BASE_URL = 'https://api.unsplash.com'

    const headers = {
      'Authorization': `Client-ID ${UNSPLASH_API_KEY}`,
      'Accept-Version': 'v1'
    }

    let response: Response
    let data: any

    switch (action) {
      case 'search_photos':
        if (!query) {
          throw new Error('Query is required for photo search')
        }
        
        const searchParams = new URLSearchParams({
          query,
          page: page.toString(),
          per_page: per_page.toString(),
          order_by
        })
        
        if (orientation && orientation !== 'all') {
          searchParams.append('orientation', orientation)
        }
        
        if (color && color !== 'all') {
          searchParams.append('color', color)
        }
        
        response = await fetch(`${BASE_URL}/search/photos?${searchParams}`, { headers })
        data = await response.json() as UnsplashSearchResult
        
        if (!response.ok) {
          throw new Error(data.errors?.[0] || 'Search failed')
        }
        
        break

      case 'get_photo':
        if (!photo_id) {
          throw new Error('Photo ID is required')
        }
        
        response = await fetch(`${BASE_URL}/photos/${photo_id}`, { headers })
        data = await response.json() as UnsplashPhoto
        
        if (!response.ok) {
          throw new Error(data.errors?.[0] || 'Failed to get photo')
        }
        
        break

      case 'list_photos':
        const listParams = new URLSearchParams({
          page: page.toString(),
          per_page: per_page.toString(),
          order_by: order_by || 'latest'
        })
        
        response = await fetch(`${BASE_URL}/photos?${listParams}`, { headers })
        data = await response.json() as UnsplashPhoto[]
        
        if (!response.ok) {
          throw new Error('Failed to list photos')
        }
        
        break

      case 'get_collections':
        const collectionParams = new URLSearchParams({
          page: page.toString(),
          per_page: per_page.toString()
        })
        
        response = await fetch(`${BASE_URL}/collections?${collectionParams}`, { headers })
        data = await response.json() as UnsplashCollection[]
        
        if (!response.ok) {
          throw new Error('Failed to get collections')
        }
        
        break

      case 'get_collection_photos':
        if (!collection_id) {
          throw new Error('Collection ID is required')
        }
        
        const collectionPhotosParams = new URLSearchParams({
          page: page.toString(),
          per_page: per_page.toString()
        })
        
        response = await fetch(`${BASE_URL}/collections/${collection_id}/photos?${collectionPhotosParams}`, { headers })
        data = await response.json() as UnsplashPhoto[]
        
        if (!response.ok) {
          throw new Error('Failed to get collection photos')
        }
        
        break

      case 'track_download':
        if (!photo_id) {
          throw new Error('Photo ID is required for download tracking')
        }
        
        // First get the photo to get the download location
        const photoResponse = await fetch(`${BASE_URL}/photos/${photo_id}`, { headers })
        const photoData = await photoResponse.json() as UnsplashPhoto
        
        if (!photoResponse.ok) {
          throw new Error('Failed to get photo for download tracking')
        }
        
        // Track the download
        const downloadResponse = await fetch(photoData.links.download_location, { headers })
        const downloadData = await downloadResponse.json()
        
        if (!downloadResponse.ok) {
          throw new Error('Failed to track download')
        }
        
        data = {
          download_url: downloadData.url || photoData.urls.full,
          photo: photoData
        }
        
        break

      case 'get_featured_collections':
        const featuredParams = new URLSearchParams({
          page: page.toString(),
          per_page: per_page.toString()
        })
        
        response = await fetch(`${BASE_URL}/collections/featured?${featuredParams}`, { headers })
        data = await response.json() as UnsplashCollection[]
        
        if (!response.ok) {
          throw new Error('Failed to get featured collections')
        }
        
        break

      case 'search_collections':
        if (!query) {
          throw new Error('Query is required for collection search')
        }
        
        const searchCollectionParams = new URLSearchParams({
          query,
          page: page.toString(),
          per_page: per_page.toString()
        })
        
        response = await fetch(`${BASE_URL}/search/collections?${searchCollectionParams}`, { headers })
        data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.errors?.[0] || 'Collection search failed')
        }
        
        break

      case 'get_topics':
        const topicsParams = new URLSearchParams({
          page: page.toString(),
          per_page: per_page.toString(),
          order_by: order_by || 'featured'
        })
        
        response = await fetch(`${BASE_URL}/topics?${topicsParams}`, { headers })
        data = await response.json()
        
        if (!response.ok) {
          throw new Error('Failed to get topics')
        }
        
        break

      case 'get_topic_photos':
        if (!photo_id) { // Using photo_id as topic_id for this case
          throw new Error('Topic ID is required')
        }
        
        const topicPhotosParams = new URLSearchParams({
          page: page.toString(),
          per_page: per_page.toString(),
          order_by: order_by || 'latest'
        })
        
        response = await fetch(`${BASE_URL}/topics/${photo_id}/photos?${topicPhotosParams}`, { headers })
        data = await response.json() as UnsplashPhoto[]
        
        if (!response.ok) {
          throw new Error('Failed to get topic photos')
        }
        
        break

      case 'get_random_photos':
        const randomParams = new URLSearchParams({
          count: per_page.toString()
        })
        
        if (query) {
          randomParams.append('query', query)
        }
        
        if (orientation && orientation !== 'all') {
          randomParams.append('orientation', orientation)
        }
        
        response = await fetch(`${BASE_URL}/photos/random?${randomParams}`, { headers })
        data = await response.json()
        
        if (!response.ok) {
          throw new Error('Failed to get random photos')
        }
        
        // Ensure data is always an array
        if (!Array.isArray(data)) {
          data = [data]
        }
        
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
        action,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Unsplash API Error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

/* 
Usage Examples:

1. Search Photos:
{
  "action": "search_photos",
  "query": "business technology",
  "page": 1,
  "per_page": 20,
  "orientation": "landscape",
  "color": "blue",
  "order_by": "relevant"
}

2. Get Random Photos:
{
  "action": "get_random_photos",
  "query": "marketing",
  "per_page": 10,
  "orientation": "landscape"
}

3. Get Collections:
{
  "action": "get_collections",
  "page": 1,
  "per_page": 20
}

4. Track Download:
{
  "action": "track_download",
  "photo_id": "photo_id_here"
}

5. Get Photo Details:
{
  "action": "get_photo",
  "photo_id": "photo_id_here"
}

6. Get Collection Photos:
{
  "action": "get_collection_photos",
  "collection_id": "collection_id_here",
  "page": 1,
  "per_page": 20
}

7. Search Collections:
{
  "action": "search_collections",
  "query": "business",
  "page": 1,
  "per_page": 20
}

8. Get Topics:
{
  "action": "get_topics",
  "page": 1,
  "per_page": 20
}

9. Get Topic Photos:
{
  "action": "get_topic_photos",
  "photo_id": "topic_id_here",
  "page": 1,
  "per_page": 20
}

10. List Latest Photos:
{
  "action": "list_photos",
  "page": 1,
  "per_page": 20,
  "order_by": "latest"
}
*/