/**
 * Launch Campaign Templates Library
 * Pre-built templates for different campaign types and channels
 */

export interface CampaignTemplate {
  id: string
  name: string
  type: string
  description: string
  channels: string[]
  duration: number
  targetAudience: string[]
  content: {
    [key: string]: any
  }
  automation: {
    rules: AutomationRule[]
    schedule: ScheduleConfig
  }
  metrics: {
    expectedReach: number
    expectedConversion: number
    estimatedROI: number
  }
}

export interface AutomationRule {
  id: string
  name: string
  trigger: string
  action: string
  conditions: any
  config: any
}

export interface ScheduleConfig {
  type: 'immediate' | 'scheduled' | 'recurring'
  startDate?: string
  frequency?: string
  times?: string[]
}

export const LAUNCH_CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'global-product-launch',
    name: 'Global Product Launch',
    type: 'product-launch',
    description: 'Comprehensive multi-channel campaign for new product launches with global reach',
    channels: ['email', 'social', 'pr', 'content', 'ads'],
    duration: 45,
    targetAudience: ['marketing-professionals', 'business-owners', 'entrepreneurs'],
    content: {
      email: {
        sequences: [
          {
            name: 'Pre-Launch Teaser',
            emails: [
              {
                day: -14,
                subject: '🚀 Something Revolutionary is Coming...',
                type: 'teaser',
                content: 'Build anticipation with mystery and early access offers'
              },
              {
                day: -7,
                subject: 'Your Early Access Invitation is Here',
                type: 'early-access',
                content: 'Exclusive preview for subscribers with special pricing'
              },
              {
                day: 0,
                subject: 'We\'re LIVE! Introducing [Product Name]',
                type: 'launch-announcement',
                content: 'Official launch announcement with full feature reveal'
              },
              {
                day: 3,
                subject: 'See [Product Name] in Action (Live Demo)',
                type: 'demo',
                content: 'Interactive demo and success stories'
              },
              {
                day: 7,
                subject: 'Join 10,000+ Users Who\'ve Already Transformed Their [Industry]',
                type: 'social-proof',
                content: 'Customer testimonials and usage statistics'
              }
            ]
          }
        ]
      },
      social: {
        platforms: {
          linkedin: [
            {
              type: 'announcement',
              content: 'Professional launch announcement with industry insights',
              timing: 'launch-day-morning'
            },
            {
              type: 'thought-leadership',
              content: 'Industry trends and how the product addresses them',
              timing: 'post-launch-weekly'
            }
          ],
          twitter: [
            {
              type: 'live-launch',
              content: 'Real-time launch updates with hashtags',
              timing: 'launch-day-hourly'
            },
            {
              type: 'user-generated',
              content: 'Retweet customer experiences and feedback',
              timing: 'ongoing'
            }
          ],
          facebook: [
            {
              type: 'community-focused',
              content: 'Community building and discussion posts',
              timing: 'bi-weekly'
            }
          ],
          instagram: [
            {
              type: 'visual-story',
              content: 'Behind-the-scenes and product visuals',
              timing: 'daily-stories'
            }
          ]
        }
      },
      pr: {
        pressRelease: {
          headline: '[Company] Launches Revolutionary [Product Category] with AI-Powered Features',
          angles: [
            'Industry disruption and innovation',
            'Global accessibility and multi-language support',
            'Small business empowerment',
            'AI democratization'
          ]
        },
        mediaKit: {
          assets: ['logo-variations', 'product-screenshots', 'founder-photos', 'infographics'],
          factSheet: 'Key statistics and company background',
          quotes: 'Executive and customer quotes ready for use'
        }
      },
      content: [
        {
          type: 'blog-series',
          title: 'The Future of [Industry]: How AI is Changing Everything',
          posts: [
            'Current state of the industry',
            'Emerging AI technologies',
            'Implementation strategies',
            'Success stories and case studies'
          ]
        },
        {
          type: 'webinar-series',
          title: 'Mastering AI-Powered [Industry] Automation',
          sessions: [
            'Introduction to AI automation',
            'Hands-on implementation workshop',
            'Advanced strategies and optimization',
            'Q&A with industry experts'
          ]
        }
      ],
      ads: {
        google: {
          campaigns: [
            {
              type: 'search',
              keywords: ['ai marketing automation', 'marketing tools', 'business automation'],
              ad_copy: 'Revolutionary AI marketing platform. Start free trial today.'
            },
            {
              type: 'display',
              audiences: ['marketing-professionals', 'business-decision-makers'],
              creative: 'Visual ads showcasing key features'
            }
          ]
        },
        facebook: {
          campaigns: [
            {
              type: 'awareness',
              objective: 'brand-awareness',
              audiences: ['lookalike-customers', 'interest-based'],
              creative: 'Video demonstrations and testimonials'
            },
            {
              type: 'conversion',
              objective: 'conversions',
              audiences: ['website-visitors', 'engaged-users'],
              creative: 'Direct response ads with clear CTAs'
            }
          ]
        }
      }
    },
    automation: {
      rules: [
        {
          id: 'social-autopilot',
          name: 'Social Media Autopilot',
          trigger: 'schedule',
          action: 'post-content',
          conditions: { active_campaign: true },
          config: {
            platforms: ['linkedin', 'twitter', 'facebook'],
            frequency: 'daily',
            optimal_times: true,
            content_rotation: true
          }
        },
        {
          id: 'email-automation',
          name: 'Email Sequence Automation',
          trigger: 'user-action',
          action: 'send-email',
          conditions: { trigger_events: ['signup', 'download', 'demo-request'] },
          config: {
            sequences: ['welcome', 'nurture', 'conversion'],
            personalization: true,
            a_b_testing: true
          }
        },
        {
          id: 'lead-scoring',
          name: 'Automated Lead Scoring',
          trigger: 'user-activity',
          action: 'update-score',
          conditions: { engagement_threshold: 50 },
          config: {
            scoring_factors: ['email-opens', 'website-visits', 'content-downloads'],
            notification_threshold: 80,
            sales_handoff: true
          }
        }
      ],
      schedule: {
        type: 'scheduled',
        startDate: 'launch-date',
        frequency: 'continuous',
        times: ['09:00', '13:00', '17:00']
      }
    },
    metrics: {
      expectedReach: 500000,
      expectedConversion: 2.5,
      estimatedROI: 350
    }
  },
  {
    id: 'beta-launch-campaign',
    name: 'Beta Launch Campaign',
    type: 'beta-launch',
    description: 'Targeted campaign for beta product launches with early adopter focus',
    channels: ['email', 'social', 'content'],
    duration: 21,
    targetAudience: ['early-adopters', 'tech-enthusiasts', 'power-users'],
    content: {
      email: {
        sequences: [
          {
            name: 'Beta Invitation Series',
            emails: [
              {
                day: -7,
                subject: 'You\'re Invited: Join Our Exclusive Beta Program',
                type: 'invitation',
                content: 'Exclusive beta access with early bird benefits'
              },
              {
                day: 0,
                subject: 'Welcome to the Beta! Your Early Access Starts Now',
                type: 'welcome',
                content: 'Onboarding and getting started guide'
              },
              {
                day: 7,
                subject: 'Your Feedback is Shaping the Future',
                type: 'engagement',
                content: 'Feedback request and feature updates'
              },
              {
                day: 14,
                subject: 'Beta Success Stories + What\'s Coming Next',
                type: 'progress-update',
                content: 'User success stories and roadmap preview'
              }
            ]
          }
        ]
      },
      social: {
        focus: 'community-building',
        platforms: ['linkedin', 'twitter', 'reddit'],
        content_themes: ['behind-the-scenes', 'user-feedback', 'product-development']
      },
      content: [
        {
          type: 'video-series',
          title: 'Beta Diaries: Building the Future Together',
          episodes: [
            'Meet the team and vision',
            'Beta user spotlight',
            'Feature development process',
            'Community feedback integration'
          ]
        }
      ]
    },
    automation: {
      rules: [
        {
          id: 'beta-user-onboarding',
          name: 'Beta User Onboarding',
          trigger: 'beta-signup',
          action: 'start-onboarding-sequence',
          conditions: { user_status: 'beta-approved' },
          config: {
            sequence_length: 14,
            touchpoints: ['email', 'in-app', 'community'],
            success_metrics: ['feature-adoption', 'feedback-submission']
          }
        }
      ],
      schedule: {
        type: 'immediate',
        frequency: 'event-driven'
      }
    },
    metrics: {
      expectedReach: 50000,
      expectedConversion: 8.0,
      estimatedROI: 200
    }
  },
  {
    id: 'regional-expansion',
    name: 'Regional Market Expansion',
    type: 'market-expansion',
    description: 'Localized campaign for entering new geographic markets',
    channels: ['email', 'social', 'pr', 'partnerships'],
    duration: 60,
    targetAudience: ['local-businesses', 'regional-partners', 'market-influencers'],
    content: {
      localization: {
        required: true,
        languages: ['local-language', 'english'],
        cultural_adaptation: true,
        local_partnerships: true
      },
      email: {
        focus: 'local-market-education',
        sequences: ['market-introduction', 'local-success-stories', 'partnership-opportunities']
      },
      social: {
        platforms: ['local-preferred-platforms', 'linkedin', 'facebook'],
        content_themes: ['local-market-insights', 'cultural-relevance', 'community-building']
      },
      pr: {
        focus: 'local-media-relations',
        strategies: ['local-press-releases', 'industry-publications', 'influencer-partnerships']
      }
    },
    automation: {
      rules: [
        {
          id: 'geo-targeted-messaging',
          name: 'Geographic Message Targeting',
          trigger: 'user-location',
          action: 'customize-content',
          conditions: { target_regions: ['specified-markets'] },
          config: {
            localization_level: 'full',
            timezone_optimization: true,
            currency_adaptation: true
          }
        }
      ],
      schedule: {
        type: 'scheduled',
        frequency: 'timezone-optimized'
      }
    },
    metrics: {
      expectedReach: 200000,
      expectedConversion: 3.2,
      estimatedROI: 280
    }
  },
  {
    id: 'feature-announcement',
    name: 'Major Feature Announcement',
    type: 'feature-launch',
    description: 'Campaign for announcing significant new features to existing user base',
    channels: ['email', 'in-app', 'social', 'content'],
    duration: 14,
    targetAudience: ['existing-users', 'trial-users', 'churned-users'],
    content: {
      email: {
        segments: {
          'power-users': 'Advanced feature capabilities and use cases',
          'casual-users': 'Simplified benefits and easy adoption',
          'trial-users': 'Upgrade incentives and value demonstration',
          'churned-users': 'Win-back with new value proposition'
        }
      },
      in_app: {
        announcements: ['feature-tour', 'tutorial-videos', 'help-documentation'],
        ui_elements: ['feature-highlights', 'tooltip-guidance', 'progress-tracking']
      },
      social: {
        focus: 'feature-demonstration',
        content_types: ['demo-videos', 'user-reactions', 'use-case-examples']
      }
    },
    automation: {
      rules: [
        {
          id: 'feature-adoption-tracking',
          name: 'Feature Adoption Tracking',
          trigger: 'feature-usage',
          action: 'update-user-journey',
          conditions: { feature_interaction: true },
          config: {
            tracking_events: ['feature-discovery', 'first-use', 'regular-usage'],
            success_milestones: ['adoption', 'mastery', 'advocacy'],
            follow_up_sequences: true
          }
        }
      ],
      schedule: {
        type: 'immediate',
        frequency: 'user-behavior-driven'
      }
    },
    metrics: {
      expectedReach: 100000,
      expectedConversion: 15.0,
      estimatedROI: 450
    }
  },
  {
    id: 'competitive-response',
    name: 'Competitive Response Campaign',
    type: 'competitive',
    description: 'Rapid response campaign to competitive threats or market opportunities',
    channels: ['social', 'pr', 'content', 'ads'],
    duration: 7,
    targetAudience: ['competitor-users', 'decision-makers', 'industry-influencers'],
    content: {
      messaging: {
        strategy: 'differentiation-focused',
        themes: ['unique-value-proposition', 'superior-features', 'better-pricing'],
        tone: 'confident-but-respectful'
      },
      social: {
        response_speed: 'immediate',
        platforms: ['twitter', 'linkedin'],
        content_types: ['comparison-charts', 'feature-highlights', 'customer-testimonials']
      },
      pr: {
        rapid_response: true,
        media_targets: ['industry-publications', 'tech-media', 'business-press'],
        positioning: 'market-leader-response'
      }
    },
    automation: {
      rules: [
        {
          id: 'competitor-monitoring',
          name: 'Competitive Intelligence Monitoring',
          trigger: 'market-activity',
          action: 'alert-and-respond',
          conditions: { competitor_actions: ['price-changes', 'feature-launches', 'marketing-campaigns'] },
          config: {
            monitoring_sources: ['social-media', 'press-releases', 'website-changes'],
            response_time: 'within-hours',
            escalation_rules: true
          }
        }
      ],
      schedule: {
        type: 'immediate',
        frequency: 'real-time-monitoring'
      }
    },
    metrics: {
      expectedReach: 75000,
      expectedConversion: 5.5,
      estimatedROI: 320
    }
  }
]

