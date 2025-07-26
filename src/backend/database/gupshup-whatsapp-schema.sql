-- GupShup WhatsApp AI Database Schema
-- Advanced conversation tracking and AI optimization

-- Conversations tracking table
CREATE TABLE IF NOT EXISTS whatsapp_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    phone_number TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'greeting',
    intent TEXT NOT NULL DEFAULT 'information',
    lead_score INTEGER DEFAULT 25,
    conversion_probability INTEGER DEFAULT 15,
    urgency_level TEXT DEFAULT 'low',
    pain_points TEXT[] DEFAULT '{}',
    products_shown TEXT[] DEFAULT '{}',
    budget_range TEXT,
    previous_interactions INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Message logs for detailed tracking
CREATE TABLE IF NOT EXISTS whatsapp_message_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES whatsapp_conversations(id),
    phone_number TEXT NOT NULL,
    direction TEXT NOT NULL, -- 'inbound' or 'outbound'
    message_content JSONB NOT NULL,
    message_type TEXT DEFAULT 'text',
    success BOOLEAN DEFAULT true,
    gupshup_message_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- AI personalities configuration
CREATE TABLE IF NOT EXISTS ai_personalities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    tone TEXT DEFAULT 'friendly',
    approach TEXT DEFAULT 'consultative',
    expertise TEXT[] DEFAULT '{}',
    sales_style TEXT DEFAULT 'problem_solver',
    custom_prompts JSONB DEFAULT '{}'::jsonb,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled messages for follow-up automation
CREATE TABLE IF NOT EXISTS scheduled_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    phone_number TEXT NOT NULL,
    message JSONB NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversion tracking
CREATE TABLE IF NOT EXISTS whatsapp_conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES whatsapp_conversations(id),
    user_id UUID REFERENCES auth.users(id),
    phone_number TEXT NOT NULL,
    conversion_type TEXT NOT NULL, -- 'sale', 'appointment', 'signup', 'download'
    conversion_value DECIMAL(10,2),
    currency TEXT DEFAULT 'BRL',
    products TEXT[] DEFAULT '{}',
    conversion_stage TEXT,
    attribution_data JSONB DEFAULT '{}'::jsonb,
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GupShup API configuration
CREATE TABLE IF NOT EXISTS gupshup_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    api_key TEXT NOT NULL,
    app_name TEXT NOT NULL,
    source_number TEXT,
    webhook_url TEXT,
    active BOOLEAN DEFAULT true,
    daily_message_limit INTEGER DEFAULT 1000,
    current_daily_count INTEGER DEFAULT 0,
    last_reset_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign tracking
CREATE TABLE IF NOT EXISTS whatsapp_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    message_template JSONB NOT NULL,
    target_audience JSONB DEFAULT '{}'::jsonb,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'running', 'completed', 'paused'
    total_recipients INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    responses_received INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance analytics
CREATE TABLE IF NOT EXISTS whatsapp_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    date DATE DEFAULT CURRENT_DATE,
    total_conversations INTEGER DEFAULT 0,
    new_conversations INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    messages_received INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    average_response_time INTEGER, -- in seconds
    lead_quality_score DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_personalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gupshup_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for whatsapp_conversations
CREATE POLICY "Users can view own conversations" ON whatsapp_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON whatsapp_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON whatsapp_conversations
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for whatsapp_message_logs
CREATE POLICY "Users can view own message logs" ON whatsapp_message_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own message logs" ON whatsapp_message_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for ai_personalities
CREATE POLICY "Users can manage own AI personalities" ON ai_personalities
    FOR ALL USING (auth.uid() = user_id);

-- Policies for scheduled_messages
CREATE POLICY "Users can manage own scheduled messages" ON scheduled_messages
    FOR ALL USING (auth.uid() = user_id);

-- Policies for whatsapp_conversions
CREATE POLICY "Users can view own conversions" ON whatsapp_conversions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversions" ON whatsapp_conversions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for gupshup_configurations
CREATE POLICY "Users can manage own GupShup config" ON gupshup_configurations
    FOR ALL USING (auth.uid() = user_id);

-- Policies for whatsapp_campaigns
CREATE POLICY "Users can manage own campaigns" ON whatsapp_campaigns
    FOR ALL USING (auth.uid() = user_id);

