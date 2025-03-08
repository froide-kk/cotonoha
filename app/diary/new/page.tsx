import { DiaryPostForm } from "@/components/diary/new/diary-post-form";
import { DiaryDraftList } from "@/components/diary/draft/draft-list";

export default function NewDiaryPage() {
  // 現在の日付を取得して日本のフォーマットに変換
  const today = new Date();
  const formattedDate = today
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "/");

  return (
    <main className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">新規：{formattedDate}</h1>
      {/* 下書きのリストコンポーネント */}
      <DiaryDraftList />
      {/* 日記投稿フォーム */}
      <DiaryPostForm />
    </main>
  );
}
