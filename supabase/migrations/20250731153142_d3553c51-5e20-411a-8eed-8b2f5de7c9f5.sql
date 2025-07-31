-- Add new columns to profiles table for creator onboarding
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS tagline text,
ADD COLUMN IF NOT EXISTS location jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS social_handles jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS niches text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS professional_level integer,
ADD COLUMN IF NOT EXISTS content_styles text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS collaboration_types text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS rate_range jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS preferred_sectors text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS avoided_sectors text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS availability_hours text,
ADD COLUMN IF NOT EXISTS geographic_scope text,
ADD COLUMN IF NOT EXISTS content_examples text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Create storage bucket for creator content examples and avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('creator-content', 'creator-content', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage policies for creator content uploads
CREATE POLICY "Users can upload their own content examples" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'creator-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own content examples" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'creator-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Content examples are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'creator-content');

-- Create storage policies for avatars
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatars are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');