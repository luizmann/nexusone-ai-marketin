-- NexusOne AI Platform Production Database Schema
-- Migration: 004_production_optimizations.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create production-optimized indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_verified 
ON auth.users(email) WHERE email_confirmed_at IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_subscription_plan 
ON user_profiles(subscription_plan);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_credits_user_id_created_at 
ON user_credits(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_magic_pages_user_id_published 
ON magic_pages(user_id, is_published);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dropshipping_products_category_active 
ON dropshipping_products(category) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_user_id_status_created_at 
ON sales(user_id, status, created_at DESC);

-- Production monitoring tables
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('counter', 'gauge', 'histogram')),
    tags JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_system_metrics_name_created_at ON system_metrics(metric_name, created_at DESC);

-- API usage tracking
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    credits_consumed INTEGER DEFAULT 0,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_api_usage_logs_user_id_created_at ON api_usage_logs(user_id, created_at DESC);
CREATE INDEX idx_api_usage_logs_endpoint_created_at ON api_usage_logs(endpoint, created_at DESC);

-- Error tracking
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    function_name TEXT,
    request_data JSONB,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_error_logs_severity_created_at ON error_logs(severity, created_at DESC);
CREATE INDEX idx_error_logs_user_id_created_at ON error_logs(user_id, created_at DESC);

-- Performance optimization table
CREATE TABLE IF NOT EXISTS query_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_name TEXT NOT NULL,
    execution_time_ms NUMERIC NOT NULL,
    rows_affected INTEGER,
    query_hash TEXT,
    optimized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature usage analytics
CREATE TABLE IF NOT EXISTS feature_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    usage_type TEXT NOT NULL CHECK (usage_type IN ('click', 'view', 'completion', 'error')),
    metadata JSONB DEFAULT '{}',
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_feature_usage_user_id_feature_name ON feature_usage(user_id, feature_name);
CREATE INDEX idx_feature_usage_feature_name_created_at ON feature_usage(feature_name, created_at DESC);

