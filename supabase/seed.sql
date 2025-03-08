-- ==========================
-- 初期データ投入スクリプト
-- ==========================

-- ユーザーIDの定義
DO $$
DECLARE
    user1 uuid := '7ba9feb2-17ae-435c-85c6-7a53f8d691d1';
    user2 uuid := 'd3f90726-fcdf-421a-b019-e5e1c3972596';
    user3 uuid := '08badeab-0c60-4b13-9555-026837be70df';
    user4 uuid := 'de7f9a7c-ddd9-4e6d-bd66-b0ee8cdd0700';
    user5 uuid := '696b2255-5e5c-465b-a020-fb9474628275';
BEGIN

-- 【1】profiles (プロファイルテーブル) のデータを更新または挿入
INSERT INTO public.profiles (id, user_name, icon, bio, is_onboarded, created_at, updated_at)
VALUES
    (user1, '太郎', NULL, 'こんにちは、太郎です！', TRUE, now(), now()),
    (user2, '花子', NULL, '花子です。よろしく！', TRUE, now(), now()),
    (user3, '次郎', NULL, '次郎です！元気です。', TRUE, now(), now()),
    (user4, '三郎', NULL, '三郎です、趣味は読書。', TRUE, now(), now()),
    (user5, '四郎', NULL, '四郎です、旅行が好きです！', TRUE, now(), now())
ON CONFLICT (id)
DO UPDATE SET
    user_name = EXCLUDED.user_name,
    icon = EXCLUDED.icon,
    bio = EXCLUDED.bio,
    is_onboarded = EXCLUDED.is_onboarded,
    updated_at = now();

-- 【2】diaries (日記テーブル) の初期データ
INSERT INTO public.diaries (id, user_id, content, diary_date, posted_at, status, created_at, updated_at)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', user1, '今日はとても楽しかった！', '2025-03-07', now(), 'public', now(), now()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', user2, '新しい本を読み始めました。', '2025-03-06', now(), 'public', now(), now()),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', user3, '美味しいカフェを見つけた！', '2025-03-05', now(), 'public', now(), now()),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', user4, '今日はのんびり過ごしました。', '2025-03-04', now(), 'private', now(), now()),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', user5, '週末に旅行の計画を...', '2025-03-03', now(), 'draft', now(), now());

-- 【3】likes (いいねテーブル) の初期データ
INSERT INTO public.likes (id, user_id, diary_id, heart, thumbs_up, muscle, party, clap, created_at)
VALUES
    (gen_random_uuid(), user1, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', TRUE, FALSE, FALSE, FALSE, FALSE, now()), -- ❤️
    (gen_random_uuid(), user2, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', FALSE, TRUE, FALSE, FALSE, FALSE, now()), -- 👍
    (gen_random_uuid(), user3, 'dddddddd-dddd-dddd-dddd-dddddddddddd', FALSE, FALSE, TRUE, FALSE, FALSE, now()), -- 💪
    (gen_random_uuid(), user4, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', FALSE, FALSE, FALSE, TRUE, FALSE, now()), -- 🎉
    (gen_random_uuid(), user5, 'cccccccc-cccc-cccc-cccc-cccccccccccc', FALSE, FALSE, FALSE, FALSE, TRUE, now()); -- 👏

-- 【4】follows (フォローテーブル) の初期データ
INSERT INTO public.follows (follower_id, following_id, created_at)
VALUES
    (user1, user2, now()),
    (user2, user3, now()),
    (user3, user4, now()),
    (user4, user5, now()),
    (user5, user1, now());

END $$;
