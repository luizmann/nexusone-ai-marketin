/**
 * Database Schema Extensions for CJ Dropshipping and WhatsApp Business
 * 
 * This file contains Supabase SQL schema definitions for all tables
 * required to support CJ Dropshipping and WhatsApp Business integrations.
 */

-- ==================== CJ DROPSHIPPING TABLES ====================

-- Dropshipping catalog table (extended)
CREATE TABLE IF NOT EXISTS dropshipping_catalog (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    external_id VARCHAR(255) NOT NULL, -- CJ product ID
    name VARCHAR(500) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    image_url TEXT,
    images JSONB DEFAULT '[]',
    category VARCHAR(255),
    tags JSONB DEFAULT '[]',
    stock_quantity INTEGER DEFAULT 0,
    supplier VARCHAR(100) NOT NULL DEFAULT 'cj_dropshipping',
    supplier_data JSONB DEFAULT '{}', -- weight, shipping, variants, etc.
    imported_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dropshipping_catalog_external_id ON dropshipping_catalog(external_id);
CREATE INDEX IF NOT EXISTS idx_dropshipping_catalog_supplier ON dropshipping_catalog(supplier);
CREATE INDEX IF NOT EXISTS idx_dropshipping_catalog_category ON dropshipping_catalog(category);
CREATE INDEX IF NOT EXISTS idx_dropshipping_catalog_price ON dropshipping_catalog(price);
CREATE INDEX IF NOT EXISTS idx_dropshipping_catalog_active ON dropshipping_catalog(is_active);

-- CJ Dropshipping orders table
CREATE TABLE IF NOT EXISTS dropshipping_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    external_order_id VARCHAR(255), -- CJ order number
    client_order_id VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    products JSONB NOT NULL, -- Order products array
    shipping_address JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    supplier VARCHAR(100) NOT NULL DEFAULT 'cj_dropshipping',
    tracking_number VARCHAR(255),
    tracking_data JSONB DEFAULT '{}',
    supplier_response JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for orders
CREATE INDEX IF NOT EXISTS idx_dropshipping_orders_user_id ON dropshipping_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_dropshipping_orders_status ON dropshipping_orders(status);
CREATE INDEX IF NOT EXISTS idx_dropshipping_orders_external_id ON dropshipping_orders(external_order_id);
CREATE INDEX IF NOT EXISTS idx_dropshipping_orders_client_id ON dropshipping_orders(client_order_id);

-- CJ Product sync log
CREATE TABLE IF NOT EXISTS cj_product_sync_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    operation VARCHAR(50) NOT NULL, -- 'import', 'update', 'sync'
    product_ids JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    processed_count INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- CJ API usage tracking
CREATE TABLE IF NOT EXISTS cj_api_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    request_data JSONB,
    response_status INTEGER,
    response_data JSONB,
    execution_time INTEGER, -- milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== WHATSAPP BUSINESS TABLES ====================

-- WhatsApp Business configuration
CREATE TABLE IF NOT EXISTS whatsapp_business_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    phone_number_id VARCHAR(255) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_description TEXT,
    business_category VARCHAR(100),
    working_days JSONB NOT NULL DEFAULT '{}',
    services JSONB NOT NULL DEFAULT '[]',
    time_slot_duration INTEGER DEFAULT 30, -- minutes
    advance_booking_days INTEGER DEFAULT 30,
    timezone VARCHAR(100) DEFAULT 'UTC',
    ai_prompt_template TEXT,
    auto_respond BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for business config
CREATE INDEX IF NOT EXISTS idx_whatsapp_business_config_user_id ON whatsapp_business_config(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_business_config_phone_id ON whatsapp_business_config(phone_number_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_business_config_active ON whatsapp_business_config(is_active);

-- WhatsApp messages log
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    phone_number_id VARCHAR(255) NOT NULL,
    direction VARCHAR(10) NOT NULL, -- 'inbound' or 'outbound'
    message_type VARCHAR(50) NOT NULL,
    content TEXT,
    message_id VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'sent',
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for messages
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone_number ON whatsapp_messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone_number_id ON whatsapp_messages(phone_number_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_direction ON whatsapp_messages(direction);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_timestamp ON whatsapp_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_message_id ON whatsapp_messages(message_id);

-- WhatsApp contacts
CREATE TABLE IF NOT EXISTS whatsapp_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    phone_number_id VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    profile_picture TEXT,
    status VARCHAR(100),
    last_seen TIMESTAMP WITH TIME ZONE,
    tags JSONB DEFAULT '[]',
    custom_fields JSONB DEFAULT '{}',
    conversation_state JSONB DEFAULT '{}', -- for chatbot state management
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(phone_number, phone_number_id)
);

-- Create indexes for contacts
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_phone_number ON whatsapp_contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_phone_number_id ON whatsapp_contacts(phone_number_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_name ON whatsapp_contacts(name);

-- WhatsApp appointments
CREATE TABLE IF NOT EXISTS whatsapp_appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES whatsapp_business_config(id) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    customer_name VARCHAR(255),
    service_id VARCHAR(255),
    service_name VARCHAR(255),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER DEFAULT 30, -- minutes
    price DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, cancelled, completed, no_show
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for appointments
CREATE INDEX IF NOT EXISTS idx_whatsapp_appointments_business_id ON whatsapp_appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_appointments_phone_number ON whatsapp_appointments(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_appointments_date ON whatsapp_appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_whatsapp_appointments_status ON whatsapp_appointments(status);

-- WhatsApp templates
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    phone_number_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    components JSONB NOT NULL,
    template_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp campaigns
CREATE TABLE IF NOT EXISTS whatsapp_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    phone_number_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_id UUID REFERENCES whatsapp_templates(id),
    target_contacts JSONB NOT NULL DEFAULT '[]',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, running, completed, failed
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    read_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ==================== INTEGRATION ANALYTICS TABLES ====================

-- API usage analytics
CREATE TABLE IF NOT EXISTS integration_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    integration_type VARCHAR(50) NOT NULL, -- 'cj_dropshipping', 'whatsapp_business'
    operation VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'success', 'error', 'timeout'
    execution_time INTEGER, -- milliseconds
    cost_credits INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_integration_analytics_user_id ON integration_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_analytics_integration_type ON integration_analytics(integration_type);
CREATE INDEX IF NOT EXISTS idx_integration_analytics_operation ON integration_analytics(operation);
CREATE INDEX IF NOT EXISTS idx_integration_analytics_created_at ON integration_analytics(created_at);

-- User integration settings
CREATE TABLE IF NOT EXISTS user_integration_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    integration_type VARCHAR(50) NOT NULL,
    configuration JSONB NOT NULL DEFAULT '{}',
    credentials JSONB NOT NULL DEFAULT '{}', -- encrypted
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, integration_type)
);

-- ==================== ROW LEVEL SECURITY (RLS) POLICIES ====================

-- Enable RLS on all tables
ALTER TABLE dropshipping_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropshipping_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cj_product_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE cj_api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_business_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integration_settings ENABLE ROW LEVEL SECURITY;

-- Dropshipping catalog policies
CREATE POLICY "Users can view all dropshipping catalog" ON dropshipping_catalog
    FOR SELECT USING (true);

CREATE POLICY "Users can insert dropshipping catalog" ON dropshipping_catalog
    FOR INSERT WITH CHECK (auth.uid() = imported_by);

CREATE POLICY "Users can update their dropshipping catalog" ON dropshipping_catalog
    FOR UPDATE USING (auth.uid() = imported_by);

-- Dropshipping orders policies
CREATE POLICY "Users can view their dropshipping orders" ON dropshipping_orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their dropshipping orders" ON dropshipping_orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their dropshipping orders" ON dropshipping_orders
    FOR UPDATE USING (auth.uid() = user_id);

-- CJ sync log policies
CREATE POLICY "Users can view their sync logs" ON cj_product_sync_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their sync logs" ON cj_product_sync_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- WhatsApp business config policies
CREATE POLICY "Users can manage their whatsapp config" ON whatsapp_business_config
    FOR ALL USING (auth.uid() = user_id);

-- WhatsApp messages policies
CREATE POLICY "Users can view messages for their phone numbers" ON whatsapp_messages
    FOR SELECT USING (
        phone_number_id IN (
            SELECT phone_number_id FROM whatsapp_business_config 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service can insert whatsapp messages" ON whatsapp_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update whatsapp messages" ON whatsapp_messages
    FOR UPDATE USING (true);

-- WhatsApp contacts policies
CREATE POLICY "Users can view contacts for their phone numbers" ON whatsapp_contacts
    FOR ALL USING (
        phone_number_id IN (
            SELECT phone_number_id FROM whatsapp_business_config 
            WHERE user_id = auth.uid()
        )
    );

-- WhatsApp appointments policies
CREATE POLICY "Users can view appointments for their business" ON whatsapp_appointments
    FOR ALL USING (
        business_id IN (
            SELECT id FROM whatsapp_business_config 
            WHERE user_id = auth.uid()
        )
    );

-- WhatsApp templates policies
CREATE POLICY "Users can manage their whatsapp templates" ON whatsapp_templates
    FOR ALL USING (auth.uid() = user_id);

-- WhatsApp campaigns policies
CREATE POLICY "Users can manage their whatsapp campaigns" ON whatsapp_campaigns
    FOR ALL USING (auth.uid() = user_id);

-- Integration analytics policies
CREATE POLICY "Users can view their integration analytics" ON integration_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can insert integration analytics" ON integration_analytics
    FOR INSERT WITH CHECK (true);

-- User integration settings policies
CREATE POLICY "Users can manage their integration settings" ON user_integration_settings
    FOR ALL USING (auth.uid() = user_id);

-- ==================== FUNCTIONS AND TRIGGERS ====================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_dropshipping_catalog_updated_at 
    BEFORE UPDATE ON dropshipping_catalog 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dropshipping_orders_updated_at 
    BEFORE UPDATE ON dropshipping_orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_business_config_updated_at 
    BEFORE UPDATE ON whatsapp_business_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_messages_updated_at 
    BEFORE UPDATE ON whatsapp_messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_contacts_updated_at 
    BEFORE UPDATE ON whatsapp_contacts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_appointments_updated_at 
    BEFORE UPDATE ON whatsapp_appointments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_integration_settings_updated_at 
    BEFORE UPDATE ON user_integration_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log API usage
CREATE OR REPLACE FUNCTION log_integration_usage(
    p_user_id UUID,
    p_integration_type VARCHAR(50),
    p_operation VARCHAR(100),
    p_status VARCHAR(50),
    p_execution_time INTEGER DEFAULT NULL,
    p_cost_credits INTEGER DEFAULT 0,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO integration_analytics (
        user_id,
        integration_type,
        operation,
        status,
        execution_time,
        cost_credits,
        metadata
    ) VALUES (
        p_user_id,
        p_integration_type,
        p_operation,
        p_status,
        p_execution_time,
        p_cost_credits,
        p_metadata
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;