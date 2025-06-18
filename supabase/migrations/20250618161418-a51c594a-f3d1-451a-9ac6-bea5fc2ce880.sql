
-- Create a storage bucket for logos and assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true);

-- Create a policy to allow public read access to logos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

-- Create a policy to allow authenticated users to upload logos
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
