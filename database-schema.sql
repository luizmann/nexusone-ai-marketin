-- NexusOneAI Database Schema
-- Complete schema for the AI Marketing Automation Platform

-- ====================================================
-- CORE AUTHENTICATION & USER MANAGEMENT
-- ====================================================

-- User profiles and subscription management
create table if not exists public.user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  email text unique not null,
  full_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro', 'premium')),
  credits integer default 50,
  video_quota integer default 2,
  whatsapp_numbers integer default 1,
  subscription_status text default 'active',
  subscription_id text,
  billing_cycle text default 'monthly',
  trial_ends_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- API configurations per user
create table if not exists public.api_configurations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(user_id) not null,
  service text not null,
  api_key text not null,
  config jsonb default '{}',
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, service)
);

-- Usage tracking and billing
create table if not exists public.usage_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(user_id) not null,
  action text not null,
  credits_used integer default 0,
  api_service text,
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- MARKETING CAMPAIGNS
-- ====================================================

-- Main campaigns table
create table if not exists public.campaigns (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(user_id) not null,
  name text not null,
  type text not null check (type in ('magic_page', 'video', 'facebook_ads', 'whatsapp', 'full_funnel')),
  status text default 'draft' check (status in ('draft', 'active', 'paused', 'completed', 'failed')),
  config jsonb default '{}',
  metrics jsonb default '{}',
  product_url text,
  target_audience jsonb default '{}',
  budget_daily numeric(10,2),
  budget_total numeric(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Campaign performance metrics
create table if not exists public.campaign_metrics (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references public.campaigns(id) not null,
  date date not null,
  impressions integer default 0,
  clicks integer default 0,
  conversions integer default 0,
  spend numeric(10,2) default 0,
  revenue numeric(10,2) default 0,
  ctr numeric(5,4) default 0,
  cpc numeric(10,2) default 0,
  roas numeric(5,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(campaign_id, date)
);

-- ====================================================
-- MAGIC PAGES (LANDING PAGES)
-- ====================================================

create table if not exists public.magic_pages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(user_id) not null,
  campaign_id uuid references public.campaigns(id),
  title text not null,
  slug text unique not null,
  content jsonb default '{}',
  product_url text,
  product_data jsonb default '{}',
  template text default 'modern',
  seo_title text,
  seo_description text,
  seo_keywords text[],
  views integer default 0,
  unique_views integer default 0,
  conversions integer default 0,
  conversion_rate numeric(5,2) default 0,
  published boolean default false,
  custom_domain text,
  analytics_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Page analytics and tracking
create table if not exists public.page_analytics (
  id uuid default gen_random_uuid() primary key,
  page_id uuid references public.magic_pages(id) not null,
  visitor_id text not null,
  session_id text not null,
  event_type text not null check (event_type in ('view', 'click', 'conversion', 'bounce')),
  element_id text,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  user_agent text,
  ip_address inet,
  country text,
  city text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  metadata jsonb default '{}'
);

-- ====================================================
-- AI VIDEO GENERATION
-- ====================================================

create table if not exists public.videos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(user_id) not null,
  campaign_id uuid references public.campaigns(id),
  title text not null,
  type text not null check (type in ('product_demo', 'social_short', 'avatar_promo', 'explainer')),
  status text default 'generating' check (status in ('queued', 'generating', 'completed', 'failed')),
  ai_provider text not null check (ai_provider in ('luma', 'runway', 'did', 'custom')),
  url text,
  thumbnail text,
  duration integer, -- in seconds
  aspect_ratio text default '16:9',
  quality text default 'hd' check (quality in ('sd', 'hd', '4k')),
  file_size bigint, -- in bytes
  config jsonb default '{}',
  generation_params jsonb default '{}',
  error_message text,
  views integer default 0,
  downloads integer default 0,
  shares integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- WHATSAPP AUTOMATION
-- ====================================================

create table if not exists public.whatsapp_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(user_id) not null,
  phone_number text not null,
  session_name text,
  qr_code text,
  session_data jsonb default '{}',
  status text default 'disconnected' check (status in ('connecting', 'connected', 'disconnected', 'failed')),
  webhook_url text,
  auto_reply_enabled boolean default false,
  business_hours jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, phone_number)
);

create table if not exists public.whatsapp_conversations (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.whatsapp_sessions(id) not null,
  contact_number text not null,
  contact_name text,
  last_message text,
  message_count integer default 0,
  status text default 'active' check (status in ('active', 'archived', 'blocked')),
  labels text[] default '{}',
  lead_score integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.whatsapp_messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.whatsapp_conversations(id) not null,
  message_id text unique not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  type text not null check (type in ('text', 'image', 'video', 'audio', 'document', 'location')),
  content text,
  media_url text,
  status text default 'sent' check (status in ('sent', 'delivered', 'read', 'failed')),
  is_ai_generated boolean default false,
  ai_confidence numeric(3,2),
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- DROPSHIPPING & E-COMMERCE
-- ====================================================

create table if not exists public.dropshipping_products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(user_id) not null,
  cj_product_id text unique not null,
  title text not null,
  description text,
  category text,
  subcategory text,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  currency text default 'USD',
  images text[] default '{}',
  variants jsonb default '{}',
  specifications jsonb default '{}',
  supplier_info jsonb default '{}',
  shipping_info jsonb default '{}',
  stock_quantity integer default 0,
  min_order_quantity integer default 1,
  rating numeric(3,2),
  review_count integer default 0,
  tags text[] default '{}',
  status text default 'active' check (status in ('active', 'inactive', 'out_of_stock')),
  profit_margin numeric(5,2) default 30,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.dropshipping_orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(user_id) not null,
  product_id uuid references public.dropshipping_products(id) not null,
  customer_email text not null,
  customer_name text,
  customer_phone text,
  shipping_address jsonb not null,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  total_amount numeric(10,2) not null,
  commission_amount numeric(10,2) not null,
  cj_order_id text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded')),
  tracking_number text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- CRM & LEAD MANAGEMENT
-- ====================================================

create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(user_id) not null,
  campaign_id uuid references public.campaigns(id),
  page_id uuid references public.magic_pages(id),
  email text,
  phone text,
  name text,
  source text not null check (source in ('magic_page', 'whatsapp', 'facebook', 'manual', 'api')),
  status text default 'new' check (status in ('new', 'contacted', 'qualified', 'converted', 'lost')),
  score integer default 0 check (score >= 0 and score <= 100),
  tags text[] default '{}',
  custom_fields jsonb default '{}',
  notes text,
  last_contacted timestamp with time zone,
  conversion_date timestamp with time zone,
  conversion_value numeric(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.lead_activities (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references public.leads(id) not null,
  type text not null check (type in ('email', 'call', 'whatsapp', 'note', 'status_change')),
  description text not null,
  metadata jsonb default '{}',
  created_by uuid references public.user_profiles(user_id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- FACEBOOK ADS INTEGRATION
-- ====================================================

create table if not exists public.facebook_campaigns (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(user_id) not null,
  campaign_id uuid references public.campaigns(id),
  facebook_campaign_id text unique,
  facebook_adset_id text,
  facebook_ad_id text,
  name text not null,
  objective text not null,
  status text default 'draft' check (status in ('draft', 'active', 'paused', 'deleted')),
  daily_budget numeric(10,2),
  lifetime_budget numeric(10,2),
  targeting jsonb default '{}',
  creative jsonb default '{}',
  performance_metrics jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- SYSTEM ADMINISTRATION
-- ====================================================

create table if not exists public.system_settings (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value jsonb not null,
  description text,
  updated_by uuid references public.user_profiles(user_id),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(user_id),
  action text not null,
  table_name text,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================
-- INDEXES FOR PERFORMANCE
-- ====================================================

-- User profiles indexes
create index if not exists idx_user_profiles_user_id on public.user_profiles(user_id);
create index if not exists idx_user_profiles_email on public.user_profiles(email);
create index if not exists idx_user_profiles_plan on public.user_profiles(plan);

-- Campaigns indexes
create index if not exists idx_campaigns_user_id on public.campaigns(user_id);
create index if not exists idx_campaigns_status on public.campaigns(status);
create index if not exists idx_campaigns_type on public.campaigns(type);

-- Magic pages indexes
create index if not exists idx_magic_pages_user_id on public.magic_pages(user_id);
create index if not exists idx_magic_pages_slug on public.magic_pages(slug);
create index if not exists idx_magic_pages_published on public.magic_pages(published);

-- Videos indexes
create index if not exists idx_videos_user_id on public.videos(user_id);
create index if not exists idx_videos_status on public.videos(status);
create index if not exists idx_videos_type on public.videos(type);

-- WhatsApp indexes
create index if not exists idx_whatsapp_sessions_user_id on public.whatsapp_sessions(user_id);
create index if not exists idx_whatsapp_conversations_session_id on public.whatsapp_conversations(session_id);
create index if not exists idx_whatsapp_messages_conversation_id on public.whatsapp_messages(conversation_id);

-- Leads indexes
create index if not exists idx_leads_user_id on public.leads(user_id);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_source on public.leads(source);
create index if not exists idx_leads_email on public.leads(email);

-- Usage logs indexes
create index if not exists idx_usage_logs_user_id on public.usage_logs(user_id);
create index if not exists idx_usage_logs_created_at on public.usage_logs(created_at);

-- ====================================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================================

-- Enable RLS on all tables
alter table public.user_profiles enable row level security;
alter table public.api_configurations enable row level security;
alter table public.usage_logs enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_metrics enable row level security;
alter table public.magic_pages enable row level security;
alter table public.page_analytics enable row level security;
alter table public.videos enable row level security;
alter table public.whatsapp_sessions enable row level security;
alter table public.whatsapp_conversations enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.dropshipping_products enable row level security;
alter table public.dropshipping_orders enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.facebook_campaigns enable row level security;

-- RLS Policies
create policy "Users can view own profile" on public.user_profiles for select using (auth.uid() = user_id);
create policy "Users can update own profile" on public.user_profiles for update using (auth.uid() = user_id);

create policy "Users can manage own data" on public.campaigns for all using (auth.uid() = user_id);
create policy "Users can manage own data" on public.magic_pages for all using (auth.uid() = user_id);
create policy "Users can manage own data" on public.videos for all using (auth.uid() = user_id);
create policy "Users can manage own data" on public.whatsapp_sessions for all using (auth.uid() = user_id);
create policy "Users can manage own data" on public.leads for all using (auth.uid() = user_id);

-- Public access for published magic pages
create policy "Public can view published pages" on public.magic_pages for select using (published = true);

-- ====================================================
-- FUNCTIONS AND TRIGGERS
-- ====================================================

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Apply update triggers to all relevant tables
create trigger handle_updated_at before update on public.user_profiles for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.campaigns for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.magic_pages for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.videos for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.whatsapp_sessions for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.leads for each row execute procedure public.handle_updated_at();

-- Function to create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (user_id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to calculate conversion rates
create or replace function public.update_page_conversion_rate()
returns trigger as $$
begin
  update public.magic_pages 
  set conversion_rate = case 
    when views > 0 then (conversions::numeric / views) * 100 
    else 0 
  end
  where id = new.page_id;
  return new;
end;
$$ language plpgsql;

-- ====================================================
-- INITIAL DATA
-- ====================================================

-- Insert default system settings
insert into public.system_settings (key, value, description) values
  ('max_free_credits', '50', 'Maximum credits for free plan'),
  ('max_pro_credits', '500', 'Maximum credits for pro plan'),
  ('max_premium_credits', '2000', 'Maximum credits for premium plan'),
  ('credit_reset_day', '1', 'Day of month to reset credits'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('new_user_bonus_credits', '10', 'Bonus credits for new users')
on conflict (key) do nothing;

-- ====================================================
-- COMMENTS FOR DOCUMENTATION
-- ====================================================

comment on table public.user_profiles is 'User profiles and subscription information';
comment on table public.campaigns is 'Marketing campaigns created by users';
comment on table public.magic_pages is 'AI-generated landing pages';
comment on table public.videos is 'AI-generated videos';
comment on table public.whatsapp_sessions is 'WhatsApp Business API sessions';
comment on table public.leads is 'Lead management and CRM data';
comment on table public.dropshipping_products is 'Products available for dropshipping';
comment on table public.usage_logs is 'API usage tracking for billing';

comment on column public.user_profiles.credits is 'Available AI credits for the user';
comment on column public.user_profiles.video_quota is 'Monthly video generation quota';
comment on column public.magic_pages.conversion_rate is 'Conversion rate percentage';
comment on column public.leads.score is 'Lead scoring from 0-100';
comment on column public.videos.duration is 'Video duration in seconds';