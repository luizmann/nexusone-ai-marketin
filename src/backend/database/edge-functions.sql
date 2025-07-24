-- Supabase Edge Functions for NexusOne AI Platform
-- These are optimized for deployment on Supabase Edge Functions

-- Edge Function: AI Content Generation
CREATE OR REPLACE FUNCTION generate_ai_content(
  user_id UUID,
  content_type TEXT,
  prompt TEXT,
  language TEXT DEFAULT 'en',
  model TEXT DEFAULT 'gpt-4o'
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_credits INTEGER;
  required_credits INTEGER;
  result JSON;
BEGIN
  -- Check user credits
  SELECT credits_balance INTO user_credits 
  FROM users WHERE id = user_id;
  
  -- Determine required credits based on content type
  required_credits := CASE content_type
    WHEN 'magic_page' THEN 10
    WHEN 'video_script' THEN 15
    WHEN 'campaign_content' THEN 15
    WHEN 'business_ideas' THEN 8
    WHEN 'social_media' THEN 5
    ELSE 10
  END;
  
  -- Check if user has enough credits
  IF user_credits < required_credits THEN
    RAISE EXCEPTION 'Insufficient credits. Required: %, Available: %', required_credits, user_credits;
  END IF;
  
  -- Deduct credits
  UPDATE users 
  SET credits_balance = credits_balance - required_credits 
  WHERE id = user_id;
  
  -- Log credit transaction
  INSERT INTO credit_transactions (user_id, amount, transaction_type, module_used, description)
  VALUES (user_id, -required_credits, 'usage', content_type, 'AI content generation');
  
  -- Log user activity
  INSERT INTO user_activities (user_id, activity_type, module_name, action, metadata)
  VALUES (user_id, 'content_generation', content_type, 'ai_generated', 
          json_build_object('prompt', prompt, 'language', language, 'credits_used', required_credits));
  
  -- Return success result (actual AI call would be made in Edge Function)
  result := json_build_object(
    'success', true,
    'credits_deducted', required_credits,
    'remaining_credits', user_credits - required_credits,
    'content_type', content_type,
    'language', language
  );
  
  RETURN result;
END;
$$;

-- Edge Function: Video Project Processing
CREATE OR REPLACE FUNCTION process_video_project(
  user_id UUID,
  project_id UUID,
  script TEXT,
  avatar_id TEXT,
  voice_id TEXT
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_credits INTEGER;
  user_quota INTEGER;
  current_usage INTEGER;
  result JSON;
BEGIN
  -- Check user credits and quota
  SELECT credits_balance, video_quota INTO user_credits, user_quota
  FROM users WHERE id = user_id;
  
  -- Check current month's video usage
  SELECT COUNT(*) INTO current_usage
  FROM video_projects 
  WHERE user_id = user_id 
    AND status = 'completed'
    AND created_at >= date_trunc('month', CURRENT_DATE);
  
  -- Check quota limits
  IF user_quota > 0 AND current_usage >= user_quota THEN
    RAISE EXCEPTION 'Video quota exceeded. Limit: %, Used: %', user_quota, current_usage;
  END IF;
  
  -- Check credits (25 credits required for video generation)
  IF user_credits < 25 THEN
    RAISE EXCEPTION 'Insufficient credits. Required: 25, Available: %', user_credits;
  END IF;
  
  -- Deduct credits
  UPDATE users 
  SET credits_balance = credits_balance - 25 
  WHERE id = user_id;
  
  -- Update project status
  UPDATE video_projects 
  SET status = 'processing'
  WHERE id = project_id AND user_id = user_id;
  
  -- Log transactions
  INSERT INTO credit_transactions (user_id, amount, transaction_type, module_used, description)
  VALUES (user_id, -25, 'usage', 'video_creator', 'Video generation');
  
  INSERT INTO user_activities (user_id, activity_type, module_name, action, metadata)
  VALUES (user_id, 'video_generation', 'video_creator', 'processing_started', 
          json_build_object('project_id', project_id, 'credits_used', 25));
  
  result := json_build_object(
    'success', true,
    'project_id', project_id,
    'status', 'processing',
    'credits_deducted', 25,
    'remaining_credits', user_credits - 25
  );
  
  RETURN result;
END;
$$;

-- Edge Function: WhatsApp Message Processing
CREATE OR REPLACE FUNCTION process_whatsapp_message(
  phone_number_id UUID,
  contact_number TEXT,
  message_data JSON,
  direction TEXT
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  flow_record RECORD;
  result JSON;
BEGIN
  -- Get user_id from WhatsApp number
  SELECT users.id INTO user_id
  FROM whatsapp_numbers 
  JOIN users ON users.id = whatsapp_numbers.user_id
  WHERE whatsapp_numbers.id = phone_number_id;
  
  -- Insert message record
  INSERT INTO whatsapp_messages (
    whatsapp_number_id, 
    contact_number, 
    message_type, 
    content, 
    direction, 
    status
  ) VALUES (
    phone_number_id,
    contact_number,
    message_data->>'type',
    message_data::text,
    direction,
    'received'
  );
  
  -- If incoming message, check for automation triggers
  IF direction = 'inbound' THEN
    -- Look for matching flows
    FOR flow_record IN 
      SELECT * FROM whatsapp_flows 
      WHERE whatsapp_number_id = phone_number_id 
        AND is_active = true
    LOOP
      -- Check if message contains trigger keywords
      IF EXISTS (
        SELECT 1 FROM unnest(flow_record.trigger_keywords) AS keyword
        WHERE LOWER(message_data->>'text') LIKE '%' || LOWER(keyword) || '%'
      ) THEN
        -- Log flow trigger
        INSERT INTO user_activities (user_id, activity_type, module_name, action, metadata)
        VALUES (user_id, 'flow_triggered', 'whatsapp_bot', 'automation_triggered', 
                json_build_object('flow_id', flow_record.id, 'contact', contact_number));
        
        -- Return flow for processing
        result := json_build_object(
          'success', true,
          'flow_triggered', true,
          'flow_id', flow_record.id,
          'flow_config', flow_record.flow_config
        );
        
        RETURN result;
      END IF;
    END LOOP;
  END IF;
  
  result := json_build_object(
    'success', true,
    'message_saved', true,
    'flow_triggered', false
  );
  
  RETURN result;
END;
$$;

-- Edge Function: Campaign Performance Analytics
CREATE OR REPLACE FUNCTION get_campaign_analytics(
  user_id UUID,
  campaign_id UUID DEFAULT NULL,
  start_date DATE DEFAULT NULL,
  end_date DATE DEFAULT NULL
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  campaigns_data JSON;
  total_spend DECIMAL;
  total_impressions INTEGER;
  total_clicks INTEGER;
  total_conversions INTEGER;
BEGIN
  -- Set default dates if not provided
  start_date := COALESCE(start_date, CURRENT_DATE - INTERVAL '30 days');
  end_date := COALESCE(end_date, CURRENT_DATE);
  
  -- Get campaign data
  SELECT json_agg(
    json_build_object(
      'id', c.id,
      'name', c.name,
      'platform', c.platform,
      'status', c.status,
      'budget', c.budget,
      'spend', COALESCE((c.performance_metrics->>'spend')::decimal, 0),
      'impressions', COALESCE((c.performance_metrics->>'impressions')::integer, 0),
      'clicks', COALESCE((c.performance_metrics->>'clicks')::integer, 0),
      'conversions', COALESCE((c.performance_metrics->>'conversions')::integer, 0),
      'ctr', CASE 
        WHEN COALESCE((c.performance_metrics->>'impressions')::integer, 0) > 0 
        THEN ROUND((COALESCE((c.performance_metrics->>'clicks')::integer, 0)::decimal / 
                   COALESCE((c.performance_metrics->>'impressions')::integer, 0)::decimal) * 100, 2)
        ELSE 0 
      END,
      'created_at', c.created_at
    )
  ) INTO campaigns_data
  FROM campaigns c
  WHERE c.user_id = get_campaign_analytics.user_id
    AND (campaign_id IS NULL OR c.id = campaign_id)
    AND c.created_at::date BETWEEN start_date AND end_date;
  
  -- Calculate totals
  SELECT 
    COALESCE(SUM((performance_metrics->>'spend')::decimal), 0),
    COALESCE(SUM((performance_metrics->>'impressions')::integer), 0),
    COALESCE(SUM((performance_metrics->>'clicks')::integer), 0),
    COALESCE(SUM((performance_metrics->>'conversions')::integer), 0)
  INTO total_spend, total_impressions, total_clicks, total_conversions
  FROM campaigns
  WHERE user_id = get_campaign_analytics.user_id
    AND (campaign_id IS NULL OR id = campaign_id)
    AND created_at::date BETWEEN start_date AND end_date;
  
  -- Build result
  result := json_build_object(
    'campaigns', COALESCE(campaigns_data, '[]'::json),
    'summary', json_build_object(
      'total_spend', total_spend,
      'total_impressions', total_impressions,
      'total_clicks', total_clicks,
      'total_conversions', total_conversions,
      'average_ctr', CASE 
        WHEN total_impressions > 0 
        THEN ROUND((total_clicks::decimal / total_impressions::decimal) * 100, 2)
        ELSE 0 
      END,
      'conversion_rate', CASE 
        WHEN total_clicks > 0 
        THEN ROUND((total_conversions::decimal / total_clicks::decimal) * 100, 2)
        ELSE 0 
      END
    ),
    'period', json_build_object(
      'start_date', start_date,
      'end_date', end_date
    )
  );
  
  RETURN result;
END;
$$;

-- Edge Function: User Dashboard Data
CREATE OR REPLACE FUNCTION get_dashboard_data(user_id UUID) 
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  user_data RECORD;
  recent_activities JSON;
  credit_usage JSON;
  module_stats JSON;
BEGIN
  -- Get user basic info
  SELECT 
    credits_balance,
    video_quota,
    landing_pages_quota,
    whatsapp_numbers_quota,
    subscription_plan
  INTO user_data
  FROM users 
  WHERE id = user_id;
  
  -- Get recent activities (last 10)
  SELECT json_agg(
    json_build_object(
      'activity_type', activity_type,
      'module_name', module_name,
      'action', action,
      'created_at', created_at
    ) ORDER BY created_at DESC
  ) INTO recent_activities
  FROM (
    SELECT * FROM user_activities 
    WHERE user_id = get_dashboard_data.user_id 
    ORDER BY created_at DESC 
    LIMIT 10
  ) subq;
  
  -- Get credit usage for current month
  SELECT json_build_object(
    'total_used', COALESCE(SUM(ABS(amount)), 0),
    'by_module', json_object_agg(
      COALESCE(module_used, 'other'), 
      SUM(ABS(amount))
    )
  ) INTO credit_usage
  FROM credit_transactions
  WHERE user_id = get_dashboard_data.user_id
    AND transaction_type = 'usage'
    AND created_at >= date_trunc('month', CURRENT_DATE);
  
  -- Get module usage statistics
  SELECT json_build_object(
    'magic_pages', (
      SELECT COUNT(*) FROM magic_pages 
      WHERE user_id = get_dashboard_data.user_id
    ),
    'video_projects', (
      SELECT COUNT(*) FROM video_projects 
      WHERE user_id = get_dashboard_data.user_id
    ),
    'campaigns', (
      SELECT COUNT(*) FROM campaigns 
      WHERE user_id = get_dashboard_data.user_id
    ),
    'contacts', (
      SELECT COUNT(*) FROM contacts 
      WHERE user_id = get_dashboard_data.user_id
    ),
    'ai_agents', (
      SELECT COUNT(*) FROM ai_agents 
      WHERE user_id = get_dashboard_data.user_id
    ),
    'whatsapp_numbers', (
      SELECT COUNT(*) FROM whatsapp_numbers 
      WHERE user_id = get_dashboard_data.user_id AND is_active = true
    )
  ) INTO module_stats;
  
  -- Build final result
  result := json_build_object(
    'user', json_build_object(
      'credits_balance', user_data.credits_balance,
      'video_quota', user_data.video_quota,
      'landing_pages_quota', user_data.landing_pages_quota,
      'whatsapp_numbers_quota', user_data.whatsapp_numbers_quota,
      'subscription_plan', user_data.subscription_plan
    ),
    'recent_activities', COALESCE(recent_activities, '[]'::json),
    'credit_usage', COALESCE(credit_usage, '{}'::json),
    'module_stats', module_stats
  );
  
  RETURN result;
END;
$$;

-- Edge Function: Multi-language Content Support
CREATE OR REPLACE FUNCTION get_localized_content(
  content_type TEXT,
  language TEXT DEFAULT 'en'
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Return localized templates and content based on language
  CASE content_type
    WHEN 'magic_page_templates' THEN
      result := json_build_object(
        'templates', CASE language
          WHEN 'es' THEN '[
            {"id": "modern-tech", "name": "Tecnología Moderna", "preview": "..."},
            {"id": "ecommerce", "name": "Tienda Online", "preview": "..."}
          ]'::json
          WHEN 'pt' THEN '[
            {"id": "modern-tech", "name": "Tecnologia Moderna", "preview": "..."},
            {"id": "ecommerce", "name": "Loja Online", "preview": "..."}
          ]'::json
          WHEN 'ar' THEN '[
            {"id": "modern-tech", "name": "تكنولوجيا حديثة", "preview": "..."},
            {"id": "ecommerce", "name": "متجر إلكتروني", "preview": "..."}
          ]'::json
          WHEN 'he' THEN '[
            {"id": "modern-tech", "name": "טכנולוגיה מודרנית", "preview": "..."},
            {"id": "ecommerce", "name": "חנות מקוונת", "preview": "..."}
          ]'::json
          ELSE '[
            {"id": "modern-tech", "name": "Modern Technology", "preview": "..."},
            {"id": "ecommerce", "name": "E-commerce Store", "preview": "..."}
          ]'::json
        END
      );
    
    WHEN 'campaign_templates' THEN
      result := json_build_object(
        'objectives', CASE language
          WHEN 'es' THEN '["conversiones", "tráfico", "reconocimiento", "leads"]'::json
          WHEN 'pt' THEN '["conversões", "tráfego", "reconhecimento", "leads"]'::json
          WHEN 'ar' THEN '["تحويلات", "حركة المرور", "الوعي", "عملاء محتملين"]'::json
          WHEN 'he' THEN '["המרות", "תנועה", "מודעות", "לידים"]'::json
          ELSE '["conversions", "traffic", "awareness", "leads"]'::json
        END
      );
    
    ELSE
      result := json_build_object('error', 'Unknown content type');
  END CASE;
  
  RETURN result;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_module ON user_activities(user_id, module_name);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_type ON credit_transactions(user_id, transaction_type);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_platform ON campaigns(user_id, platform);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_number_direction ON whatsapp_messages(whatsapp_number_id, direction);

-- Grant permissions for Edge Functions
GRANT EXECUTE ON FUNCTION generate_ai_content TO authenticated;
GRANT EXECUTE ON FUNCTION process_video_project TO authenticated;
GRANT EXECUTE ON FUNCTION process_whatsapp_message TO authenticated;
GRANT EXECUTE ON FUNCTION get_campaign_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_data TO authenticated;
GRANT EXECUTE ON FUNCTION get_localized_content TO authenticated;