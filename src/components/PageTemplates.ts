// Page templates for the drag and drop editor
export const PAGE_TEMPLATES = {
  landing_page: {
    name: 'Landing Page',
    description: 'High-converting landing page template',
    thumbnail: 'https://via.placeholder.com/400x300?text=Landing+Page',
    components: [
      {
        id: 'header-1',
        type: 'header',
        content: { text: 'Transform Your Business Today', level: 1 },
        style: { 
          fontSize: '3.5rem', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: '#1a1a1a',
          marginBottom: '1.5rem'
        }
      },
      {
        id: 'text-1',
        type: 'text',
        content: { text: 'Discover the revolutionary platform that\'s helping thousands of entrepreneurs scale their businesses faster than ever before.' },
        style: { 
          fontSize: '1.25rem', 
          lineHeight: '1.6',
          color: '#666666',
          marginBottom: '3rem',
          textAlign: 'center'
        }
      },
      {
        id: 'image-1',
        type: 'image',
        content: { 
          src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop', 
          alt: 'Business Growth Dashboard',
          caption: ''
        },
        style: { 
          width: '100%', 
          height: '400px',
          borderRadius: '12px',
          marginBottom: '3rem',
          objectFit: 'cover'
        }
      },
      {
        id: 'button-1',
        type: 'button',
        content: { 
          text: 'Start Your Free Trial', 
          link: '#signup',
          action: 'link'
        },
        style: { 
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '16px 32px',
          borderRadius: '8px',
          fontSize: '1.125rem',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '2rem'
        }
      }
    ]
  },
  
  sales_page: {
    name: 'Sales Page',
    description: 'Complete sales page with testimonials',
    thumbnail: 'https://via.placeholder.com/400x300?text=Sales+Page',
    components: [
      {
        id: 'header-1',
        type: 'header',
        content: { text: 'Finally, A Solution That Works', level: 1 },
        style: { 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: '#1a1a1a',
          marginBottom: '1rem'
        }
      },
      {
        id: 'text-1',
        type: 'text',
        content: { text: 'Join 50,000+ entrepreneurs who have already transformed their businesses with our proven system.' },
        style: { 
          fontSize: '1.5rem', 
          lineHeight: '1.5',
          color: '#666666',
          marginBottom: '2rem',
          textAlign: 'center'
        }
      },
      {
        id: 'video-1',
        type: 'video',
        content: { 
          src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          autoplay: false,
          controls: true
        },
        style: { 
          width: '100%', 
          height: '400px',
          borderRadius: '12px',
          marginBottom: '3rem'
        }
      },
      {
        id: 'header-2',
        type: 'header',
        content: { text: 'What You\'ll Get:', level: 2 },
        style: { 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: '#1a1a1a',
          marginBottom: '2rem'
        }
      },
      {
        id: 'columns-1',
        type: 'columns',
        content: {
          columns: [
            { 
              content: '🚀 Advanced Marketing Automation\n\nSet up sophisticated funnels that convert visitors into customers 24/7.',
              width: '33.33%'
            },
            { 
              content: '📊 Real-Time Analytics\n\nTrack every metric that matters and optimize your campaigns for maximum ROI.',
              width: '33.33%'
            },
            { 
              content: '🎯 AI-Powered Targeting\n\nReach the right audience at the right time with intelligent targeting algorithms.',
              width: '33.33%'
            }
          ]
        },
        style: {
          display: 'flex',
          gap: '2rem',
          marginBottom: '3rem'
        }
      },
      {
        id: 'button-1',
        type: 'button',
        content: { 
          text: 'Get Instant Access - $97/month', 
          link: '#purchase',
          action: 'link'
        },
        style: { 
          backgroundColor: '#ef4444',
          color: '#ffffff',
          padding: '20px 40px',
          borderRadius: '8px',
          fontSize: '1.25rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '1rem'
        }
      },
      {
        id: 'text-2',
        type: 'text',
        content: { text: '30-day money-back guarantee • Cancel anytime • Instant access' },
        style: { 
          fontSize: '0.875rem', 
          lineHeight: '1.4',
          color: '#888888',
          marginBottom: '3rem',
          textAlign: 'center'
        }
      }
    ]
  },

  portfolio: {
    name: 'Portfolio',
    description: 'Professional portfolio showcase',
    thumbnail: 'https://via.placeholder.com/400x300?text=Portfolio',
    components: [
      {
        id: 'header-1',
        type: 'header',
        content: { text: 'John Smith', level: 1 },
        style: { 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: '#1a1a1a',
          marginBottom: '0.5rem'
        }
      },
      {
        id: 'text-1',
        type: 'text',
        content: { text: 'Digital Marketing Specialist & Growth Hacker' },
        style: { 
          fontSize: '1.25rem', 
          lineHeight: '1.6',
          color: '#666666',
          marginBottom: '3rem',
          textAlign: 'center'
        }
      },
      {
        id: 'image-1',
        type: 'image',
        content: { 
          src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face', 
          alt: 'Professional Headshot',
          caption: ''
        },
        style: { 
          width: '300px', 
          height: '300px',
          borderRadius: '50%',
          marginBottom: '3rem',
          margin: '0 auto 3rem',
          display: 'block'
        }
      },
      {
        id: 'header-2',
        type: 'header',
        content: { text: 'About Me', level: 2 },
        style: { 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: '#1a1a1a',
          marginBottom: '1.5rem'
        }
      },
      {
        id: 'text-2',
        type: 'text',
        content: { text: 'With over 10 years of experience in digital marketing, I help businesses grow their online presence and increase their revenue through strategic marketing campaigns and data-driven insights.' },
        style: { 
          fontSize: '1.125rem', 
          lineHeight: '1.7',
          color: '#444444',
          marginBottom: '3rem',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }
      },
      {
        id: 'header-3',
        type: 'header',
        content: { text: 'My Services', level: 2 },
        style: { 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: '#1a1a1a',
          marginBottom: '2rem'
        }
      },
      {
        id: 'columns-1',
        type: 'columns',
        content: {
          columns: [
            { 
              content: '📱 Social Media Marketing\n\nBoost your brand presence across all social platforms.',
              width: '50%'
            },
            { 
              content: '🎯 PPC Advertising\n\nMaximize ROI with targeted advertising campaigns.',
              width: '50%'
            }
          ]
        },
        style: {
          display: 'flex',
          gap: '2rem',
          marginBottom: '3rem'
        }
      },
      {
        id: 'button-1',
        type: 'button',
        content: { 
          text: 'Get In Touch', 
          link: 'mailto:john@example.com',
          action: 'link'
        },
        style: { 
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '2rem'
        }
      }
    ]
  },

  coming_soon: {
    name: 'Coming Soon',
    description: 'Build anticipation for your launch',
    thumbnail: 'https://via.placeholder.com/400x300?text=Coming+Soon',
    components: [
      {
        id: 'spacer-1',
        type: 'spacer',
        content: { height: 100 },
        style: { height: '100px', marginBottom: '0' }
      },
      {
        id: 'header-1',
        type: 'header',
        content: { text: 'Something Amazing Is Coming', level: 1 },
        style: { 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: '#1a1a1a',
          marginBottom: '1rem'
        }
      },
      {
        id: 'text-1',
        type: 'text',
        content: { text: 'We\'re working hard to bring you an incredible experience. Sign up to be the first to know when we launch!' },
        style: { 
          fontSize: '1.5rem', 
          lineHeight: '1.6',
          color: '#666666',
          marginBottom: '3rem',
          textAlign: 'center'
        }
      },
      {
        id: 'form-1',
        type: 'form',
        content: {
          fields: [
            { type: 'email', label: 'Email Address', placeholder: 'Enter your email', required: true }
          ],
          submitText: 'Notify Me',
          action: '#'
        },
        style: {
          backgroundColor: '#f8f9fa',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '3rem',
          maxWidth: '500px',
          margin: '0 auto 3rem'
        }
      },
      {
        id: 'text-2',
        type: 'text',
        content: { text: 'Follow us on social media for updates and behind-the-scenes content.' },
        style: { 
          fontSize: '1rem', 
          lineHeight: '1.6',
          color: '#888888',
          marginBottom: '2rem',
          textAlign: 'center'
        }
      },
      {
        id: 'spacer-2',
        type: 'spacer',
        content: { height: 100 },
        style: { height: '100px', marginBottom: '0' }
      }
    ]
  },

  product_showcase: {
    name: 'Product Showcase',
    description: 'Highlight your product features',
    thumbnail: 'https://via.placeholder.com/400x300?text=Product+Showcase',
    components: [
      {
        id: 'header-1',
        type: 'header',
        content: { text: 'Introducing the Future', level: 1 },
        style: { 
          fontSize: '3.5rem', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: '#1a1a1a',
          marginBottom: '1rem'
        }
      },
      {
        id: 'text-1',
        type: 'text',
        content: { text: 'Experience innovation like never before with our groundbreaking product designed for the modern world.' },
        style: { 
          fontSize: '1.25rem', 
          lineHeight: '1.6',
          color: '#666666',
          marginBottom: '3rem',
          textAlign: 'center'
        }
      },
      {
        id: 'image-1',
        type: 'image',
        content: { 
          src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=500&fit=crop', 
          alt: 'Product Hero Image',
          caption: ''
        },
        style: { 
          width: '100%', 
          height: '500px',
          borderRadius: '12px',
          marginBottom: '4rem',
          objectFit: 'cover'
        }
      },
      {
        id: 'header-2',
        type: 'header',
        content: { text: 'Key Features', level: 2 },
        style: { 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: '#1a1a1a',
          marginBottom: '3rem'
        }
      },
      {
        id: 'columns-1',
        type: 'columns',
        content: {
          columns: [
            { 
              content: '⚡ Lightning Fast\n\nOptimized for speed and performance to keep you ahead of the competition.',
              width: '33.33%'
            },
            { 
              content: '🔒 Secure & Reliable\n\nEnterprise-grade security with 99.9% uptime guarantee.',
              width: '33.33%'
            },
            { 
              content: '🎨 Beautiful Design\n\nIntuitive interface designed for the best user experience.',
              width: '33.33%'
            }
          ]
        },
        style: {
          display: 'flex',
          gap: '2rem',
          marginBottom: '4rem'
        }
      },
      {
        id: 'button-1',
        type: 'button',
        content: { 
          text: 'Try It Free', 
          link: '#trial',
          action: 'link'
        },
        style: { 
          backgroundColor: '#10b981',
          color: '#ffffff',
          padding: '16px 32px',
          borderRadius: '8px',
          fontSize: '1.125rem',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '2rem'
        }
      }
    ]
  }
}

export type PageTemplate = typeof PAGE_TEMPLATES[keyof typeof PAGE_TEMPLATES]