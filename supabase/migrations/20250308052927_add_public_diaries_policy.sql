-- 公開投稿はすべてのユーザーが閲覧できるポリシー
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'diaries' AND policyname = 'Allow users to view all public diaries'
    ) THEN
        CREATE POLICY "Allow users to view all public diaries"
        ON public.diaries
        FOR SELECT
        USING (status = 'public');
    END IF;
END $$;