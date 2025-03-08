"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// 下書きのインターフェースを定義
interface DiaryDraft {
  id: string;
  title: string;
  content: string;
  diary_date: string;
  created_at: string;
  updated_at: string;
}

// 日付をフォーマットする関数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "/");
};

export function DiaryDraftList() {
  const [drafts, setDrafts] = useState<DiaryDraft[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchDrafts() {
      try {
        setIsLoading(true);
        const supabase = createClient();

        // ログイン中のユーザーを取得
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw new Error("ユーザー情報の取得に失敗しました");
        }

        if (!user) {
          throw new Error("ログインしていません");
        }

        // ユーザーの下書き日記を取得 (status = 'draft' のもののみ)
        const { data, error: fetchError } = await supabase
          .from("diaries")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "draft")
          .order("updated_at", { ascending: false });

        if (fetchError) {
          throw new Error("下書きの取得に失敗しました");
        }

        setDrafts(data || []);
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

    fetchDrafts();
  }, []);

  // 下書きが存在するかチェック
  const hasDrafts = drafts.length > 0;

  // 下書きが存在せず、ロード中でもない場合は何も表示しない
  if (!hasDrafts && !isLoading) {
    return null;
  }

  // 下書き編集画面へ遷移する関数
  const navigateToDraft = (draftId: string) => {
    router.push(`/diary/draft?id=${draftId}`);
  };

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        className="w-full justify-between mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={isLoading}
      >
        <span className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          下書き {!isLoading && `(${drafts.length})`}
          {isLoading && (
            <span className="ml-2 text-sm text-muted-foreground">
              読み込み中...
            </span>
          )}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isExpanded && (
        <Card>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="py-4 text-center text-muted-foreground">
                下書きを読み込んでいます...
              </div>
            ) : error ? (
              <div className="py-4 text-center text-destructive">{error}</div>
            ) : drafts.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                下書きはありません
              </div>
            ) : (
              <ul className="space-y-2">
                {drafts.map((draft) => (
                  <li key={draft.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => navigateToDraft(draft.id)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {formatDate(draft.diary_date)} -{" "}
                          {draft.title || "無題"}
                        </span>
                        <span className="text-sm text-gray-500 truncate max-w-full">
                          {draft.content.length > 50
                            ? `${draft.content.substring(0, 50)}...`
                            : draft.content}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          最終更新:{" "}
                          {new Date(draft.updated_at).toLocaleString("ja-JP")}
                        </span>
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
