-- Enhanced Database Schema for Inventory Sync and Order Fulfillment Automation
-- This schema supports automated inventory management, order processing, and scheduling

-- ===========================
-- CORE AUTOMATION TABLES
-- ===========================

-- Automation Tasks Table
CREATE TABLE IF NOT EXISTS automation_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES automation_schedules(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('inventory_sync', 'order_fulfillment', 'stock_alert', 'webhook_process')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    config JSONB NOT NULL DEFAULT '{}',
    result JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Schedules Table
CREATE TABLE IF NOT EXISTS automation_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('hourly', 'daily', 'weekly', 'monthly', 'custom')),
    cron_expression VARCHAR(100), -- For custom frequencies
    is_active BOOLEAN DEFAULT true,
    config JSONB NOT NULL DEFAULT '{}',
    filters JSONB DEFAULT '{}',
    notifications JSONB DEFAULT '{}',
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    run_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Inventory Sync Logs
CREATE TABLE IF NOT EXISTS inventory_sync_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES automation_schedules(id) ON DELETE SET NULL,
    sync_type VARCHAR(50) DEFAULT 'manual' CHECK (sync_type IN ('manual', 'scheduled', 'webhook')),
    products_synced INTEGER DEFAULT 0,
    products_failed INTEGER DEFAULT 0,
    products_updated INTEGER DEFAULT 0,
    products_added INTEGER DEFAULT 0,
    sync_duration_ms INTEGER,
    sync_details JSONB DEFAULT '{}',
    low_stock_alerts INTEGER DEFAULT 0,
    out_of_stock_alerts INTEGER DEFAULT 0,
    error_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Fulfillment Logs
CREATE TABLE IF NOT EXISTS fulfillment_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES dropshipping_orders(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    success BOOLEAN NOT NULL,
    duration_ms INTEGER,
    details JSONB DEFAULT '{}',
    error_message TEXT,
    external_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- ENHANCED PRODUCT & ORDER TABLES
-- ===========================

-- Enhanced Dropshipping Products Table
ALTER TABLE dropshipping_products ADD COLUMN IF NOT EXISTS total_sales INTEGER DEFAULT 0;
ALTER TABLE dropshipping_products ADD COLUMN IF NOT EXISTS revenue_generated DECIMAL(12,2) DEFAULT 0;
ALTER TABLE dropshipping_products ADD COLUMN IF NOT EXISTS sync_frequency VARCHAR(20) DEFAULT 'daily';
ALTER TABLE dropshipping_products ADD COLUMN IF NOT EXISTS auto_sync_enabled BOOLEAN DEFAULT true;
ALTER TABLE dropshipping_products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;
ALTER TABLE dropshipping_products ADD COLUMN IF NOT EXISTS reorder_point INTEGER DEFAULT 10;
ALTER TABLE dropshipping_products ADD COLUMN IF NOT EXISTS supplier_product_url TEXT;
ALTER TABLE dropshipping_products ADD COLUMN IF NOT EXISTS import_source VARCHAR(50) DEFAULT 'manual';
ALTER TABLE dropshipping_products ADD COLUMN IF NOT EXISTS performance_score DECIMAL(3,2) DEFAULT 0;
ALTER TABLE dropshipping_products ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE dropshipping_products ADD COLUMN IF NOT EXISTS seasonal_demand JSONB DEFAULT '{}';

-- Enhanced Dropshipping Orders Table
ALTER TABLE dropshipping_orders ADD COLUMN IF NOT EXISTS fulfillment_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE dropshipping_orders ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2) DEFAULT 0;
ALTER TABLE dropshipping_orders ADD COLUMN IF NOT EXISTS estimated_delivery_days INTEGER;
ALTER TABLE dropshipping_orders ADD COLUMN IF NOT EXISTS actual_delivery_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE dropshipping_orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE dropshipping_orders ADD COLUMN IF NOT EXISTS refund_status VARCHAR(20) DEFAULT 'none';
ALTER TABLE dropshipping_orders ADD COLUMN IF NOT EXISTS customer_notes TEXT;
ALTER TABLE dropshipping_orders ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE dropshipping_orders ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2);
ALTER TABLE dropshipping_orders ADD COLUMN IF NOT EXISTS commission_paid BOOLEAN DEFAULT false;
ALTER TABLE dropshipping_orders ADD COLUMN IF NOT EXISTS order_source VARCHAR(50) DEFAULT 'manual';

-- ===========================
-- TRACKING & ANALYTICS TABLES
-- ===========================

