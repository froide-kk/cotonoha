-- titleカラムを追加
ALTER TABLE public.diaries
ADD COLUMN title text NOT NULL DEFAULT 'タイトル未記入';