-- Policies for whatsapp_analytics
CREATE POLICY "Users can view own analytics" ON whatsapp_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON whatsapp_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_user_id ON whatsapp_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_phone ON whatsapp_conversations(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_stage ON whatsapp_conversations(stage);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_score ON whatsapp_conversations(lead_score);

CREATE INDEX IF NOT EXISTS idx_message_logs_conversation ON whatsapp_message_logs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_phone ON whatsapp_message_logs(phone_number);
CREATE INDEX IF NOT EXISTS idx_message_logs_timestamp ON whatsapp_message_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_scheduled_messages_scheduled_for ON scheduled_messages(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_status ON scheduled_messages(status);

CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON whatsapp_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_date ON whatsapp_conversions(converted_at);

CREATE INDEX IF NOT EXISTS idx_analytics_user_date ON whatsapp_analytics(user_id, date);

-- Functions for automation

-- Function to update conversation context
CREATE OR REPLACE FUNCTION update_conversation_context()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    
    -- Auto-update analytics
    INSERT INTO whatsapp_analytics (user_id, date, total_conversations)
    VALUES (NEW.user_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, date) 
    DO UPDATE SET total_conversations = whatsapp_analytics.total_conversations + 1;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for conversation updates
CREATE TRIGGER trigger_update_conversation_context
    BEFORE UPDATE ON whatsapp_conversations
    FOR EACH ROW EXECUTE FUNCTION update_conversation_context();

-- Function to process scheduled messages
CREATE OR REPLACE FUNCTION process_scheduled_messages()
RETURNS void AS $$
BEGIN
    -- Mark messages as ready to send
    UPDATE scheduled_messages 
    SET status = 'ready'
    WHERE status = 'pending' 
    AND scheduled_for <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(
    p_interactions INTEGER,
    p_stage TEXT,
    p_intent TEXT,
    p_urgency TEXT,
    p_pain_points TEXT[]
)
RETURNS INTEGER AS $$
DECLARE
    base_score INTEGER := 25;
    stage_bonus INTEGER := 0;
    intent_bonus INTEGER := 0;
    urgency_bonus INTEGER := 0;
    interaction_bonus INTEGER := 0;
    pain_bonus INTEGER := 0;
BEGIN
    -- Stage scoring
    CASE p_stage
        WHEN 'greeting' THEN stage_bonus := 0;
        WHEN 'qualification' THEN stage_bonus := 15;
        WHEN 'presentation' THEN stage_bonus := 25;
        WHEN 'objection' THEN stage_bonus := 20;
        WHEN 'closing' THEN stage_bonus := 35;
        WHEN 'follow_up' THEN stage_bonus := 10;
        ELSE stage_bonus := 0;
    END CASE;
    
    -- Intent scoring
    CASE p_intent
        WHEN 'shopping' THEN intent_bonus := 20;
        WHEN 'appointment' THEN intent_bonus := 15;
        WHEN 'information' THEN intent_bonus := 5;
        WHEN 'support' THEN intent_bonus := 3;
        WHEN 'complaint' THEN intent_bonus := -5;
        ELSE intent_bonus := 0;
    END CASE;
    
    -- Urgency scoring
    CASE p_urgency
        WHEN 'high' THEN urgency_bonus := 15;
        WHEN 'medium' THEN urgency_bonus := 8;
        WHEN 'low' THEN urgency_bonus := 0;
        ELSE urgency_bonus := 0;
    END CASE;
    
    -- Interaction bonus (more interactions = higher score, up to a limit)
    interaction_bonus := LEAST(p_interactions * 2, 20);
    
    -- Pain points bonus
    pain_bonus := array_length(p_pain_points, 1) * 3;
    
    RETURN LEAST(100, base_score + stage_bonus + intent_bonus + urgency_bonus + interaction_bonus + pain_bonus);
END;
$$ LANGUAGE plpgsql;

-- Insert sample AI personalities
INSERT INTO ai_personalities (user_id, name, role, tone, approach, expertise, sales_style, custom_prompts) VALUES
(
    '00000000-0000-0000-0000-000000000000', -- placeholder user_id
    'Sofia Martinez',
    'Consultora de Automação Especializada',
    'friendly',
    'consultative',
    ARRAY['Marketing Digital', 'Inteligência Artificial', 'Automação de Vendas', 'ROI'],
    'problem_solver',
    '{
        "greeting": "Oi! 👋 Sou a Sofia, especialista em automação. Como posso ajudar você a aumentar suas vendas hoje?",
        "qualification": "Entendi! Para te ajudar melhor, me conta: qual o maior desafio que você tem com vendas atualmente?",
        "presentation": "Perfeito! Tenho uma solução que já ajudou +500 empresas a aumentarem vendas em 300%. Quer ver como funciona?",
        "objection_handling": "Entendo sua preocupação! Muitos clientes pensavam assim antes de ver os resultados. Que tal uma demonstração gratuita?",
        "closing": "Excelente! Para garantir o melhor resultado, podemos começar hoje mesmo. Prefere o plano Pro ou Premium?",
        "follow_up": "Oi! Lembrou da nossa conversa sobre automação? Tenho uma novidade que pode te interessar! 🚀"
    }'::jsonb
) ON CONFLICT DO NOTHING;

-- Insert sample GupShup configuration
INSERT INTO gupshup_configurations (user_id, api_key, app_name, source_number, active) VALUES
(
    '00000000-0000-0000-0000-000000000000', -- placeholder user_id
    'sample_api_key',
    'nexusone',
    '917834811114',
    false
) ON CONFLICT DO NOTHING;