-- Enhanced Order Tracking Table
CREATE TABLE IF NOT EXISTS order_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES dropshipping_orders(id) ON DELETE CASCADE,
    tracking_number VARCHAR(100) NOT NULL,
    carrier VARCHAR(100),
    current_status VARCHAR(50),
    tracking_events JSONB DEFAULT '[]',
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    delivery_attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(order_id, tracking_number)
);

-- Product Performance Analytics
CREATE TABLE IF NOT EXISTS product_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES dropshipping_products(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    orders INTEGER DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    return_rate DECIMAL(5,4) DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    profit_margin DECIMAL(5,4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, date)
);

-- Inventory Health Metrics
CREATE TABLE IF NOT EXISTS inventory_health (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_products INTEGER DEFAULT 0,
    active_products INTEGER DEFAULT 0,
    low_stock_products INTEGER DEFAULT 0,
    out_of_stock_products INTEGER DEFAULT 0,
    avg_stock_level DECIMAL(8,2) DEFAULT 0,
    stock_turnover_rate DECIMAL(6,4) DEFAULT 0,
    dead_stock_value DECIMAL(12,2) DEFAULT 0,
    total_inventory_value DECIMAL(12,2) DEFAULT 0,
    sync_success_rate DECIMAL(5,4) DEFAULT 1.0,
    last_sync_duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Fulfillment Performance Metrics
CREATE TABLE IF NOT EXISTS fulfillment_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_orders INTEGER DEFAULT 0,
    fulfilled_orders INTEGER DEFAULT 0,
    failed_orders INTEGER DEFAULT 0,
    cancelled_orders INTEGER DEFAULT 0,
    avg_processing_time_hours DECIMAL(6,2) DEFAULT 0,
    avg_shipping_time_days DECIMAL(4,1) DEFAULT 0,
    fulfillment_success_rate DECIMAL(5,4) DEFAULT 1.0,
    customer_satisfaction_score DECIMAL(3,2) DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    total_commission DECIMAL(12,2) DEFAULT 0,
    return_rate DECIMAL(5,4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- ===========================
-- NOTIFICATION & ALERT SYSTEM
-- ===========================

-- Enhanced Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert Rules Configuration
CREATE TABLE IF NOT EXISTS alert_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('stock_low', 'stock_out', 'order_failed', 'sync_failed', 'performance_drop')),
    is_active BOOLEAN DEFAULT true,
    conditions JSONB NOT NULL DEFAULT '{}',
    actions JSONB NOT NULL DEFAULT '{}',
    cooldown_minutes INTEGER DEFAULT 60,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    trigger_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- WEBHOOK MANAGEMENT
-- ===========================

-- Webhook Configurations
CREATE TABLE IF NOT EXISTS webhook_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    secret_key TEXT,
    events TEXT[] NOT NULL, -- Array of event types to listen for
    is_active BOOLEAN DEFAULT true,
    retry_attempts INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    headers JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook Event Logs
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    webhook_config_id UUID REFERENCES webhook_configs(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    attempt_count INTEGER DEFAULT 1,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- INDEXES FOR PERFORMANCE
-- ===========================

-- Automation Tasks Indexes
CREATE INDEX IF NOT EXISTS idx_automation_tasks_user_status ON automation_tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_automation_tasks_scheduled_at ON automation_tasks(scheduled_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_automation_tasks_type_priority ON automation_tasks(type, priority);

-- Automation Schedules Indexes
CREATE INDEX IF NOT EXISTS idx_automation_schedules_user_active ON automation_schedules(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_automation_schedules_next_run ON automation_schedules(next_run_at) WHERE is_active = true;

-- Product Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_product_analytics_user_date ON product_analytics(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_product_analytics_product_date ON product_analytics(product_id, date DESC);

-- Inventory Sync Logs Indexes
CREATE INDEX IF NOT EXISTS idx_inventory_sync_logs_user_date ON inventory_sync_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_sync_logs_schedule ON inventory_sync_logs(schedule_id, created_at DESC);

-- Fulfillment Logs Indexes
CREATE INDEX IF NOT EXISTS idx_fulfillment_logs_user_date ON fulfillment_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fulfillment_logs_order ON fulfillment_logs(order_id, created_at DESC);

-- Notifications Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type_priority ON notifications(type, priority);

-- Webhook Logs Indexes
CREATE INDEX IF NOT EXISTS idx_webhook_logs_config_date ON webhook_logs(webhook_config_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_success ON webhook_logs(event_type, success);

-- ===========================
-- ROW LEVEL SECURITY (RLS)
-- ===========================

-- Enable RLS on all tables
ALTER TABLE automation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillment_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user data isolation
CREATE POLICY "Users can only access their own automation tasks" ON automation_tasks
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own automation schedules" ON automation_schedules
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own sync logs" ON inventory_sync_logs
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own fulfillment logs" ON fulfillment_logs
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own analytics" ON product_analytics
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own inventory health" ON inventory_health
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own fulfillment metrics" ON fulfillment_metrics
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own notifications" ON notifications
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own alert rules" ON alert_rules
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own webhook configs" ON webhook_configs
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can access webhook logs for their configs" ON webhook_logs
    FOR ALL USING (
        webhook_config_id IN (
            SELECT id FROM webhook_configs WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can access order tracking for their orders" ON order_tracking
    FOR ALL USING (
        order_id IN (
            SELECT id FROM dropshipping_orders WHERE user_id = auth.uid()
        )
    );

-- ===========================
-- TRIGGERS FOR AUTOMATION
-- ===========================

-- Trigger to update automation schedules next run time
CREATE OR REPLACE FUNCTION update_schedule_next_run()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate next run time based on frequency
    IF NEW.frequency = 'hourly' THEN
        NEW.next_run_at = NEW.last_run_at + INTERVAL '1 hour';
    ELSIF NEW.frequency = 'daily' THEN
        NEW.next_run_at = NEW.last_run_at + INTERVAL '1 day';
    ELSIF NEW.frequency = 'weekly' THEN
        NEW.next_run_at = NEW.last_run_at + INTERVAL '1 week';
    ELSIF NEW.frequency = 'monthly' THEN
        NEW.next_run_at = NEW.last_run_at + INTERVAL '1 month';
    -- For custom frequencies, would need cron expression parsing
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_schedule_next_run
    BEFORE UPDATE ON automation_schedules
    FOR EACH ROW
    WHEN (OLD.last_run_at IS DISTINCT FROM NEW.last_run_at)
    EXECUTE FUNCTION update_schedule_next_run();

-- Trigger to update product performance score
CREATE OR REPLACE FUNCTION update_product_performance()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate performance score based on sales, returns, etc.
    UPDATE dropshipping_products
    SET performance_score = LEAST(5.0, GREATEST(0.0, 
        (total_sales * 0.4) + 
        ((revenue_generated / NULLIF(price, 0)) * 0.3) + 
        (CASE WHEN stock_quantity > low_stock_threshold THEN 1.0 ELSE 0.0 END * 0.3)
    ))
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_performance
    AFTER INSERT OR UPDATE ON product_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_product_performance();

-- ===========================
-- FUNCTIONS FOR AUTOMATION
-- ===========================

-- Function to create automated tasks
CREATE OR REPLACE FUNCTION create_automation_task(
    p_user_id UUID,
    p_type VARCHAR,
    p_config JSONB,
    p_priority VARCHAR DEFAULT 'medium',
    p_schedule_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS UUID AS $$
DECLARE
    task_id UUID;
BEGIN
    INSERT INTO automation_tasks (user_id, type, config, priority, scheduled_at)
    VALUES (p_user_id, p_type, p_config, p_priority, p_schedule_at)
    RETURNING id INTO task_id;
    
    RETURN task_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get dashboard metrics
CREATE OR REPLACE FUNCTION get_dashboard_metrics(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'products', (
            SELECT jsonb_build_object(
                'total', COUNT(*),
                'active', COUNT(*) FILTER (WHERE is_active = true),
                'low_stock', COUNT(*) FILTER (WHERE stock_quantity <= low_stock_threshold AND stock_quantity > 0),
                'out_of_stock', COUNT(*) FILTER (WHERE stock_quantity = 0)
            )
            FROM dropshipping_products
            WHERE user_id = p_user_id
        ),
        'orders', (
            SELECT jsonb_build_object(
                'total', COUNT(*),
                'pending', COUNT(*) FILTER (WHERE status = 'pending'),
                'shipped', COUNT(*) FILTER (WHERE status = 'shipped'),
                'delivered', COUNT(*) FILTER (WHERE status = 'delivered')
            )
            FROM dropshipping_orders
            WHERE user_id = p_user_id
            AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        ),
        'automation', (
            SELECT jsonb_build_object(
                'active_schedules', COUNT(*) FILTER (WHERE is_active = true),
                'tasks_today', (
                    SELECT COUNT(*)
                    FROM automation_tasks
                    WHERE user_id = p_user_id
                    AND created_at >= CURRENT_DATE
                ),
                'success_rate', COALESCE(
                    ROUND(
                        COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / 
                        NULLIF(COUNT(*) FILTER (WHERE status IN ('completed', 'failed')), 0) * 100,
                        1
                    ), 0
                )
            )
            FROM automation_schedules
            WHERE user_id = p_user_id
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;