-- Production configuration table
CREATE TABLE IF NOT EXISTS system_configuration (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default production configurations
INSERT INTO system_configuration (config_key, config_value, description, is_sensitive) VALUES
('rate_limiting', '{"anonymous": 100, "authenticated": 1000, "premium": 5000}', 'API rate limits per hour', false),
('feature_flags', '{"ai_content_generator": true, "video_creator": true, "dropshipping": true}', 'Feature availability flags', false),
('system_maintenance', '{"enabled": false, "message": "", "scheduled_at": null}', 'Maintenance mode configuration', false),
('payment_settings', '{"stripe_enabled": true, "test_mode": false, "webhook_tolerance": 300}', 'Payment processing settings', false),
('ai_service_limits', '{"openai_monthly_limit": 100000, "elevenlabs_monthly_limit": 50000}', 'AI service usage limits', false),
('backup_settings', '{"frequency": "daily", "retention_days": 30, "compression": true}', 'Backup configuration', false)
ON CONFLICT (config_key) DO UPDATE SET 
    config_value = EXCLUDED.config_value,
    updated_at = NOW();

-- Enhanced RLS policies for production
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_configuration ENABLE ROW LEVEL SECURITY;

-- Admin-only access to system metrics
CREATE POLICY "Admin read system_metrics" ON system_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Users can only see their own API usage
CREATE POLICY "Users read own api_usage_logs" ON api_usage_logs
    FOR SELECT USING (user_id = auth.uid());

-- Admin read all API usage
CREATE POLICY "Admin read all api_usage_logs" ON api_usage_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Users can see their own feature usage
CREATE POLICY "Users read own feature_usage" ON feature_usage
    FOR SELECT USING (user_id = auth.uid());

-- Admin read all feature usage
CREATE POLICY "Admin read all feature_usage" ON feature_usage
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- System configuration admin only
CREATE POLICY "Admin access system_configuration" ON system_configuration
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Production functions for monitoring
CREATE OR REPLACE FUNCTION log_api_usage(
    p_endpoint TEXT,
    p_method TEXT,
    p_status_code INTEGER,
    p_response_time_ms INTEGER,
    p_credits_consumed INTEGER DEFAULT 0
) RETURNS VOID AS $$
BEGIN
    INSERT INTO api_usage_logs (
        user_id, endpoint, method, status_code, 
        response_time_ms, credits_consumed, ip_address
    ) VALUES (
        auth.uid(), p_endpoint, p_method, p_status_code,
        p_response_time_ms, p_credits_consumed, inet_client_addr()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_error(
    p_error_type TEXT,
    p_error_message TEXT,
    p_stack_trace TEXT DEFAULT NULL,
    p_function_name TEXT DEFAULT NULL,
    p_severity TEXT DEFAULT 'medium'
) RETURNS VOID AS $$
BEGIN
    INSERT INTO error_logs (
        user_id, error_type, error_message, stack_trace, 
        function_name, severity
    ) VALUES (
        auth.uid(), p_error_type, p_error_message, p_stack_trace,
        p_function_name, p_severity
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION track_feature_usage(
    p_feature_name TEXT,
    p_usage_type TEXT,
    p_metadata JSONB DEFAULT '{}'
) RETURNS VOID AS $$
BEGIN
    INSERT INTO feature_usage (
        user_id, feature_name, usage_type, metadata
    ) VALUES (
        auth.uid(), p_feature_name, p_usage_type, p_metadata
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get system health
CREATE OR REPLACE FUNCTION get_system_health()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    db_size TEXT;
    active_users INTEGER;
    total_api_calls INTEGER;
    error_rate NUMERIC;
BEGIN
    -- Get database size
    SELECT pg_size_pretty(pg_database_size(current_database())) INTO db_size;
    
    -- Get active users (last 24 hours)
    SELECT COUNT(DISTINCT user_id) INTO active_users
    FROM api_usage_logs 
    WHERE created_at > NOW() - INTERVAL '24 hours';
    
    -- Get total API calls today
    SELECT COUNT(*) INTO total_api_calls
    FROM api_usage_logs 
    WHERE created_at > CURRENT_DATE;
    
    -- Calculate error rate
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND((COUNT(*) FILTER (WHERE status_code >= 400)::NUMERIC / COUNT(*)) * 100, 2)
        END INTO error_rate
    FROM api_usage_logs 
    WHERE created_at > NOW() - INTERVAL '1 hour';
    
    result := jsonb_build_object(
        'database_size', db_size,
        'active_users_24h', active_users,
        'api_calls_today', total_api_calls,
        'error_rate_1h', error_rate || '%',
        'timestamp', NOW(),
        'status', CASE 
            WHEN error_rate > 10 THEN 'unhealthy'
            WHEN error_rate > 5 THEN 'warning'
            ELSE 'healthy'
        END
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create materialized view for dashboard analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_analytics AS
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_requests,
    AVG(response_time_ms) as avg_response_time,
    COUNT(*) FILTER (WHERE status_code >= 400) as error_count,
    SUM(credits_consumed) as total_credits_consumed
FROM api_usage_logs
WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_daily_analytics()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_analytics;
END;
$$ LANGUAGE plpgsql;

-- Production cleanup functions
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS VOID AS $$
BEGIN
    -- Clean up API logs older than 90 days
    DELETE FROM api_usage_logs WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Clean up error logs older than 180 days
    DELETE FROM error_logs WHERE created_at < NOW() - INTERVAL '180 days' AND resolved = true;
    
    -- Clean up feature usage older than 365 days
    DELETE FROM feature_usage WHERE created_at < NOW() - INTERVAL '365 days';
    
    -- Clean up system metrics older than 30 days
    DELETE FROM system_metrics WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create scheduled job for cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-old-logs', '0 2 * * *', 'SELECT cleanup_old_logs();');

COMMENT ON MIGRATION VERSION IS '004_production_optimizations.sql - Production monitoring, analytics, and optimization features';