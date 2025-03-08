-- is_publicカラムをstatusカラムに変更
ALTER TABLE public.diaries
ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';

-- 既存データを移行
UPDATE public.diaries SET status = 'public' WHERE is_public = true;
UPDATE public.diaries SET status = 'private' WHERE is_public = false;

-- is_publicカラムを削除
ALTER TABLE public.diaries DROP COLUMN is_public;
