-- Realtime subscriptions for live updates
-- Enable realtime for specific tables

-- Enable realtime for user-specific data
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.credit_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.usage_analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.facebook_campaigns;

-- Advanced analytics views
CREATE VIEW public.user_analytics AS
SELECT 
    u.id,
    u.email,
    u.plan,
    u.credits,
    u.created_at as registration_date,
    COUNT(DISTINCT ct.id) as total_transactions,
    SUM(CASE WHEN ct.type = 'usage' THEN ABS(ct.amount) ELSE 0 END) as total_credits_used,
    COUNT(DISTINCT ac.id) as content_generated,
    COUNT(DISTINCT lp.id) as landing_pages_created,
    COUNT(DISTINCT vj.id) as videos_generated,
    COUNT(DISTINCT wc.id) as whatsapp_campaigns,
    COUNT(DISTINCT fc.id) as facebook_campaigns,
    COALESCE(MAX(ua.created_at), u.created_at) as last_activity
FROM public.users u
LEFT JOIN public.credit_transactions ct ON u.id = ct.user_id
LEFT JOIN public.ai_content ac ON u.id = ac.user_id
LEFT JOIN public.landing_pages lp ON u.id = lp.user_id
LEFT JOIN public.video_jobs vj ON u.id = vj.user_id
LEFT JOIN public.whatsapp_campaigns wc ON u.id = wc.user_id
LEFT JOIN public.facebook_campaigns fc ON u.id = fc.user_id
LEFT JOIN public.usage_analytics ua ON u.id = ua.user_id
GROUP BY u.id, u.email, u.plan, u.credits, u.created_at;

-- Module usage statistics
CREATE VIEW public.module_usage_stats AS
SELECT 
    module,
    COUNT(*) as total_uses,
    COUNT(DISTINCT user_id) as unique_users,
    SUM(credits_consumed) as total_credits_consumed,
    AVG(credits_consumed) as avg_credits_per_use,
    SUM(CASE WHEN success THEN 1 ELSE 0 END)::float / COUNT(*)::float as success_rate,
    DATE_TRUNC('day', created_at) as date
FROM public.usage_analytics
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY module, DATE_TRUNC('day', created_at)
ORDER BY date DESC, total_uses DESC;

-- Revenue analytics
CREATE VIEW public.revenue_analytics AS
SELECT 
    DATE_TRUNC('month', s.created_at) as month,
    s.plan,
    COUNT(*) as subscriptions_count,
    SUM(s.amount / 100.0) as revenue,
    COUNT(CASE WHEN s.status = 'active' THEN 1 END) as active_subscriptions,
    COUNT(CASE WHEN s.status = 'canceled' THEN 1 END) as canceled_subscriptions
FROM public.subscriptions s
GROUP BY DATE_TRUNC('month', s.created_at), s.plan
ORDER BY month DESC, revenue DESC;

-- User engagement scoring
CREATE OR REPLACE FUNCTION calculate_user_engagement_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    activity_days INTEGER;
    content_count INTEGER;
    campaign_count INTEGER;
BEGIN
    -- Calculate days active in last 30 days
    SELECT COUNT(DISTINCT DATE_TRUNC('day', created_at))
    INTO activity_days
    FROM public.usage_analytics
    WHERE user_id = p_user_id
    AND created_at >= NOW() - INTERVAL '30 days';
    
    -- Count content generated
    SELECT COUNT(*)
    INTO content_count
    FROM public.ai_content
    WHERE user_id = p_user_id
    AND created_at >= NOW() - INTERVAL '30 days';
    
    -- Count campaigns created
    SELECT COUNT(*)
    INTO campaign_count
    FROM (
        SELECT user_id FROM public.whatsapp_campaigns WHERE user_id = p_user_id AND created_at >= NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT user_id FROM public.facebook_campaigns WHERE user_id = p_user_id AND created_at >= NOW() - INTERVAL '30 days'
    ) campaigns;
    
    -- Calculate score (0-100)
    score := LEAST(100, 
        (activity_days * 3) +
        (content_count * 2) +
        (campaign_count * 5)
    );
    
    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Subscription management functions
CREATE OR REPLACE FUNCTION handle_subscription_webhook(
    webhook_type TEXT,
    webhook_data JSONB
)
RETURNS void AS $$
DECLARE
    user_uuid UUID;
    subscription_data JSONB;
