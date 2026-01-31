-- Storage Setup for Supabase
-- Create storage buckets and policies for avatars and post images
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
-- Create post-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true) ON CONFLICT (id) DO NOTHING;
-- Storage policies for avatars bucket
-- Allow public read access to avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR
SELECT USING (bucket_id = 'avatars');
-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
    );
-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR
UPDATE USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    ) WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    );
-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name)) [1]
);
-- Storage policies for post-images bucket
-- Allow public read access to post images
CREATE POLICY "Post images are publicly accessible" ON storage.objects FOR
SELECT USING (bucket_id = 'post-images');
-- Allow authenticated users to upload post images
CREATE POLICY "Authenticated users can upload post images" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'post-images'
        AND auth.role() = 'authenticated'
    );
-- Allow users to update their own post images
CREATE POLICY "Users can update their own post images" ON storage.objects FOR
UPDATE USING (
        bucket_id = 'post-images'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    ) WITH CHECK (
        bucket_id = 'post-images'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    );
-- Allow users to delete their own post images
CREATE POLICY "Users can delete their own post images" ON storage.objects FOR DELETE USING (
    bucket_id = 'post-images'
    AND auth.uid()::text = (storage.foldername(name)) [1]
);