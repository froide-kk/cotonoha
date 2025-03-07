# kotonoha

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

### マイグレーション実行
```
npx supabase migration up
```