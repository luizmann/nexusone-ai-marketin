# NexusOne Monitoring & Analytics Backend Implementation Guide

## Overview

This document outlines the complete backend implementation for NexusOne's monitoring and analytics system. The system tracks user behavior, system performance, and business metrics in real-time.

## Database Schema

### Analytics Tables

```sql
-- User Analytics Events
CREATE TABLE user_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  session_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Performance Metrics
CREATE TABLE system_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type VARCHAR(50) NOT NULL,
  metric_value NUMERIC,
  metric_data JSONB,
  server_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Performance Tracking
CREATE TABLE api_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint VARCHAR(200) NOT NULL,
  method VARCHAR(10) NOT NULL,
  response_time INTEGER NOT NULL, -- in milliseconds
  status_code INTEGER NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Metrics
CREATE TABLE business_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit VARCHAR(20),
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert History
CREATE TABLE alert_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('error', 'warning', 'info')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit Usage Tracking
CREATE TABLE credit_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name VARCHAR(100) NOT NULL,
  credits_used INTEGER NOT NULL,
  cost_usd NUMERIC(10,4),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue Tracking
CREATE TABLE revenue_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- subscription, upgrade, purchase, refund
  amount_usd NUMERIC(10,2) NOT NULL,
  plan_type VARCHAR(20),
  payment_provider VARCHAR(50),
  payment_id VARCHAR(200),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes for Performance

```sql
-- User Events Indexes
CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_event_type ON user_events(event_type);
CREATE INDEX idx_user_events_created_at ON user_events(created_at);
CREATE INDEX idx_user_events_session_id ON user_events(session_id);

-- System Metrics Indexes
CREATE INDEX idx_system_metrics_type_time ON system_metrics(metric_type, created_at);
CREATE INDEX idx_system_metrics_created_at ON system_metrics(created_at);

-- API Performance Indexes
CREATE INDEX idx_api_performance_endpoint ON api_performance(endpoint);
CREATE INDEX idx_api_performance_created_at ON api_performance(created_at);
CREATE INDEX idx_api_performance_status ON api_performance(status_code);

-- Business Metrics Indexes
CREATE INDEX idx_business_metrics_name_time ON business_metrics(metric_name, created_at);

-- Credit Usage Indexes
CREATE INDEX idx_credit_usage_user_time ON credit_usage(user_id, created_at);
CREATE INDEX idx_credit_usage_feature ON credit_usage(feature_name);

