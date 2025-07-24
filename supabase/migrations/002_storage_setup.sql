-- Enable Row Level Security for storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif']),
  ('landing-pages', 'landing-pages', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('generated-content', 'generated-content', true, 52428800, ARRAY['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg']),
  ('user-uploads', 'user-uploads', false, 10485760, ARRAY['image/jpeg', 'image/png', 'application/pdf', 'text/plain']),
  ('video-assets', 'video-assets', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('ai-generated', 'ai-generated', false, 52428800, ARRAY['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg', 'audio/wav']);

-- Storage policies
-- Avatars bucket - users can upload their own avatars
CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Landing pages assets - users can upload assets for their landing pages
CREATE POLICY "Users can upload landing page assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'landing-pages' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Landing page assets are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'landing-pages');

-- Generated content - AI generated content storage
CREATE POLICY "Users can access own generated content" ON storage.objects
  FOR ALL USING (
    bucket_id = 'generated-content' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- User uploads - private files
CREATE POLICY "Users can manage own uploads" ON storage.objects
  FOR ALL USING (
    bucket_id = 'user-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Video assets - public video content
CREATE POLICY "Video assets are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'video-assets');

CREATE POLICY "Users can upload video assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'video-assets' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- AI generated files - private AI content
CREATE POLICY "Users can manage AI generated files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'ai-generated' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to clean up old files
CREATE OR REPLACE FUNCTION cleanup_old_storage_files()
RETURNS void AS $$
BEGIN
  -- Delete files older than 30 days from temporary buckets
  DELETE FROM storage.objects 
  WHERE bucket_id IN ('ai-generated', 'user-uploads') 
  AND created_at < NOW() - INTERVAL '30 days';
  
  -- Delete orphaned files (no corresponding database record)
  DELETE FROM storage.objects 
  WHERE bucket_id = 'generated-content'
  AND created_at < NOW() - INTERVAL '7 days'
  AND NOT EXISTS (
    SELECT 1 FROM public.ai_content 
    WHERE content->>'file_path' = storage.objects.name
  );
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup function (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-storage', '0 2 * * *', 'SELECT cleanup_old_storage_files();');