export const CONTENT_TEMPLATES = {
  email: {
    subjects: {
      launch: [
        "🚀 We're LIVE! Introducing [Product Name]",
        "The wait is over - [Product Name] is here!",
        "Your [Industry] game is about to change",
        "Breaking: Revolutionary [Product Category] just launched"
      ],
      demo: [
        "See [Product Name] in action (5-min demo)",
        "Watch this before your competitors do",
        "Live demo: How [Product Name] works",
        "Demo request: See the magic yourself"
      ],
      social_proof: [
        "Join 10,000+ users who've transformed their [Industry]",
        "Why [Company Name] chose [Product Name]",
        "Success story: How [Client] achieved [Result]",
        "Don't just take our word for it..."
      ]
    },
    templates: {
      welcome: `
        Welcome to [Product Name]!
        
        Thank you for joining thousands of [Industry] professionals who are revolutionizing their [Process] with AI.
        
        Here's what you can expect:
        ✅ [Benefit 1]
        ✅ [Benefit 2] 
        ✅ [Benefit 3]
        
        Ready to get started?
        [CTA Button: Start Your Journey]
        
        Questions? Reply to this email - we're here to help!
      `,
      demo: `
        Ready to see [Product Name] in action?
        
        We've prepared a personalized demo just for you:
        
        🎬 [Demo Link]
        
        In just 5 minutes, you'll see how to:
        • [Key Feature 1]
        • [Key Feature 2]
        • [Key Feature 3]
        
        Plus, book a live walkthrough and get:
        💰 [Incentive 1]
        🎁 [Incentive 2]
        📚 [Incentive 3]
        
        [CTA Button: Watch Demo Now]
      `
    }
  },
  social: {
    linkedin: {
      announcement: `
        🚀 Excited to announce the launch of [Product Name]!
        
        After [Timeframe] of development, we're ready to revolutionize [Industry] with AI-powered [Category].
        
        What sets us apart:
        ✅ [Differentiator 1]
        ✅ [Differentiator 2]
        ✅ [Differentiator 3]
        
        Join the waitlist and be among the first to experience the future of [Industry].
        
        #[Industry]Innovation #AI #[ProductCategory]
      `,
      thought_leadership: `
        The [Industry] landscape is evolving rapidly.
        
        Here's what we're seeing:
        📈 [Trend 1]
        🔄 [Trend 2]
        💡 [Trend 3]
        
        How is your organization adapting?
        
        [Product Name] addresses these challenges by [Solution].
        
        What trends are you noticing? Share in the comments.
      `
    },
    twitter: {
      launch: `
        🔥 LAUNCH DAY! 
        
        Introducing [Product Name] - the AI [Category] that [Benefit].
        
        ✨ [Feature 1]
        🚀 [Feature 2]  
        💯 [Feature 3]
        
        Start your free trial → [Link]
        
        #[ProductName]Launch #AI[Industry] #Innovation
      `,
      engagement: `
        Quick question for [Industry] professionals:
        
        What's your biggest challenge with [Process]?
        
        A) [Challenge 1]
        B) [Challenge 2]
        C) [Challenge 3]
        D) Something else?
        
        [Product Name] tackles all of these. Tell us yours! 👇
      `
    }
  },
  press: {
    headline_templates: [
      "[Company] Launches Revolutionary [Product Category] with AI-Powered [Feature]",
      "[Company] Introduces [Product Name]: The First [Unique Selling Point]",
      "New [Product Category] from [Company] Democratizes [Complex Process] for [Target Market]",
      "[Company] Disrupts [Industry] with Launch of AI-Powered [Product Name]"
    ],
    body_structure: `
      [Location, Date] - [Company], [company description], today announced the launch of [Product Name], [product description]. [Key differentiator and market position].
      
      [Market context and problem statement]
      
      "[Quote from CEO about vision and mission]," said [CEO Name], [Title] of [Company].
      
      Key features include:
      • [Feature 1 with benefit]
      • [Feature 2 with benefit] 
      • [Feature 3 with benefit]
      
      [Market opportunity and timing]
      
      "[Customer/Partner quote about impact]," said [Customer Name], [Title] at [Company].
      
      [Availability and pricing information]
      
      About [Company]:
      [Company background and mission]
      
      For more information, visit [website]
      
      Media Contact:
      [Contact information]
    `
  }
}