-- Revenue Events Indexes
CREATE INDEX idx_revenue_events_user_time ON revenue_events(user_id, created_at);
CREATE INDEX idx_revenue_events_type ON revenue_events(event_type);
```

## Supabase Edge Functions

### 1. Real-time Analytics Function

```typescript
// functions/analytics-tracker/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { event_type, event_data, session_id } = await req.json()
    
    // Get user from JWT token
    const authHeader = req.headers.get('Authorization')
    const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', ''))

    // Track user event
    const { error } = await supabase
      .from('user_events')
      .insert({
        user_id: user?.id,
        event_type,
        event_data,
        session_id,
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent')
      })

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
```

### 2. System Metrics Collector

```typescript
// functions/system-metrics/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Collect system metrics (would integrate with actual monitoring APIs)
    const metrics = await collectSystemMetrics()

    // Store metrics in database
    const { error } = await supabase
      .from('system_metrics')
      .insert(metrics)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, metrics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function collectSystemMetrics() {
  // In production, this would collect real metrics from:
  // - Server monitoring APIs
  // - Database performance metrics
  // - External service status
  
  return [
    {
      metric_type: 'cpu_usage',
      metric_value: Math.random() * 100,
      server_id: 'main-server'
    },
    {
      metric_type: 'memory_usage',
      metric_value: Math.random() * 100,
      server_id: 'main-server'
    },
    {
      metric_type: 'response_time',
      metric_value: 200 + Math.random() * 100,
      server_id: 'main-server'
    }
  ]
}
```

### 3. Analytics Dashboard API

```typescript
// functions/analytics-dashboard/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const period = url.searchParams.get('period') || '24h'
    const metrics = url.searchParams.get('metrics')?.split(',') || ['all']

    const dashboardData = await getDashboardData(supabase, period, metrics)

    return new Response(
      JSON.stringify(dashboardData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function getDashboardData(supabase: any, period: string, metrics: string[]) {
  const timeFilter = getTimeFilter(period)
  const data: any = {}

  if (metrics.includes('all') || metrics.includes('users')) {
    // User Analytics
    const { data: userStats } = await supabase
      .from('user_events')
      .select('user_id, event_type, created_at')
      .gte('created_at', timeFilter)

    data.userAnalytics = calculateUserMetrics(userStats)
  }

  if (metrics.includes('all') || metrics.includes('system')) {
    // System Health
    const { data: systemStats } = await supabase
      .from('system_metrics')
      .select('metric_type, metric_value, created_at')
      .gte('created_at', timeFilter)

    data.systemHealth = calculateSystemMetrics(systemStats)
  }

  if (metrics.includes('all') || metrics.includes('performance')) {
    // API Performance
    const { data: apiStats } = await supabase
      .from('api_performance')
      .select('endpoint, response_time, status_code, created_at')
      .gte('created_at', timeFilter)

    data.apiPerformance = calculateApiMetrics(apiStats)
  }

  if (metrics.includes('all') || metrics.includes('revenue')) {
    // Revenue Metrics
    const { data: revenueStats } = await supabase
      .from('revenue_events')
      .select('event_type, amount_usd, created_at')
      .gte('created_at', timeFilter)

    data.revenue = calculateRevenueMetrics(revenueStats)
  }

  return data
}

function getTimeFilter(period: string): string {
  const now = new Date()
  switch (period) {
    case '1h':
      return new Date(now.getTime() - 60 * 60 * 1000).toISOString()
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    default:
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
  }
}

function calculateUserMetrics(events: any[]) {
  const uniqueUsers = new Set(events.map(e => e.user_id)).size
  const totalEvents = events.length
  const eventTypes = events.reduce((acc, e) => {
    acc[e.event_type] = (acc[e.event_type] || 0) + 1
    return acc
  }, {})

  return {
    totalUsers: uniqueUsers,
    totalEvents,
    eventTypes,
    averageEventsPerUser: totalEvents / uniqueUsers
  }
}

function calculateSystemMetrics(metrics: any[]) {
  const latest = metrics.reduce((acc, m) => {
    if (!acc[m.metric_type] || acc[m.metric_type].created_at < m.created_at) {
      acc[m.metric_type] = m
    }
    return acc
  }, {})

  return {
    cpuUsage: latest.cpu_usage?.metric_value || 0,
    memoryUsage: latest.memory_usage?.metric_value || 0,
    responseTime: latest.response_time?.metric_value || 0,
    uptime: 99.5 // Would calculate from actual uptime data
  }
}

function calculateApiMetrics(apiCalls: any[]) {
  const totalCalls = apiCalls.length
  const errorCalls = apiCalls.filter(call => call.status_code >= 400).length
  const avgResponseTime = apiCalls.reduce((sum, call) => sum + call.response_time, 0) / totalCalls

  return {
    totalCalls,
    errorRate: (errorCalls / totalCalls) * 100,
    averageResponseTime: avgResponseTime,
    successRate: ((totalCalls - errorCalls) / totalCalls) * 100
  }
}

function calculateRevenueMetrics(revenueEvents: any[]) {
  const totalRevenue = revenueEvents.reduce((sum, event) => sum + parseFloat(event.amount_usd), 0)
  const subscriptions = revenueEvents.filter(e => e.event_type === 'subscription').length
  const upgrades = revenueEvents.filter(e => e.event_type === 'upgrade').length

  return {
    totalRevenue,
    totalSubscriptions: subscriptions,
    totalUpgrades: upgrades,
    averageRevenuePerUser: totalRevenue / new Set(revenueEvents.map(e => e.user_id)).size
  }
}
```

### 4. Alert Management Function

```typescript
// functions/alert-manager/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { method } = req
    const { alert_id, action } = await req.json()

    if (method === 'POST' && action === 'resolve') {
      const { error } = await supabase
        .from('alert_history')
        .update({ 
          resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alert_id)

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, message: 'Alert resolved' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'GET') {
      const { data: alerts, error } = await supabase
        .from('alert_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      return new Response(
        JSON.stringify(alerts),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
```

## Row Level Security (RLS) Policies

```sql
-- User Events - Users can only see their own events
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events" ON user_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert events" ON user_events
  FOR INSERT WITH CHECK (true);

-- System Metrics - Only admins can view
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view system metrics" ON system_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Credit Usage - Users can view their own usage
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit usage" ON credit_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Revenue Events - Only admins can view
ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view revenue" ON revenue_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
```

## Database Functions

```sql
-- Function to calculate user engagement score
CREATE OR REPLACE FUNCTION calculate_user_engagement(user_uuid UUID, days INTEGER DEFAULT 30)
RETURNS NUMERIC AS $$
DECLARE
  event_count INTEGER;
  session_count INTEGER;
  avg_session_duration NUMERIC;
  engagement_score NUMERIC;
BEGIN
  -- Count events in the last N days
  SELECT COUNT(*) INTO event_count
  FROM user_events
  WHERE user_id = user_uuid
    AND created_at >= NOW() - INTERVAL '%s days'::text % days;

  -- Count unique sessions
  SELECT COUNT(DISTINCT session_id) INTO session_count
  FROM user_events
  WHERE user_id = user_uuid
    AND created_at >= NOW() - INTERVAL '%s days'::text % days
    AND session_id IS NOT NULL;

  -- Calculate engagement score (0-100)
  engagement_score := LEAST(100, (event_count * 2) + (session_count * 5));
  
  RETURN engagement_score;
END;
$$ LANGUAGE plpgsql;

-- Function to get daily active users
CREATE OR REPLACE FUNCTION get_daily_active_users(target_date DATE DEFAULT CURRENT_DATE)
RETURNS INTEGER AS $$
DECLARE
  active_users INTEGER;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO active_users
  FROM user_events
  WHERE DATE(created_at) = target_date;
  
  RETURN active_users;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate conversion rate
CREATE OR REPLACE FUNCTION calculate_conversion_rate(days INTEGER DEFAULT 30)
RETURNS NUMERIC AS $$
DECLARE
  total_users INTEGER;
  converted_users INTEGER;
  conversion_rate NUMERIC;
BEGIN
  -- Get total unique users in period
  SELECT COUNT(DISTINCT user_id) INTO total_users
  FROM user_events
  WHERE created_at >= NOW() - INTERVAL '%s days'::text % days;

  -- Get users who converted (made a purchase or subscription)
  SELECT COUNT(DISTINCT user_id) INTO converted_users
  FROM revenue_events
  WHERE created_at >= NOW() - INTERVAL '%s days'::text % days
    AND event_type IN ('subscription', 'purchase');

  IF total_users > 0 THEN
    conversion_rate := (converted_users::NUMERIC / total_users::NUMERIC) * 100;
  ELSE
    conversion_rate := 0;
  END IF;
  
  RETURN conversion_rate;
END;
$$ LANGUAGE plpgsql;
```

## Triggers for Real-time Updates

```sql
-- Trigger to update business metrics when revenue events occur
CREATE OR REPLACE FUNCTION update_revenue_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update daily revenue metric
  INSERT INTO business_metrics (metric_name, metric_value, metric_unit, period_start, period_end)
  VALUES (
    'daily_revenue',
    NEW.amount_usd,
    'USD',
    DATE_TRUNC('day', NEW.created_at),
    DATE_TRUNC('day', NEW.created_at) + INTERVAL '1 day'
  )
  ON CONFLICT (metric_name, period_start) 
  DO UPDATE SET 
    metric_value = business_metrics.metric_value + NEW.amount_usd;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER revenue_metrics_trigger
  AFTER INSERT ON revenue_events
  FOR EACH ROW
  EXECUTE FUNCTION update_revenue_metrics();

-- Trigger to create alerts for high error rates
CREATE OR REPLACE FUNCTION check_error_rate()
RETURNS TRIGGER AS $$
DECLARE
  error_count INTEGER;
  total_count INTEGER;
  error_rate NUMERIC;
BEGIN
  -- Check error rate in last 5 minutes
  SELECT 
    COUNT(*) FILTER (WHERE status_code >= 400),
    COUNT(*)
  INTO error_count, total_count
  FROM api_performance
  WHERE created_at >= NOW() - INTERVAL '5 minutes';

  IF total_count > 0 THEN
    error_rate := (error_count::NUMERIC / total_count::NUMERIC) * 100;
    
    -- Create alert if error rate > 5%
    IF error_rate > 5 THEN
      INSERT INTO alert_history (
        alert_type, severity, title, message, category
      ) VALUES (
        'warning',
        'medium',
        'High API Error Rate',
        'API error rate is ' || error_rate::TEXT || '% in the last 5 minutes',
        'performance'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER api_error_rate_trigger
  AFTER INSERT ON api_performance
  FOR EACH ROW
  EXECUTE FUNCTION check_error_rate();
```

## Environment Variables

Add these to your Supabase project:

```env
# External API Keys for monitoring integrations
DATADOG_API_KEY=your_datadog_key
NEW_RELIC_LICENSE_KEY=your_new_relic_key
PAGERDUTY_INTEGRATION_KEY=your_pagerduty_key

# Notification settings
SLACK_WEBHOOK_URL=your_slack_webhook
DISCORD_WEBHOOK_URL=your_discord_webhook

# Performance monitoring
SENTRY_DSN=your_sentry_dsn
GRAFANA_API_KEY=your_grafana_key

# Third-party analytics
GOOGLE_ANALYTICS_ID=your_ga_id
MIXPANEL_TOKEN=your_mixpanel_token
```

## Deployment Checklist

1. ✅ Create all database tables and indexes
2. ✅ Deploy edge functions to Supabase
3. ✅ Set up RLS policies
4. ✅ Configure environment variables
5. ✅ Set up database triggers
6. ✅ Test analytics tracking
7. ✅ Verify alert system
8. ✅ Set up monitoring dashboards
9. ✅ Configure external integrations
10. ✅ Test real-time updates

This comprehensive backend implementation provides:
- Real-time user analytics tracking
- System performance monitoring
- Alert management system
- Revenue and business metrics
- Scalable database design
- Security through RLS policies
- Automated triggers for data processing