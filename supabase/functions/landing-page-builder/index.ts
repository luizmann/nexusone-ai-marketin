import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LandingPageRequest {
  title: string
  description: string
  target_audience: string
  goal: 'lead_generation' | 'sales' | 'sign_up' | 'download' | 'contact'
  industry: string
  language: 'en' | 'es' | 'pt' | 'ar' | 'he'
  theme: 'modern' | 'classic' | 'minimal' | 'creative' | 'corporate'
  colors?: {
    primary: string
    secondary: string
    accent: string
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const pageData: LandingPageRequest = await req.json()
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    // Check user credits and landing page quota
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits, plan')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return new Response('User not found', { status: 404, headers: corsHeaders })
    }

    const creditsRequired = 10 // Landing page creation costs 10 credits
    if (userData.credits < creditsRequired) {
      return new Response('Insufficient credits', { status: 402, headers: corsHeaders })
    }

    // Check plan limits for landing pages
    const { data: planLimits } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'plan_limits')
      .single()

    const limits = planLimits?.value?.[userData.plan]
    if (limits?.landing_pages !== -1) { // -1 means unlimited
      const { count } = await supabase
        .from('landing_pages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (count >= limits?.landing_pages) {
        return new Response('Landing page quota exceeded', { status: 402, headers: corsHeaders })
      }
    }

    // Generate content using AI
    const generatedContent = await generateLandingPageContent(pageData)
    if (!generatedContent.success) {
      throw new Error('Failed to generate landing page content')
    }

    // Create unique slug
    const slug = await generateUniqueSlug(supabase, pageData.title)

    // Build landing page structure
    const landingPageContent = buildLandingPageStructure(pageData, generatedContent.content)

    // Save landing page to database
    const { data: savedPage, error: saveError } = await supabase
      .from('landing_pages')
      .insert({
        user_id: user.id,
        title: pageData.title,
        slug,
        content: landingPageContent,
        theme: pageData.theme,
        language: pageData.language,
        is_published: false,
        seo_meta: {
          title: generatedContent.content.seo_title,
          description: generatedContent.content.seo_description,
          keywords: generatedContent.content.keywords
        },
        conversion_tracking: {
          goal: pageData.goal,
          target_audience: pageData.target_audience,
          industry: pageData.industry
        }
      })
      .select()
      .single()

    if (saveError) {
      throw new Error('Failed to save landing page')
    }

    // Consume credits
    await supabase.rpc('consume_credits', {
      p_user_id: user.id,
      p_amount: creditsRequired,
      p_module: 'magic_pages',
      p_description: `Created landing page: ${pageData.title}`
    })

    // Log usage analytics
    await supabase
      .from('usage_analytics')
      .insert({
        user_id: user.id,
        module: 'magic_pages',
        action: 'create_landing_page',
        credits_consumed: creditsRequired,
        success: true,
        metadata: {
          page_id: savedPage.id,
          theme: pageData.theme,
          language: pageData.language,
          goal: pageData.goal,
          industry: pageData.industry
        }
      })

    // Generate preview URL
    const previewUrl = `https://${Deno.env.get('SUPABASE_URL')?.replace('https://', '')}/functions/v1/landing-page-preview/${slug}`

    return new Response(
      JSON.stringify({
        success: true,
        landing_page_id: savedPage.id,
        slug,
        preview_url: previewUrl,
        edit_url: `/landing-pages/edit/${savedPage.id}`,
        credits_used: creditsRequired,
        remaining_credits: userData.credits - creditsRequired
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in landing-page-builder:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function generateLandingPageContent(pageData: LandingPageRequest) {
  try {
    const prompt = `Create compelling landing page content for:
    
    Title: ${pageData.title}
    Description: ${pageData.description}
    Target Audience: ${pageData.target_audience}
    Goal: ${pageData.goal}
    Industry: ${pageData.industry}
    Language: ${pageData.language}
    
    Generate the following in ${pageData.language === 'en' ? 'English' : 
                                 pageData.language === 'es' ? 'Spanish' :
                                 pageData.language === 'pt' ? 'Portuguese' :
                                 pageData.language === 'ar' ? 'Arabic' : 'Hebrew'}:
    
    1. Hero headline (compelling, benefit-focused)
    2. Hero subheadline (supporting details)
    3. Value proposition (3-5 key benefits)
    4. Social proof section (testimonial examples)
    5. Call-to-action text (action-oriented)
    6. FAQ section (5 common questions)
    7. SEO title and meta description
    8. Keywords for SEO
    
    Format as JSON with proper structure.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert copywriter specializing in high-converting landing pages. Always respond with valid JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = JSON.parse(data.choices[0].message.content)

    return {
      success: true,
      content
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function generateUniqueSlug(supabase: any, title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50)

  let slug = baseSlug
  let counter = 1

  while (true) {
    const { data, error } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('slug', slug)
      .single()

    if (error && error.code === 'PGRST116') { // No rows found
      return slug
    }

    if (data) {
      slug = `${baseSlug}-${counter}`
      counter++
    } else {
      return slug
    }
  }
}

function buildLandingPageStructure(pageData: LandingPageRequest, content: any) {
  const colors = pageData.colors || {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#f59e0b'
  }

  return {
    template: pageData.theme,
    sections: [
      {
        type: 'hero',
        content: {
          headline: content.hero_headline,
          subheadline: content.hero_subheadline,
          cta_text: content.cta_text,
          background_type: 'gradient',
          background_config: {
            from: colors.primary,
            to: colors.accent
          }
        }
      },
      {
        type: 'value_proposition',
        content: {
          title: content.value_proposition_title || 'Why Choose Us?',
          benefits: content.value_proposition || []
        }
      },
      {
        type: 'social_proof',
        content: {
          title: 'What Our Customers Say',
          testimonials: content.social_proof || []
        }
      },
      {
        type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          questions: content.faq || []
        }
      },
      {
        type: 'cta_final',
        content: {
          title: 'Ready to Get Started?',
          subtitle: 'Join thousands of satisfied customers',
          cta_text: content.cta_text,
          background_color: colors.primary
        }
      }
    ],
    styles: {
      colors,
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      spacing: {
        section_padding: '4rem',
        container_max_width: '1200px'
      }
    },
    metadata: {
      goal: pageData.goal,
      target_audience: pageData.target_audience,
      industry: pageData.industry,
      language: pageData.language,
      created_at: new Date().toISOString()
    }
  }
}

// Serve the actual landing page
export async function serveLandingPage(req: Request) {
  const url = new URL(req.url)
  const slug = url.pathname.split('/').pop()

  if (!slug) {
    return new Response('Not Found', { status: 404 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data: page, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !page) {
    return new Response('Page Not Found', { status: 404 })
  }

  // Generate HTML from page content
  const html = generateLandingPageHTML(page)

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}

function generateLandingPageHTML(page: any): string {
  const content = page.content
  const styles = content.styles || {}
  
  return `
<!DOCTYPE html>
<html lang="${page.language}" dir="${['ar', 'he'].includes(page.language) ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.seo_meta?.title || page.title}</title>
    <meta name="description" content="${page.seo_meta?.description || ''}">
    <meta name="keywords" content="${page.seo_meta?.keywords || ''}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .hero-gradient { 
            background: linear-gradient(135deg, ${styles.colors?.primary || '#2563eb'}, ${styles.colors?.accent || '#f59e0b'}); 
        }
    </style>
</head>
<body class="bg-white">
    ${content.sections?.map((section: any) => renderSection(section, styles)).join('') || ''}
    
    <!-- Analytics and Conversion Tracking -->
    <script>
        // Track page view
        fetch('/api/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page_id: '${page.id}', slug: '${page.slug}' })
        });
        
        // Track CTA clicks
        document.querySelectorAll('[data-cta]').forEach(button => {
            button.addEventListener('click', () => {
                fetch('/api/track-conversion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page_id: '${page.id}', action: 'cta_click' })
                });
            });
        });
    </script>
</body>
</html>`
}

function renderSection(section: any, styles: any): string {
  switch (section.type) {
    case 'hero':
      return `
        <section class="hero-gradient text-white py-20">
            <div class="max-w-4xl mx-auto px-6 text-center">
                <h1 class="text-5xl font-bold mb-6">${section.content.headline}</h1>
                <p class="text-xl mb-8 opacity-90">${section.content.subheadline}</p>
                <button data-cta class="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                    ${section.content.cta_text}
                </button>
            </div>
        </section>`
    
    case 'value_proposition':
      return `
        <section class="py-20 bg-gray-50">
            <div class="max-w-6xl mx-auto px-6">
                <h2 class="text-3xl font-bold text-center mb-12">${section.content.title}</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    ${section.content.benefits?.map((benefit: any) => `
                        <div class="text-center">
                            <h3 class="text-xl font-semibold mb-4">${benefit.title || benefit}</h3>
                            <p class="text-gray-600">${benefit.description || ''}</p>
                        </div>
                    `).join('') || ''}
                </div>
            </div>
        </section>`
    
    default:
      return ''
  }
}