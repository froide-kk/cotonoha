"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

// 下書きのインターフェースを定義
interface DiaryDraft {
  id: string;
  title: string;
  content: string;
  diary_date: string;
  created_at: string;
  updated_at: string;
}

// モックデータ - Supabaseから取得するデータの形式を模擬
const mockDrafts: DiaryDraft[] = [
  {
    id: "1",
    title: "今日の出来事",
    content: "今日は友達と会って楽しい時間を過ごした。",
    diary_date: "2025-03-08",
    created_at: "2025-03-07T10:30:00",
    updated_at: "2025-03-07T11:45:00"
  },
  {
    id: "2",
    title: "新しいレストラン",
    content: "新しくオープンしたレストランに行ってみた。料理は...",
    diary_date: "2025-03-07",
    created_at: "2025-03-06T18:20:00",
    updated_at: "2025-03-06T19:10:00"
  },
  {
    id: "3",
    title: "",
    content: "明日の予定について考えをまとめておきたい。",
    diary_date: "2025-03-06",
    created_at: "2025-03-05T21:15:00",
    updated_at: "2025-03-05T21:15:00"
  }
];

// 日付をフォーマットする関数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).replace(/\//g, '/');
};

export function DiaryDraftList() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  // 下書きが存在するかチェック
  const hasDrafts = mockDrafts.length > 0;

  // 下書きが存在しない場合は何も表示しない
  if (!hasDrafts) {
    return null;
  }

  // 下書き編集画面へ遷移する関数
  const navigateToDraft = (draftId: string) => {
    // 実際の実装ではクエリパラメータやパスパラメータでIDを渡す
    router.push(`/diary/draft?id=${draftId}`);
  };

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        className="w-full justify-between mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          下書き ({mockDrafts.length})
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
            <ul className="space-y-2">
              {mockDrafts.map((draft) => (
                <li key={draft.id}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => navigateToDraft(draft.id)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">
                        {formatDate(draft.diary_date)} - {draft.title || "無題"}
                      </span>
                      <span className="text-sm text-gray-500 truncate max-w-full">
                        {draft.content.length > 50
                          ? `${draft.content.substring(0, 50)}...`
                          : draft.content}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        最終更新: {new Date(draft.updated_at).toLocaleString("ja-JP")}
                      </span>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}