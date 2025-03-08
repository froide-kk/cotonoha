# cotonoha

## ローカル環境

### 環境変数設定
```
cp .env.example .env.local
```

### パッケージインストール
```
npm i
```

#### 開発サーバー起動
```
npm run dev
```

### supabase docker起動
```
npx supabase start
```

### supabase docker停止
```
npx supabase stop
```

## マイグレーション

### マイグレーションファイル新規
```
npx supabase migration new [マイグレーションファイル名]
```

### マイグレーション実行(フォルダ内の未適用のマイグレーションファイルのみ)
```
npx supabase migration up
```

### マイグレーション実行(すでに適用済みのマイグレーションも含めて、すべてのマイグレーションを適用)
```
npx supabase migration up --include-all
```

### テストユーザー生成方法

1. auth.userの生成

```
node createTestUser.js
```

※ 生成されるテストユーザーのUUIDをcotonoha/supabase/seed.sqlに記載

2. auth.userに紐づいたテストデータの作成

```
psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f supabase/seed.sql
```

※ publicのデータ削除

```
psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "
DO \$\$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE;';
    END LOOP;
END \$\$;"

```

※設定値は `npx supabase status` のDB URLを確認
## supabase 便利コマンド

### 現在利用しているsupabaseサービス一覧表示
```
npx supabase status
```