BEGIN
    CASE webhook_type
        WHEN 'customer.subscription.created' THEN
            -- Handle new subscription
            subscription_data := webhook_data->'data'->'object';
            
            -- Find user by customer ID
            SELECT u.id INTO user_uuid
            FROM public.users u
            JOIN public.subscriptions s ON u.id = s.user_id
            WHERE s.stripe_customer_id = subscription_data->>'customer';
            
            IF user_uuid IS NOT NULL THEN
                -- Update subscription status
                UPDATE public.subscriptions
                SET 
                    status = 'active',
                    current_period_start = TO_TIMESTAMP((subscription_data->>'current_period_start')::bigint),
                    current_period_end = TO_TIMESTAMP((subscription_data->>'current_period_end')::bigint),
                    updated_at = NOW()
                WHERE stripe_subscription_id = subscription_data->>'id';
                
                -- Reset credits based on plan
                PERFORM reset_user_credits(user_uuid);
            END IF;
            
        WHEN 'customer.subscription.updated' THEN
            -- Handle subscription updates
            subscription_data := webhook_data->'data'->'object';
            
            UPDATE public.subscriptions
            SET 
                status = CASE 
                    WHEN subscription_data->>'status' = 'active' THEN 'active'::subscription_status
                    WHEN subscription_data->>'status' = 'canceled' THEN 'canceled'::subscription_status
                    WHEN subscription_data->>'status' = 'past_due' THEN 'past_due'::subscription_status
                    ELSE 'incomplete'::subscription_status
                END,
                current_period_start = TO_TIMESTAMP((subscription_data->>'current_period_start')::bigint),
                current_period_end = TO_TIMESTAMP((subscription_data->>'current_period_end')::bigint),
                updated_at = NOW()
            WHERE stripe_subscription_id = subscription_data->>'id';
            
        WHEN 'customer.subscription.deleted' THEN
            -- Handle subscription cancellation
            subscription_data := webhook_data->'data'->'object';
            
            UPDATE public.subscriptions
            SET 
                status = 'canceled',
                updated_at = NOW()
            WHERE stripe_subscription_id = subscription_data->>'id';
            
            -- Downgrade user to free plan
            UPDATE public.users
            SET 
                plan = 'free',
                credits = 50,
                video_quota = 2
            WHERE id = (
                SELECT user_id 
                FROM public.subscriptions 
                WHERE stripe_subscription_id = subscription_data->>'id'
            );
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to reset user credits based on plan
CREATE OR REPLACE FUNCTION reset_user_credits(p_user_id UUID)
RETURNS void AS $$
DECLARE
    user_plan user_plan;
    plan_limits JSONB;
BEGIN
    -- Get user plan
    SELECT plan INTO user_plan
    FROM public.users
    WHERE id = p_user_id;
    
    -- Get plan limits
    SELECT value INTO plan_limits
    FROM public.system_settings
    WHERE key = 'plan_limits';
    
    -- Update user credits and quotas
    UPDATE public.users
    SET 
        credits = (plan_limits->user_plan::text->>'credits')::integer,
        video_quota = (plan_limits->user_plan::text->>'videos')::integer,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Log credit reset
    INSERT INTO public.credit_transactions (
        user_id,
        type,
        amount,
        remaining_credits,
        description
    ) VALUES (
        p_user_id,
        'bonus',
        (plan_limits->user_plan::text->>'credits')::integer,
        (plan_limits->user_plan::text->>'credits')::integer,
        'Monthly credit reset for ' || user_plan::text || ' plan'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check and upgrade/downgrade users based on subscription
CREATE OR REPLACE FUNCTION sync_user_plan_with_subscription(p_user_id UUID)
RETURNS void AS $$
DECLARE
    current_subscription RECORD;
    target_plan user_plan;
BEGIN
    -- Get active subscription
    SELECT *
    INTO current_subscription
    FROM public.subscriptions
    WHERE user_id = p_user_id
    AND status = 'active'
    AND current_period_end > NOW()
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF current_subscription IS NOT NULL THEN
        target_plan := current_subscription.plan;
    ELSE
        target_plan := 'free';
    END IF;
    
    -- Update user plan if different
    UPDATE public.users
    SET plan = target_plan
    WHERE id = p_user_id
    AND plan != target_plan;
    
    -- Reset credits if plan changed
    IF FOUND THEN
        PERFORM reset_user_credits(p_user_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_analytics_date ON public.usage_analytics(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_analytics_module_date ON public.usage_analytics(module, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions(user_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_content_user_created ON public.ai_content(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_landing_pages_user_published ON public.landing_pages(user_id, is_published);

-- Monthly credit reset job (requires pg_cron extension)
-- SELECT cron.schedule('monthly-credit-reset', '0 0 1 * *', 'SELECT reset_user_credits(id) FROM public.users WHERE plan != ''free'';');