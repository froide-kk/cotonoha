"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DiaryPostForm } from "@/components/diary/draft/diary-post-form";
import { createClient } from "@/utils/supabase/client";

// 日付をフォーマットする関数
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

interface DiaryDraft {
  id: string;
  title: string;
  content: string;
  diary_date: string;
  created_at: string;
  updated_at: string;
}

export default function NewDiaryPage() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get("id");

  const [draft, setDraft] = useState<DiaryDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDraft() {
      if (!draftId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const supabase = createClient();

        // ログイン中のユーザーを取得
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw new Error("ユーザー情報の取得に失敗しました");
        if (!user) throw new Error("ログインしていません");

        // 特定の下書きを取得
        const { data, error: fetchError } = await supabase
          .from("diaries")
          .select("*")
          .eq("id", draftId)
          .eq("user_id", user.id)
          .eq("status", "draft")
          .single();

        if (fetchError || !data) {
          throw new Error("下書きの取得に失敗しました");
        }

        setDraft(data as DiaryDraft);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "下書きの取得中にエラーが発生しました"
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDraft();
  }, [draftId]);

  return (
    <main className="container max-w-3xl mx-auto py-8 px-4">
      {isLoading ? (
        <h1 className="text-2xl font-semibold mb-6">
          下書きを読み込んでいます...
        </h1>
      ) : error ? (
        <h1 className="text-2xl font-semibold mb-6 text-destructive">
          {error}
        </h1>
      ) : !draft ? (
        <h1 className="text-2xl font-semibold mb-6">新規下書き</h1>
      ) : (
        <h1 className="text-2xl font-semibold mb-6">
          下書き：{formatDate(draft.diary_date)}
        </h1>
      )}
      <DiaryPostForm draftData={draft} />
    </main>
  );
}
