-- Drop existing policies if they exist to recreate them properly
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Creator content is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own content" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own content" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own content" ON storage.objects;

-- Create policies for avatar storage
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for creator content storage
CREATE POLICY "Creator content is publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'creator-content');

CREATE POLICY "Users can upload their own content" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'creator-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own content" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'creator-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own content" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'creator-content' AND auth.uid()::text = (storage.foldername(name))[1]);