-- Create API Configurations table
CREATE TABLE IF NOT EXISTS api_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  configurations JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create System Environment table for deployment
CREATE TABLE IF NOT EXISTS system_environment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  environment_variables JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create API Usage Log table
CREATE TABLE IF NOT EXISTS api_usage_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service TEXT NOT NULL,
  action TEXT NOT NULL,
  credits_used INTEGER NOT NULL DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  request_data JSONB,
  response_data JSONB,
  success BOOLEAN DEFAULT TRUE
);

-- Create API Endpoints Configuration table
CREATE TABLE IF NOT EXISTS api_endpoints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  authentication JSONB NOT NULL,
  endpoints JSONB NOT NULL DEFAULT '{}',
  rate_limits JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create API Limits table
CREATE TABLE IF NOT EXISTS api_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  api_name TEXT NOT NULL,
  daily_limit INTEGER NOT NULL DEFAULT 1000,
  monthly_limit INTEGER NOT NULL DEFAULT 30000,
  daily_used INTEGER NOT NULL DEFAULT 0,
  monthly_used INTEGER NOT NULL DEFAULT 0,
  reset_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, api_name)
);

-- Create API Usage table
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  api_name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  request_data JSONB,
  response_status INTEGER,
  response_data JSONB,
  credits_used INTEGER NOT NULL DEFAULT 1,
  execution_time INTEGER, -- in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_configurations_user_id ON api_configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_system_environment_user_id ON system_environment(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_log_user_id ON api_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_log_service ON api_usage_log(service);
CREATE INDEX IF NOT EXISTS idx_api_usage_log_timestamp ON api_usage_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_api_limits_user_id ON api_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at);

-- Enable Row Level Security
ALTER TABLE api_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_environment ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own API configurations" ON api_configurations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own system environment" ON system_environment
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own API usage log" ON api_usage_log
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own API limits" ON api_limits
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own API usage" ON api_usage
  FOR ALL USING (auth.uid() = user_id);

-- Insert default API endpoint configurations
INSERT INTO api_endpoints (api_name, base_url, authentication, endpoints, rate_limits) VALUES
('openai', 'https://api.openai.com/v1', 
  '{"type": "bearer", "header": "Authorization", "prefix": "Bearer "}',
  '{
    "/chat/completions": {"credits": 5, "method": "POST"},
    "/images/generations": {"credits": 15, "method": "POST"},
    "/threads": {"credits": 10, "method": "POST"}
  }',
  '{"requests_per_minute": 60, "requests_per_hour": 3600}'
),
('elevenlabs', 'https://api.elevenlabs.io/v1',
  '{"type": "header", "header": "xi-api-key"}',
  '{
    "/text-to-speech": {"credits": 8, "method": "POST"},
    "/voices": {"credits": 1, "method": "GET"}
  }',
  '{"requests_per_minute": 30, "requests_per_hour": 1800}'
),
('replicate', 'https://api.replicate.com/v1',
  '{"type": "bearer", "header": "Authorization", "prefix": "Token "}',
  '{
    "/predictions": {"credits": 12, "method": "POST"}
  }',
  '{"requests_per_minute": 30, "requests_per_hour": 1000}'
),
('gupshup', 'https://api.gupshup.io/wa/api/v1',
  '{"type": "header", "header": "apikey"}',
  '{
    "/msg": {"credits": 2, "method": "POST"},
    "/users": {"credits": 1, "method": "GET"}
  }',
  '{"requests_per_minute": 100, "requests_per_hour": 6000}'
),
('facebook', 'https://graph.facebook.com/v18.0',
  '{"type": "query", "parameter": "access_token"}',
  '{
    "/campaigns": {"credits": 20, "method": "POST"},
    "/adsets": {"credits": 15, "method": "POST"},
    "/ads": {"credits": 10, "method": "POST"}
  }',
  '{"requests_per_minute": 200, "requests_per_hour": 4800}'
),
('cj_dropshipping', 'https://developers.cjdropshipping.com/api2.0/v1',
  '{"type": "header", "header": "CJ-Access-Token"}',
  '{
    "/product/list": {"credits": 3, "method": "POST"},
    "/product/query": {"credits": 2, "method": "POST"},
    "/shopping/order/createOrder": {"credits": 10, "method": "POST"}
  }',
  '{"requests_per_minute": 60, "requests_per_hour": 1000}'
),
('unsplash', 'https://api.unsplash.com',
  '{"type": "bearer", "header": "Authorization", "prefix": "Client-ID "}',
  '{
    "/search/photos": {"credits": 1, "method": "GET"},
    "/photos/random": {"credits": 1, "method": "GET"}
  }',
  '{"requests_per_minute": 50, "requests_per_hour": 5000}'
)
ON CONFLICT (api_name) DO NOTHING;

-- Create function to reset daily API limits
CREATE OR REPLACE FUNCTION reset_daily_api_limits()
RETURNS void AS $$
BEGIN
  UPDATE api_limits 
  SET daily_used = 0, reset_date = CURRENT_DATE
  WHERE reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Create function to reset monthly API limits (first day of month)
CREATE OR REPLACE FUNCTION reset_monthly_api_limits()
RETURNS void AS $$
BEGIN
  UPDATE api_limits 
  SET monthly_used = 0
  WHERE EXTRACT(day FROM CURRENT_DATE) = 1;
END;
$$ LANGUAGE plpgsql;