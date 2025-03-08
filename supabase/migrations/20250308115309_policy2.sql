-- 既存の閲覧ポリシーを削除
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'diaries' AND policyname = 'Allow users to view only their own diaries'
    ) THEN
        DROP POLICY "Allow users to view only their own diaries" ON public.diaries;
    END IF;
END $$;