export const AUTOMATION_WORKFLOWS = {
  social_autopilot: {
    name: 'Social Media Autopilot',
    description: 'Automatically post content across social platforms with optimal timing',
    config: {
      platforms: ['linkedin', 'twitter', 'facebook', 'instagram'],
      posting_frequency: {
        linkedin: '1-2 times per day',
        twitter: '3-5 times per day',
        facebook: '1 time per day',
        instagram: '1 time per day + stories'
      },
      optimal_timing: true,
      content_rotation: true,
      hashtag_optimization: true
    }
  },
  email_nurture: {
    name: 'Email Nurture Automation',
    description: 'Automated email sequences based on user behavior and preferences',
    config: {
      trigger_events: ['signup', 'demo_request', 'trial_start', 'feature_use'],
      sequences: ['welcome', 'education', 'activation', 'retention'],
      personalization: true,
      send_time_optimization: true,
      a_b_testing: true
    }
  },
  lead_scoring: {
    name: 'Intelligent Lead Scoring',
    description: 'Automatically score and qualify leads based on engagement',
    config: {
      scoring_factors: {
        email_engagement: 20,
        website_activity: 25,
        content_downloads: 15,
        demo_requests: 30,
        social_engagement: 10
      },
      qualification_threshold: 75,
      sales_notification: true,
      automatic_segmentation: true
    }
  }
}

export function getCampaignTemplate(templateId: string): CampaignTemplate | undefined {
  return LAUNCH_CAMPAIGN_TEMPLATES.find(template => template.id === templateId)
}

export function getTemplatesByType(type: string): CampaignTemplate[] {
  return LAUNCH_CAMPAIGN_TEMPLATES.filter(template => template.type === type)
}

export function getContentTemplate(channel: string, type: string): any {
  return CONTENT_TEMPLATES[channel as keyof typeof CONTENT_TEMPLATES]?.[type] || null
}