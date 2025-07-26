-- Launch Campaign Management Tables
-- This file contains the database schema for automated marketing campaigns

-- Campaign Templates Table
CREATE TABLE IF NOT EXISTS launch_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_name TEXT NOT NULL,
    campaign_type TEXT NOT NULL DEFAULT 'multi-channel',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'scheduled')),
    
    -- Campaign Configuration
    templates JSONB NOT NULL DEFAULT '{}',
    target_languages TEXT[] DEFAULT ARRAY['en'],
    target_channels TEXT[] DEFAULT ARRAY['email', 'social'],
    target_audience TEXT,
    
    -- Budget and Duration
    budget DECIMAL(10,2) DEFAULT 0,
    duration INTEGER DEFAULT 30, -- days
    
    -- Scheduling
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    activated_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign Content Assets Table
CREATE TABLE IF NOT EXISTS campaign_content_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES launch_campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Content Details
    asset_type TEXT NOT NULL CHECK (asset_type IN ('email', 'social', 'ad', 'video', 'article', 'press')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    
    -- Channel Assignment
    channels TEXT[] DEFAULT ARRAY[],
    platforms TEXT[] DEFAULT ARRAY[], -- specific platforms like 'linkedin', 'facebook'
    
    -- Status and Metadata
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'published', 'generating')),
    metadata JSONB DEFAULT '{}',
    
    -- Performance Tracking
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Campaign Analytics Table
CREATE TABLE IF NOT EXISTS campaign_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES launch_campaigns(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES campaign_content_assets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Metrics
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    channel TEXT NOT NULL,
    platform TEXT,
    
    -- Performance Data
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    
    -- Engagement Metrics
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    
    -- Email Specific
    email_opens INTEGER DEFAULT 0,
    email_bounces INTEGER DEFAULT 0,
    email_unsubscribes INTEGER DEFAULT 0,
    
    -- Geographic Data
    country_code TEXT,
    region TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate daily records
    UNIQUE(campaign_id, asset_id, date, channel, platform)
);

-- Campaign Automation Rules Table
CREATE TABLE IF NOT EXISTS campaign_automation_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES launch_campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Rule Definition
    rule_name TEXT NOT NULL,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('trigger', 'schedule', 'condition', 'action')),
    
    -- Trigger Configuration
    trigger_event TEXT, -- 'user_signup', 'campaign_start', 'time_based', etc.
    trigger_conditions JSONB DEFAULT '{}',
    
    -- Action Configuration
    action_type TEXT NOT NULL, -- 'send_email', 'post_social', 'create_ad', etc.
    action_config JSONB NOT NULL DEFAULT '{}',
    
    -- Scheduling
    schedule_config JSONB DEFAULT '{}', -- cron-like scheduling
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_executed TIMESTAMPTZ,
    execution_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign Performance Summary View
CREATE OR REPLACE VIEW campaign_performance_summary AS
SELECT 
    lc.id as campaign_id,
    lc.campaign_name,
    lc.status,
    lc.user_id,
    
    -- Content Counts
    COUNT(DISTINCT cca.id) as total_assets,
    COUNT(DISTINCT cca.id) FILTER (WHERE cca.status = 'published') as published_assets,
    
    -- Performance Aggregations
    COALESCE(SUM(ca.impressions), 0) as total_impressions,
    COALESCE(SUM(ca.reach), 0) as total_reach,
    COALESCE(SUM(ca.clicks), 0) as total_clicks,
    COALESCE(SUM(ca.conversions), 0) as total_conversions,
    COALESCE(SUM(ca.cost), 0) as total_cost,
    COALESCE(SUM(ca.revenue), 0) as total_revenue,
    
    -- Calculated Metrics
    CASE 
        WHEN SUM(ca.impressions) > 0 
        THEN ROUND((SUM(ca.clicks)::DECIMAL / SUM(ca.impressions)) * 100, 2) 
        ELSE 0 
    END as click_through_rate,
    
    CASE 
        WHEN SUM(ca.clicks) > 0 
        THEN ROUND((SUM(ca.conversions)::DECIMAL / SUM(ca.clicks)) * 100, 2) 
        ELSE 0 
    END as conversion_rate,
    
    CASE 
        WHEN SUM(ca.cost) > 0 
        THEN ROUND(((SUM(ca.revenue) - SUM(ca.cost)) / SUM(ca.cost)) * 100, 2) 
        ELSE 0 
    END as roi_percentage,
    
    -- Date Ranges
    lc.created_at,
    lc.activated_at,
    MIN(ca.date) as first_activity_date,
    MAX(ca.date) as last_activity_date
    
