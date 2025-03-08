import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// .env.local を読み込む
dotenv.config({ path: '.env.local' });

// 環境変数を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL または ANON KEY が見つかりません。環境変数を設定してください。');
}

// Supabase クライアントを作成
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 作成するテストユーザーのリスト
const testUsers = [
  { email: 'testuser1@example.com', password: 'password123' },
  { email: 'testuser2@example.com', password: 'password123' },
  { email: 'testuser3@example.com', password: 'password123' },
  { email: 'testuser4@example.com', password: 'password123' },
  { email: 'testuser5@example.com', password: 'password123' }
];

// ユーザーを作成する関数
async function createTestUsers() {
  for (const user of testUsers) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (error) {
      console.error(`ユーザー作成エラー (${user.email}):`, error.message);
    } else {
      console.log(`テストユーザー作成成功: ${user.email} | UUID: ${data.user.id}`);
    }
  }
}

// ユーザー作成処理を実行
createTestUsers();