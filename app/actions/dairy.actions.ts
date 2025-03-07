'use server'

// モックデータの型定義
type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

type DiaryEntry = {
  id: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
};

// モックユーザーデータ
const mockUsers: User[] = [
  {
    id: "user1",
    name: "田中太郎",
    avatarUrl: "/api/placeholder/40/40"
  },
  {
    id: "user2",
    name: "佐藤花子",
    avatarUrl: "/api/placeholder/40/40"
  },
  {
    id: "user3",
    name: "鈴木一郎",
    avatarUrl: "/api/placeholder/40/40"
  },
  {
    id: "user4",
    name: "山田優子",
    avatarUrl: "/api/placeholder/40/40"
  },
  {
    id: "user5",
    name: "伊藤健太",
    avatarUrl: "/api/placeholder/40/40"
  }
];

// モック日記データ
const mockDiaryEntries: DiaryEntry[] = [
  {
    id: "diary1",
    userId: "user1",
    user: mockUsers[0],
    content: "今日は素晴らしい一日でした。朝早く起きて、公園でランニングをしました。その後、友達と朝食を食べに行きました。午後は新しい本を読み始めました。明日もこんな充実した一日になりますように。",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2時間前
  },
  {
    id: "diary2",
    userId: "user2",
    user: mockUsers[1],
    content: "今日は新しいカフェでランチをしました。オーガニックな食材を使った料理で、とても美味しかったです。また行きたいです。",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4時間前
  },
  {
    id: "diary3",
    userId: "user3",
    user: mockUsers[2],
    content: "昨日から始めた新しいプロジェクトが順調に進んでいます。チームメンバーとの連携もスムーズで、予定よりも早く進められそうです。今週末までには第一フェーズを完了させたいと思います。モチベーションが高まっています！",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8時間前
  },
  {
    id: "diary4",
    userId: "user4",
    user: mockUsers[3],
    content: "今日は久しぶりに映画館に行きました。最新の映画を観て、とてもリフレッシュできました。ポップコーンも美味しかったです。",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12時間前
  },
  {
    id: "diary5",
    userId: "user5",
    user: mockUsers[4],
    content: "今日は一日中雨でしたが、家で過ごす時間を有効に使いました。長い間やりたかった片付けをして、部屋がすっきりしました。明日は晴れるといいな。",
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString() // 16時間前
  },
  {
    id: "diary6",
    userId: "user1",
    user: mockUsers[0],
    content: "今日からジムに通い始めました。久しぶりの運動で少し筋肉痛ですが、健康的な生活を送るためにも続けていきたいと思います。トレーナーさんも親切で、良いスタートが切れました。目標は3ヶ月で5キロ減量です！",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() // 20時間前
  },
  {
    id: "diary7",
    userId: "user2",
    user: mockUsers[1],
    content: "今日は友達の誕生日パーティーに参加しました。みんなでプレゼントを用意して、サプライズでケーキを持って行きました。とても喜んでくれて嬉しかったです。",
    createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() // 22時間前
  },
  {
    id: "diary8",
    userId: "user3",
    user: mockUsers[2],
    content: "新しいプログラミング言語の勉強を始めました。最初は難しいですが、少しずつ理解できるようになってきています。週末を利用して集中的に学習する予定です。",
    createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() // 23時間前
  },
  {
    id: "diary9",
    userId: "user4",
    user: mockUsers[3],
    content: "今日は早起きして朝日を見ました。清々しい気持ちで一日をスタートできました。朝の時間を有効活用するために、これからも早起きを心がけたいと思います。",
    createdAt: new Date(Date.now() - 23.5 * 60 * 60 * 1000).toISOString() // 23.5時間前
  },
  {
    id: "diary10",
    userId: "user5",
    user: mockUsers[4],
    content: "昨日買った本を読み始めました。予想以上に面白くて、あっという間に半分まで読んでしまいました。明日も続きを読むのが楽しみです。",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 24時間前
  }
];

// タイムラインの投稿を取得する関数（ページネーション対応）
export async function getTimelinePosts(cursor?: string, limit: number = 5) {
  // サーバー遅延をシミュレート
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let startIndex = 0;
  if (cursor) {
    const cursorIndex = mockDiaryEntries.findIndex(entry => entry.id === cursor);
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1;
    }
  }
  
  const entries = mockDiaryEntries.slice(startIndex, startIndex + limit);
  const nextCursor = entries.length === limit && startIndex + limit < mockDiaryEntries.length
    ? entries[entries.length - 1].id
    : null;
  
  return {
    entries,
    nextCursor
  };
}

// 型をエクスポート
export type { User, DiaryEntry };