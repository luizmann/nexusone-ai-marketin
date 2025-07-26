-- Production database optimization and final schema
-- This migration ensures the database is optimized for production workloads

-- Create indexes for performance optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON auth.users(created_at);

-- User profiles optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_plan ON user_profiles(plan);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Credits system optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);

-- Generated content optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_pages_user_id ON generated_pages(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_pages_status ON generated_pages(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_pages_created_at ON generated_pages(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_videos_user_id ON generated_videos(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_videos_status ON generated_videos(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_videos_created_at ON generated_videos(created_at DESC);

-- WhatsApp system optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_whatsapp_numbers_user_id ON whatsapp_numbers(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_whatsapp_numbers_phone_number ON whatsapp_numbers(phone_number);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_whatsapp_numbers_status ON whatsapp_numbers(status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_whatsapp_conversations_number_id ON whatsapp_conversations(number_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_whatsapp_conversations_contact_phone ON whatsapp_conversations(contact_phone);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_whatsapp_conversations_updated_at ON whatsapp_conversations(updated_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_whatsapp_messages_conversation_id ON whatsapp_messages(conversation_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_whatsapp_messages_created_at ON whatsapp_messages(created_at DESC);

-- CRM optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crm_leads_user_id ON crm_leads(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crm_leads_score ON crm_leads(score DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crm_leads_created_at ON crm_leads(created_at DESC);

-- Dropshipping optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dropshipping_products_user_id ON dropshipping_products(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dropshipping_products_status ON dropshipping_products(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dropshipping_products_category ON dropshipping_products(category);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dropshipping_products_price ON dropshipping_products(price);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dropshipping_sales_user_id ON dropshipping_sales(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dropshipping_sales_product_id ON dropshipping_sales(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dropshipping_sales_created_at ON dropshipping_sales(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dropshipping_sales_status ON dropshipping_sales(status);

-- Campaign optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_facebook_campaigns_user_id ON facebook_campaigns(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_facebook_campaigns_status ON facebook_campaigns(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_facebook_campaigns_created_at ON facebook_campaigns(created_at DESC);

-- AI Agents optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_agents_user_id ON ai_agents(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_agents_status ON ai_agents(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_agents_created_at ON ai_agents(created_at DESC);

-- Usage tracking optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_logs_feature ON usage_logs(feature);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at DESC);

-- API usage optimizations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_usage_endpoint ON api_usage(endpoint);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at DESC);

-- Performance monitoring functions
CREATE OR REPLACE FUNCTION update_user_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET last_activity = NOW() 
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic last activity updates
DROP TRIGGER IF EXISTS trigger_update_last_activity_credits ON credit_transactions;
CREATE TRIGGER trigger_update_last_activity_credits
  AFTER INSERT ON credit_transactions
  FOR EACH ROW EXECUTE FUNCTION update_user_last_activity();

DROP TRIGGER IF EXISTS trigger_update_last_activity_pages ON generated_pages;
CREATE TRIGGER trigger_update_last_activity_pages
  AFTER INSERT ON generated_pages
  FOR EACH ROW EXECUTE FUNCTION update_user_last_activity();

DROP TRIGGER IF EXISTS trigger_update_last_activity_videos ON generated_videos;
CREATE TRIGGER trigger_update_last_activity_videos
  AFTER INSERT ON generated_videos
  FOR EACH ROW EXECUTE FUNCTION update_user_last_activity();

-- Automatic cleanup functions for old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Clean up old usage logs (keep 90 days)
  DELETE FROM usage_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Clean up old API usage logs (keep 30 days)
  DELETE FROM api_usage 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Clean up old WhatsApp messages (keep 6 months)
  DELETE FROM whatsapp_messages 
  WHERE created_at < NOW() - INTERVAL '6 months';
  
  -- Archive old completed sales (keep 1 year in main table)
  UPDATE dropshipping_sales 
  SET archived = true 
  WHERE created_at < NOW() - INTERVAL '1 year' 
  AND status IN ('completed', 'cancelled');
  
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup function (requires pg_cron extension)
-- This will be set up manually in production
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data();');

-- Create materialized view for analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_analytics AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_users,
  COUNT(CASE WHEN plan = 'free' THEN 1 END) as free_users,
  COUNT(CASE WHEN plan = 'pro' THEN 1 END) as pro_users,
  COUNT(CASE WHEN plan = 'premium' THEN 1 END) as premium_users,
  AVG(credits_remaining) as avg_credits_remaining
FROM user_profiles
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Create index for materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date);

-- Function to refresh analytics
CREATE OR REPLACE FUNCTION refresh_analytics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_analytics;
END;
$$ LANGUAGE plpgsql;

-- Performance monitoring views
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
  up.user_id,
  up.email,
  up.plan,
  up.status,
  up.credits_remaining,
  up.last_activity,
  COUNT(ct.id) as total_transactions,
  COUNT(gp.id) as total_pages,
  COUNT(gv.id) as total_videos,
  COUNT(ds.id) as total_sales
FROM user_profiles up
LEFT JOIN credit_transactions ct ON up.user_id = ct.user_id
LEFT JOIN generated_pages gp ON up.user_id = gp.user_id
LEFT JOIN generated_videos gv ON up.user_id = gv.user_id
LEFT JOIN dropshipping_sales ds ON up.user_id = ds.user_id
GROUP BY up.user_id, up.email, up.plan, up.status, up.credits_remaining, up.last_activity;

-- Create view for revenue analytics
CREATE OR REPLACE VIEW revenue_analytics AS
SELECT 
  DATE(created_at) as date,
  SUM(CASE WHEN plan = 'pro' THEN 97 ELSE 0 END) as pro_revenue,
  SUM(CASE WHEN plan = 'premium' THEN 297 ELSE 0 END) as premium_revenue,
  SUM(commission_amount) as commission_revenue,
  COUNT(DISTINCT user_id) as active_users
FROM user_profiles up
LEFT JOIN dropshipping_sales ds ON up.user_id = ds.user_id
WHERE up.created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Add production monitoring and alerting
CREATE TABLE IF NOT EXISTS system_health (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  threshold_value numeric,
  status text CHECK (status IN ('healthy', 'warning', 'critical')),
  checked_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for system health
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;

-- Admin-only access to system health
CREATE POLICY "Admin can view system health" ON system_health
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND (email LIKE '%@nexusone.ai' OR role = 'admin')
    )
  );

-- Function to check system health
CREATE OR REPLACE FUNCTION check_system_health()
RETURNS void AS $$
BEGIN
  -- Check database performance
  INSERT INTO system_health (metric_name, metric_value, threshold_value, status)
  SELECT 
    'active_connections',
    COUNT(*),
    90,
    CASE 
      WHEN COUNT(*) > 90 THEN 'critical'
      WHEN COUNT(*) > 70 THEN 'warning'
      ELSE 'healthy'
    END
  FROM pg_stat_activity 
  WHERE state = 'active';
  
  -- Check storage usage
  INSERT INTO system_health (metric_name, metric_value, threshold_value, status)
  SELECT 
    'storage_usage_gb',
    pg_database_size(current_database())::numeric / (1024^3),
    100,
    CASE 
      WHEN pg_database_size(current_database())::numeric / (1024^3) > 100 THEN 'critical'
      WHEN pg_database_size(current_database())::numeric / (1024^3) > 80 THEN 'warning'
      ELSE 'healthy'
    END;
    
  -- Check user growth rate
  INSERT INTO system_health (metric_name, metric_value, threshold_value, status)
  SELECT 
    'daily_new_users',
    COUNT(*),
    1000,
    CASE 
      WHEN COUNT(*) > 1000 THEN 'warning' -- High growth may need scaling
      ELSE 'healthy'
    END
  FROM user_profiles 
  WHERE created_at >= CURRENT_DATE;
  
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Enable real-time for critical tables
ALTER publication supabase_realtime ADD TABLE user_profiles;
ALTER publication supabase_realtime ADD TABLE whatsapp_conversations;
ALTER publication supabase_realtime ADD TABLE whatsapp_messages;
ALTER publication supabase_realtime ADD TABLE dropshipping_sales;
ALTER publication supabase_realtime ADD TABLE credit_transactions;

-- Final vacuum and analyze
VACUUM ANALYZE;

-- Log completion
INSERT INTO system_health (metric_name, metric_value, status)
VALUES ('production_optimization_complete', 1, 'healthy');