FROM launch_campaigns lc
LEFT JOIN campaign_content_assets cca ON lc.id = cca.campaign_id
LEFT JOIN campaign_analytics ca ON lc.id = ca.campaign_id
GROUP BY lc.id, lc.campaign_name, lc.status, lc.user_id, lc.created_at, lc.activated_at;

-- Row Level Security Policies
ALTER TABLE launch_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_content_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_automation_rules ENABLE ROW LEVEL SECURITY;

-- Users can only access their own campaigns
CREATE POLICY "Users can manage their own campaigns" 
    ON launch_campaigns FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own content assets" 
    ON campaign_content_assets FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics" 
    ON campaign_analytics FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own automation rules" 
    ON campaign_automation_rules FOR ALL 
    USING (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_launch_campaigns_updated_at 
    BEFORE UPDATE ON launch_campaigns 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_content_assets_updated_at 
    BEFORE UPDATE ON campaign_content_assets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_automation_rules_updated_at 
    BEFORE UPDATE ON campaign_automation_rules 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for Performance
CREATE INDEX idx_launch_campaigns_user_id ON launch_campaigns(user_id);
CREATE INDEX idx_launch_campaigns_status ON launch_campaigns(status);
CREATE INDEX idx_campaign_content_assets_campaign_id ON campaign_content_assets(campaign_id);
CREATE INDEX idx_campaign_content_assets_user_id ON campaign_content_assets(user_id);
CREATE INDEX idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);
CREATE INDEX idx_campaign_analytics_date ON campaign_analytics(date);
CREATE INDEX idx_campaign_automation_rules_campaign_id ON campaign_automation_rules(campaign_id);
CREATE INDEX idx_campaign_automation_rules_active ON campaign_automation_rules(is_active);

-- Sample Data for Testing
INSERT INTO launch_campaigns (user_id, campaign_name, campaign_type, status, target_languages, target_channels, target_audience, budget, duration) 
VALUES 
    ((SELECT id FROM auth.users LIMIT 1), 'NexusOne Global Launch', 'multi-channel', 'draft', 
     ARRAY['en', 'es', 'pt'], ARRAY['email', 'social', 'pr'], 'Marketing Professionals', 10000, 30);

-- Get the campaign ID for sample content
WITH sample_campaign AS (
    SELECT id FROM launch_campaigns WHERE campaign_name = 'NexusOne Global Launch' LIMIT 1
)
INSERT INTO campaign_content_assets (campaign_id, user_id, asset_type, title, content, language, channels)
SELECT 
    sc.id,
    (SELECT id FROM auth.users LIMIT 1),
    'email',
    'Welcome to NexusOne',
    'Revolutionary AI-powered marketing platform launching soon!',
    'en',
    ARRAY['email']
FROM sample_campaign sc;

-- Sample automation rule
WITH sample_campaign AS (
    SELECT id FROM launch_campaigns WHERE campaign_name = 'NexusOne Global Launch' LIMIT 1
)
INSERT INTO campaign_automation_rules (campaign_id, user_id, rule_name, rule_type, trigger_event, action_type, action_config)
SELECT 
    sc.id,
    (SELECT id FROM auth.users LIMIT 1),
    'Auto-publish social media',
    'schedule',
    'time_based',
    'post_social',
    '{"frequency": "daily", "platforms": ["linkedin", "twitter"], "times": ["09:00", "17:00"]}'::jsonb
FROM sample_campaign sc;