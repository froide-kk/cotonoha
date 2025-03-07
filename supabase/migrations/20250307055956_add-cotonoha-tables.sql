-- ==========================
-- 言の葉 データベース作成スクリプト
-- ==========================

-- 【1】profiles (プロファイルテーブル)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users (id),
    user_name text NOT NULL,
    icon text,
    bio text CHECK (char_length(bio) <= 100),
    is_onboarded boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 【2】diaries (日記テーブル)
CREATE TABLE IF NOT EXISTS public.diaries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles (id),
    content text,
    diary_date date,
    posted_at timestamptz,
    is_public boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 【3】likes (いいねテーブル)
CREATE TABLE IF NOT EXISTS public.likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles (id),
    diary_id uuid REFERENCES public.diaries (id),
    delete_flg boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    UNIQUE (user_id, diary_id)  -- 1ユーザー1投稿に1回のいいねのみ
);

-- 【4】follows (フォローテーブル)
CREATE TABLE IF NOT EXISTS public.follows (
    follower_id uuid REFERENCES public.profiles (id),
    following_id uuid REFERENCES public.profiles (id),
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (follower_id, following_id)
);

-- ==========================
-- 行レベルセキュリティ (RLS) の設定
-- ==========================

-- diariesテーブルのRLS有効化（ユーザーが自分の日記だけを閲覧できるようにする）
ALTER TABLE public.diaries ENABLE ROW LEVEL SECURITY;

-- ユーザーが自分の投稿のみ閲覧できるポリシー
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'diaries' AND policyname = 'Allow users to view only their own diaries'
    ) THEN
        CREATE POLICY "Allow users to view only their own diaries"
        ON public.diaries
        FOR SELECT
        USING (user_id = auth.uid());
    END IF;
END $$;

-- ==========================
-- ユーザー作成時のトリガー
-- ==========================

-- `handle_new_user` 関数の削除 & 再作成
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        user_name,
        is_onboarded
    )
    VALUES (
        NEW.id,
        '名も無き子',  -- デフォルトのニックネーム
        FALSE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- `on_auth_user_created` トリガーの削除 & 再作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();