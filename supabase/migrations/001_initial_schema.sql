-- NexusOne AI Platform Database Schema
-- Global Marketing Automation & AI Platform

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create custom types
CREATE TYPE user_plan AS ENUM ('free', 'pro', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'incomplete');
CREATE TYPE module_type AS ENUM ('magic_pages', 'video_creator', 'facebook_ads', 'whatsapp_bot', 'ai_agents', 'product_scraper', 'crm', 'generate_income', 'tiktok_ads', 'youtube_automation');
CREATE TYPE language_code AS ENUM ('en', 'es', 'pt', 'ar', 'he');
CREATE TYPE transaction_type AS ENUM ('purchase', 'usage', 'refund', 'bonus');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    plan user_plan DEFAULT 'free',
    language language_code DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    credits INTEGER DEFAULT 50,
    video_quota INTEGER DEFAULT 2,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan user_plan NOT NULL,
    status subscription_status DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    price_id TEXT,
    amount INTEGER NOT NULL, -- in cents
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credits transactions
CREATE TABLE public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount INTEGER NOT NULL,
    remaining_credits INTEGER NOT NULL,
    description TEXT,
    module_used module_type,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Generated Content
CREATE TABLE public.ai_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    module module_type NOT NULL,
    content_type TEXT NOT NULL, -- 'text', 'image', 'video', 'landing_page'
    title TEXT,
    content JSONB NOT NULL,
    language language_code DEFAULT 'en',
    credits_used INTEGER DEFAULT 0,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Landing Pages
CREATE TABLE public.landing_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL,
    theme TEXT DEFAULT 'modern',
    language language_code DEFAULT 'en',
    is_published BOOLEAN DEFAULT FALSE,
    custom_domain TEXT,
    seo_meta JSONB,
    analytics_data JSONB,
    conversion_tracking JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp Integrations
CREATE TABLE public.whatsapp_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    display_name TEXT,
    business_account_id TEXT,
    access_token TEXT,
    webhook_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp Campaigns
CREATE TABLE public.whatsapp_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    whatsapp_account_id UUID NOT NULL REFERENCES public.whatsapp_accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    message_template JSONB NOT NULL,
    target_audience JSONB,
    schedule_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'running', 'completed', 'paused'
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    read_count INTEGER DEFAULT 0,
    replied_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRM Contacts
CREATE TABLE public.crm_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    position TEXT,
    lead_source TEXT,
    lead_status TEXT DEFAULT 'new',
    lead_score INTEGER DEFAULT 0,
    tags TEXT[],
    custom_fields JSONB,
    last_contact TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-commerce Products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    sku TEXT,
    supplier_info JSONB,
    images TEXT[],
    variants JSONB,
    inventory_quantity INTEGER DEFAULT 0,
    is_dropshipping BOOLEAN DEFAULT FALSE,
    supplier_product_id TEXT,
    category TEXT,
    tags TEXT[],
    seo_meta JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Agents
CREATE TABLE public.ai_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    personality JSONB NOT NULL,
    knowledge_base JSONB,
    capabilities TEXT[],
    language language_code DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    usage_stats JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Facebook Ad Campaigns
CREATE TABLE public.facebook_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    campaign_name TEXT NOT NULL,
    objective TEXT NOT NULL,
    target_audience JSONB NOT NULL,
    ad_creative JSONB NOT NULL,
    budget_type TEXT DEFAULT 'daily', -- 'daily', 'lifetime'
    budget_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    facebook_campaign_id TEXT,
    status TEXT DEFAULT 'draft',
    performance_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video Generation Jobs
CREATE TABLE public.video_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    script JSONB NOT NULL,
    style_preferences JSONB,
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    video_url TEXT,
    thumbnail_url TEXT,
    duration INTEGER, -- in seconds
    processing_logs JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys and Integrations
CREATE TABLE public.user_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL, -- 'facebook', 'google', 'openai', etc.
    api_credentials JSONB NOT NULL, -- encrypted
    is_active BOOLEAN DEFAULT TRUE,
    last_sync TIMESTAMP WITH TIME ZONE,
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_name)
);

-- Usage Analytics
CREATE TABLE public.usage_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    module module_type NOT NULL,
    action TEXT NOT NULL,
    credits_consumed INTEGER DEFAULT 0,
    processing_time INTEGER, -- in milliseconds
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Settings
CREATE TABLE public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facebook_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see and edit their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own subscriptions" ON public.subscriptions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own credit transactions" ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own AI content" ON public.ai_content
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own landing pages" ON public.landing_pages
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view published landing pages" ON public.landing_pages
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can manage own WhatsApp accounts" ON public.whatsapp_accounts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own WhatsApp campaigns" ON public.whatsapp_campaigns
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own CRM contacts" ON public.crm_contacts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own products" ON public.products
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own AI agents" ON public.ai_agents
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own Facebook campaigns" ON public.facebook_campaigns
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own video jobs" ON public.video_jobs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own integrations" ON public.user_integrations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage analytics" ON public.usage_analytics
    FOR SELECT USING (auth.uid() = user_id);

