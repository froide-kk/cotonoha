-- ==========================
-- いいねテーブル変更マイグレーション
-- ==========================

-- 既存のlikesテーブルを削除（データが消えるため注意）
DROP TABLE IF EXISTS public.likes CASCADE;

-- 新しいlikesテーブルの作成
CREATE TABLE public.likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles (id),
    diary_id uuid REFERENCES public.diaries (id),
    heart boolean DEFAULT false,   -- ❤️
    thumbs_up boolean DEFAULT false, -- 👍
    muscle boolean DEFAULT false,   -- 💪
    party boolean DEFAULT false,    -- 🎉
    clap boolean DEFAULT false,     -- 👏
    created_at timestamptz DEFAULT now(),
    UNIQUE (user_id, diary_id)  -- 1ユーザー1投稿に1つのリアクションのみ
);
