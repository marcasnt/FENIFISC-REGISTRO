-- Create storage bucket for athlete documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('athlete-documents', 'athlete-documents', true);

-- Create policy to allow public read access
CREATE POLICY "Public read access for athlete documents" ON storage.objects
FOR SELECT USING (bucket_id = 'athlete-documents');

-- Create policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload athlete documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'athlete-documents');

-- Create policy to allow authenticated users to update
CREATE POLICY "Authenticated users can update athlete documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'athlete-documents');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Authenticated users can delete athlete documents" ON storage.objects
FOR DELETE USING (bucket_id = 'athlete-documents');
