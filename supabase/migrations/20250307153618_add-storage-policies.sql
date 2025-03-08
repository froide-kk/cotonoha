-- avatarsバケットを作成
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- アップロードポリシー
CREATE POLICY "ユーザーは自分のアバターをアップロードできる" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = SPLIT_PART(name, '/', 1));

-- 更新ポリシー
CREATE POLICY "ユーザーは自分のアバターを更新できる" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'avatars' AND auth.uid()::text = SPLIT_PART(name, '/', 1));

-- 閲覧ポリシー
CREATE POLICY "誰でもアバターを閲覧できる" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'avatars');