-- Create API configurations table
CREATE TABLE IF NOT EXISTS api_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  api_name TEXT NOT NULL,
  api_key TEXT,
  enabled BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'disconnected',
  endpoint TEXT,
  test_endpoint TEXT,
  last_tested TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE api_configurations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own API configs" ON api_configurations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own API configs" ON api_configurations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own API configs" ON api_configurations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own API configs" ON api_configurations FOR DELETE USING (auth.uid() = user_id);

-- Create API usage tracking table
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  api_name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  request_data JSONB,
  response_status INTEGER,
  response_data JSONB,
  credits_used INTEGER DEFAULT 0,
  execution_time INTEGER, -- in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for API usage
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own API usage" ON api_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own API usage" ON api_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create API limits table
CREATE TABLE IF NOT EXISTS api_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  api_name TEXT NOT NULL,
  daily_limit INTEGER DEFAULT 1000,
  monthly_limit INTEGER DEFAULT 30000,
  daily_used INTEGER DEFAULT 0,
  monthly_used INTEGER DEFAULT 0,
  reset_daily TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 day',
  reset_monthly TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, api_name)
);

-- Enable RLS for API limits
ALTER TABLE api_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own API limits" ON api_limits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own API limits" ON api_limits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own API limits" ON api_limits FOR UPDATE USING (auth.uid() = user_id);

-- Create API endpoints configuration
CREATE TABLE IF NOT EXISTS api_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_name TEXT NOT NULL UNIQUE,
  base_url TEXT NOT NULL,
  endpoints JSONB NOT NULL, -- Configuration for all endpoints
  authentication JSONB NOT NULL, -- Auth configuration
  rate_limits JSONB, -- Rate limiting config
  documentation_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default API endpoints configuration
INSERT INTO api_endpoints (api_name, base_url, endpoints, authentication, rate_limits, documentation_url) VALUES 
(
  'openai',
  'https://api.openai.com/v1',
  '{
    "chat_completions": {
      "path": "/chat/completions",
      "method": "POST",
      "credits": 10
    },
    "images_generations": {
      "path": "/images/generations", 
      "method": "POST",
      "credits": 15
    },
    "assistants": {
      "path": "/assistants",
      "method": "GET",
      "credits": 1
    },
    "threads": {
      "path": "/threads",
      "method": "POST", 
      "credits": 5
    }
  }',
  '{
    "type": "bearer",
    "header": "Authorization",
    "prefix": "Bearer "
  }',
  '{
    "requests_per_minute": 3500,
    "tokens_per_minute": 90000
  }',
  'https://platform.openai.com/docs'
),
(
  'elevenlabs',
  'https://api.elevenlabs.io/v1',
  '{
    "text_to_speech": {
      "path": "/text-to-speech/{voice_id}",
      "method": "POST",
      "credits": 20
    },
    "voices": {
      "path": "/voices",
      "method": "GET",
      "credits": 1
    }
  }',
  '{
    "type": "header",
    "header": "xi-api-key"
  }',
  '{
    "requests_per_minute": 100,
    "characters_per_month": 10000
  }',
  'https://docs.elevenlabs.io/'
),
(
  'replicate',
  'https://api.replicate.com/v1',
  '{
    "predictions": {
      "path": "/predictions",
      "method": "POST",
      "credits": 25
    },
    "models": {
      "path": "/models",
      "method": "GET",
      "credits": 1
    }
  }',
  '{
    "type": "bearer",
    "header": "Authorization",
    "prefix": "Token "
  }',
  '{
    "requests_per_minute": 100
  }',
  'https://replicate.com/docs'
),
(
  'gupshup',
  'https://api.gupshup.io/wa',
  '{
    "send_message": {
      "path": "/api/v1/msg",
      "method": "POST",
      "credits": 5
    },
    "get_users": {
      "path": "/api/v1/users",
      "method": "GET", 
      "credits": 1
    },
    "webhook": {
      "path": "/api/v1/webhook",
      "method": "POST",
      "credits": 0
    }
  }',
  '{
    "type": "header",
    "header": "apikey"
  }',
  '{
    "requests_per_minute": 1000
  }',
  'https://docs.gupshup.io/'
),
(
  'cj_dropshipping',
  'https://developers.cjdropshipping.com/api2.0',
  '{
    "product_list": {
      "path": "/v1/product/list",
      "method": "POST",
      "credits": 3
    },
    "product_detail": {
      "path": "/v1/product/query",
      "method": "POST", 
      "credits": 5
    },
    "create_order": {
      "path": "/v1/shopping/order/createOrder",
      "method": "POST",
      "credits": 10
    },
    "order_status": {
      "path": "/v1/shopping/order/getOrderDetail",
      "method": "POST",
      "credits": 2
    }
  }',
  '{
    "type": "header",
    "header": "CJ-Access-Token"
  }',
  '{
    "requests_per_minute": 600
  }',
  'https://developers.cjdropshipping.com/'
),
(
  'facebook_marketing',
  'https://graph.facebook.com/v18.0',
  '{
    "ad_accounts": {
      "path": "/me/adaccounts",
      "method": "GET",
      "credits": 5
    },
    "create_campaign": {
      "path": "/{ad_account_id}/campaigns",
      "method": "POST",
      "credits": 20
    },
    "create_adset": {
      "path": "/{ad_account_id}/adsets", 
      "method": "POST",
      "credits": 15
    },
    "create_ad": {
      "path": "/{ad_account_id}/ads",
      "method": "POST",
      "credits": 10
    }
  }',
  '{
    "type": "query",
    "parameter": "access_token"
  }',
  '{
    "requests_per_hour": 200
  }',
  'https://developers.facebook.com/docs/marketing-apis'
),
(
  'unsplash',
  'https://api.unsplash.com',
  '{
    "photos": {
      "path": "/photos",
      "method": "GET",
      "credits": 2
    },
    "search": {
      "path": "/search/photos",
      "method": "GET", 
      "credits": 3
    },
    "download": {
      "path": "/photos/{id}/download",
      "method": "GET",
      "credits": 5
    }
  }',
  '{
    "type": "header",
    "header": "Authorization",
    "prefix": "Client-ID "
  }',
  '{
    "requests_per_hour": 5000
  }',
  'https://unsplash.com/documentation'
),
(
  'luma_ai',
  'https://api.lumalabs.ai/v1',
  '{
    "generate_video": {
      "path": "/generations",
      "method": "POST",
      "credits": 50
    },
    "get_generation": {
      "path": "/generations/{id}",
      "method": "GET",
      "credits": 1
    }
  }',
  '{
    "type": "bearer",
    "header": "Authorization",
    "prefix": "Bearer "
  }',
  '{
    "requests_per_minute": 10
  }',
  'https://docs.lumalabs.ai/'
);

-- Function to reset daily/monthly limits
CREATE OR REPLACE FUNCTION reset_api_limits()
RETURNS void AS $$
BEGIN
  -- Reset daily limits
  UPDATE api_limits 
  SET daily_used = 0, reset_daily = NOW() + INTERVAL '1 day'
  WHERE reset_daily <= NOW();
  
  -- Reset monthly limits  
  UPDATE api_limits
  SET monthly_used = 0, reset_monthly = NOW() + INTERVAL '1 month'
  WHERE reset_monthly <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_api_configurations_updated_at BEFORE UPDATE ON api_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_limits_updated_at BEFORE UPDATE ON api_limits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_endpoints_updated_at BEFORE UPDATE ON api_endpoints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();