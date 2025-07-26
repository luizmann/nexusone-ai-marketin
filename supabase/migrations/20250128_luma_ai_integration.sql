-- Luma AI Video Generations Table
CREATE TABLE IF NOT EXISTS luma_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    generation_id TEXT NOT NULL UNIQUE,
    prompt TEXT NOT NULL,
    quality TEXT NOT NULL CHECK (quality IN ('720p', '1080p', '4K')),
    style TEXT NOT NULL CHECK (style IN ('cinematic', 'commercial', 'realistic', 'artistic')),
    aspect_ratio TEXT DEFAULT '16:9',
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    video_url TEXT,
    thumbnail_url TEXT,
    duration INTEGER,
    credits_used INTEGER NOT NULL,
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE luma_generations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own Luma generations" ON luma_generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Luma generations" ON luma_generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Luma generations" ON luma_generations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Luma generations" ON luma_generations
    FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_luma_generations_user_id ON luma_generations(user_id);
CREATE INDEX idx_luma_generations_status ON luma_generations(status);
CREATE INDEX idx_luma_generations_created_at ON luma_generations(created_at);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_luma_generations_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_luma_generations_timestamp
    BEFORE UPDATE ON luma_generations
    FOR EACH ROW
    EXECUTE FUNCTION update_luma_generations_timestamp();