-- System settings readable by all authenticated users
CREATE POLICY "Authenticated users can read system settings" ON public.system_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX idx_users_plan ON public.users(plan);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions(created_at);
CREATE INDEX idx_ai_content_user_id ON public.ai_content(user_id);
CREATE INDEX idx_ai_content_module ON public.ai_content(module);
CREATE INDEX idx_landing_pages_user_id ON public.landing_pages(user_id);
CREATE INDEX idx_landing_pages_slug ON public.landing_pages(slug);
CREATE INDEX idx_landing_pages_is_published ON public.landing_pages(is_published);
CREATE INDEX idx_whatsapp_accounts_user_id ON public.whatsapp_accounts(user_id);
CREATE INDEX idx_whatsapp_campaigns_user_id ON public.whatsapp_campaigns(user_id);
CREATE INDEX idx_crm_contacts_user_id ON public.crm_contacts(user_id);
CREATE INDEX idx_crm_contacts_email ON public.crm_contacts(email);
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_ai_agents_user_id ON public.ai_agents(user_id);
CREATE INDEX idx_facebook_campaigns_user_id ON public.facebook_campaigns(user_id);
CREATE INDEX idx_video_jobs_user_id ON public.video_jobs(user_id);
CREATE INDEX idx_video_jobs_status ON public.video_jobs(status);
CREATE INDEX idx_user_integrations_user_id ON public.user_integrations(user_id);
CREATE INDEX idx_usage_analytics_user_id ON public.usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_created_at ON public.usage_analytics(created_at);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_content_updated_at BEFORE UPDATE ON public.ai_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON public.landing_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_accounts_updated_at BEFORE UPDATE ON public.whatsapp_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_campaigns_updated_at BEFORE UPDATE ON public.whatsapp_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON public.crm_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON public.ai_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_facebook_campaigns_updated_at BEFORE UPDATE ON public.facebook_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_video_jobs_updated_at BEFORE UPDATE ON public.video_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_integrations_updated_at BEFORE UPDATE ON public.user_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to manage credits
CREATE OR REPLACE FUNCTION public.consume_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_module module_type,
    p_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
    new_credits INTEGER;
BEGIN
    -- Get current credits
    SELECT credits INTO current_credits
    FROM public.users
    WHERE id = p_user_id;
    
    -- Check if user has enough credits
    IF current_credits < p_amount THEN
        RETURN FALSE;
    END IF;
    
    -- Calculate new credits
    new_credits := current_credits - p_amount;
    
    -- Update user credits
    UPDATE public.users
    SET credits = new_credits
    WHERE id = p_user_id;
    
    -- Log transaction
    INSERT INTO public.credit_transactions (
        user_id,
        type,
        amount,
        remaining_credits,
        description,
        module_used
    ) VALUES (
        p_user_id,
        'usage',
        -p_amount,
        new_credits,
        p_description,
        p_module
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to add credits
CREATE OR REPLACE FUNCTION public.add_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_description TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    current_credits INTEGER;
    new_credits INTEGER;
BEGIN
    -- Get current credits
    SELECT credits INTO current_credits
    FROM public.users
    WHERE id = p_user_id;
    
    -- Calculate new credits
    new_credits := current_credits + p_amount;
    
    -- Update user credits
    UPDATE public.users
    SET credits = new_credits
    WHERE id = p_user_id;
    
    -- Log transaction
    INSERT INTO public.credit_transactions (
        user_id,
        type,
        amount,
        remaining_credits,
        description
    ) VALUES (
        p_user_id,
        'purchase',
        p_amount,
        new_credits,
        p_description
    );
END;
$$ LANGUAGE plpgsql;

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description) VALUES
    ('credit_costs', '{
        "magic_pages": 10,
        "video_creator": 25,
        "facebook_ads": 15,
        "whatsapp_bot": 5,
        "ai_agents": 20,
        "product_scraper": 3,
        "crm": 5,
        "generate_income": 8,
        "tiktok_ads": 15,
        "youtube_automation": 12
    }', 'Credit costs per module usage'),
    ('plan_limits', '{
        "free": {"credits": 50, "videos": 2, "landing_pages": 2, "whatsapp_numbers": 1},
        "pro": {"credits": 500, "videos": 20, "landing_pages": 20, "whatsapp_numbers": 5},
        "premium": {"credits": 2000, "videos": 100, "landing_pages": -1, "whatsapp_numbers": 20}
    }', 'Limits for each subscription plan'),
    ('api_configurations', '{
        "openai": {"model": "gpt-4", "max_tokens": 4000},
        "d_id": {"quality": "high", "format": "mp4"},
        "elevenlabs": {"voice": "default", "model": "eleven_multilingual_v2"},
        "replicate": {"model": "stability-ai/sdxl"},
        "runware": {"steps": 25, "guidance": 7.5}
    }', 'Default API configurations for AI services');