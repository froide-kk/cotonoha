-- ==========================
-- diariesテーブルのRLSポリシーを更新（ユーザーが自分の投稿を閲覧＆編集できるようにする）
-- ==========================

-- 既存の閲覧ポリシーを削除
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'diaries' AND policyname = 'Allow users to view only their own diaries'
    ) THEN
        DROP POLICY "Allow users to view only their own diaries" ON public.diaries;
    END IF;
END $$;

-- 新しい閲覧＆編集ポリシーを作成
CREATE POLICY "Allow users to view and update their own diaries"
ON public.diaries
FOR SELECT, UPDATE
USING (user_id = auth.uid());
