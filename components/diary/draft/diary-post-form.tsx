"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Clock, Save, Eye, Send, ChevronLeft, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DiaryPreview } from "../diary-preview";
import { TextEditor } from "../text-editor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// 下書きのデータ型を定義
interface DiaryDraft {
  id: string;
  title: string;
  content: string;
  diary_date: string;
  status?: string;
  show_likes?: boolean;
  created_at: string;
  updated_at: string;
}

// プロップスの型定義
interface DiaryPostFormProps {
  draftData: DiaryDraft | null;
}

export function DiaryPostForm({ draftData }: DiaryPostFormProps) {
  const router = useRouter(); // Initialize the router
  const [activeTab, setActiveTab] = useState("write");
  const [diaryContent, setDiaryContent] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [status, setStatus] = useState("public");
  const [showLikes, setShowLikes] = useState(true);
  const [scheduledTime, setScheduledTime] = useState("");
  const [contentError, setContentError] = useState<string | null>(null);

  // 成功・エラーメッセージ状態
  const [savingMessage, setSavingMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 処理中の状態
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // 下書きデータがある場合、初期値として設定
  useEffect(() => {
    if (draftData) {
      setDiaryTitle(draftData.title || "");
      setDiaryContent(draftData.content || "");
      // ステータスがあれば設定（下書きの場合はdraftではなくpublicをデフォルト値に）
      setStatus(draftData.status === "draft" ? "public" : (draftData.status || "public"));
      // いいね表示設定があれば設定（ない場合はデフォルト値）
      setShowLikes(
        draftData.show_likes !== undefined ? draftData.show_likes : true
      );
    }
  }, [draftData]);

  // 日記を投稿する処理
  const handleSubmitDiary = async () => {
    // 内容の必須チェック
    if (!diaryContent || diaryContent.trim() === "") {
      setContentError("本文は必須項目です");
      setActiveTab("write");
      return;
    }

    setContentError(null);
    setIsSubmitting(true);

    try {
      // 現在の日時を取得
      const now = new Date().toISOString();
      // 投稿日時（予約投稿の場合はその時間、そうでなければ現在時刻）
      const posted_at = scheduledTime
        ? new Date(scheduledTime).toISOString()
        : now;
      // 日記の日付（投稿日）
      const diaryDate = posted_at.split("T")[0]; // YYYY-MM-DD形式で取得

      // クライアントサイド用のSupabaseクライアントを作成
      const supabase = createClient();

      // 認証済みユーザー情報を取得
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("ユーザーが認証されていません");
      }

      // ステータスを確認 - 必ずpublicかprivateになるようにする
      const publishStatus = status === "public" || status === "private" 
        ? status 
        : "public"; // デフォルトはpublic

      console.log("日記を投稿:", {
        user_id: user.id, // 認証済みユーザーのID
        title: diaryTitle,
        content: diaryContent,
        diary_date: diaryDate,
        status: publishStatus, // 公開か非公開のみ
        show_likes: showLikes,
        posted_at: posted_at,
        updated_at: now,
      });

      // 下書きの更新か新規投稿かを判断
      if (draftData) {
        // 既存の下書きを投稿する場合（下書きからの投稿）
        const { error } = await supabase
          .from("diaries")
          .update({
            title: diaryTitle,
            content: diaryContent,
            diary_date: diaryDate,
            status: publishStatus, // 重要: draftではなくpublic/privateに設定
            show_likes: showLikes,
            posted_at: posted_at,
            updated_at: now,
          })
          .eq("id", draftData.id)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // 新規投稿の場合
        const { error } = await supabase.from("diaries").insert({
          user_id: user.id, // 認証済みユーザーのID
          title: diaryTitle,
          content: diaryContent,
          diary_date: diaryDate,
          status: publishStatus, // 重要: public/privateのみ
          show_likes: showLikes,
          posted_at: posted_at,
          updated_at: now,
        });

        if (error) throw error;
      }

      // 成功メッセージを表示 (一瞬だけ表示されることになる)
      setSavingMessage("投稿完了");
      setSuccessMessage("日記を投稿しました");
      
      // フォームをリセット
      resetForm();
      
      // 投稿成功後にdiary/newへリダイレクト
      router.push("/diary/new");
      
    } catch (error) {
      console.error("投稿エラー:", error);
      setErrorMessage(
        "投稿中にエラーが発生しました。後でもう一度お試しください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 下書きを更新する処理
  const handleSaveDraft = async () => {
    // 必須チェックエラーが表示されている場合、非表示にする用
    setContentError(null);
    // 内容が空でも保存できるようにエラーチェックは最小限に
    setIsSavingDraft(true);

    try {
      // 現在の日時を取得
      const now = new Date().toISOString();
      // 日記の日付（現在日）
      const diaryDate = now.split("T")[0]; // YYYY-MM-DD形式で取得

      // クライアントサイド用のSupabaseクライアントを作成
      const supabase = createClient();

      // 認証済みユーザー情報を取得
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("ユーザーが認証されていません");
      }

      // 既存の下書きを更新するか、新規に作成するか
      if (draftData) {
        // 既存の下書きを更新
        const { error } = await supabase
          .from("diaries")
          .update({
            content: diaryContent,
            title: diaryTitle,
            updated_at: now,
            show_likes: showLikes,
            status: "draft", // 確実に下書き状態を維持
          })
          .eq("id", draftData.id)
          .eq("user_id", user.id);

        if (error) throw error;

        setSavingMessage("保存完了");
        setSuccessMessage("下書きを更新しました");
      } else {
        // 新規に下書きを作成
        const { error } = await supabase.from("diaries").insert({
          user_id: user.id,
          content: diaryContent,
          diary_date: diaryDate,
          show_likes: showLikes,
          posted_at: null, // 下書きは投稿日時なし
          updated_at: now,
          status: "draft", // 下書きは非公開
          title: diaryTitle,
        });

        if (error) throw error;

        setSavingMessage("保存完了");
        setSuccessMessage("下書きを保存しました");
      }
    } catch (error) {
      console.error("下書き保存エラー:", error);
      setErrorMessage("下書きの保存中にエラーが発生しました。");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // フォームをリセットする関数
  const resetForm = () => {
    setDiaryTitle("");
    setDiaryContent("");
    setStatus("public");
    setShowLikes(true);
    setScheduledTime("");
  };

  // 成功メッセージを一定時間後に消す
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // エラーメッセージを一定時間後に消す
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // プレビュー用のデータ
  const previewData = {
    title: diaryTitle || "",
    content: diaryContent || "ここに内容が表示されます",
    status: status || "公開",
    createdAt: scheduledTime ? new Date(scheduledTime) : new Date(),
    author: {
      name: "ユーザー名",
      avatar: "",
    },
  };

  return (
    <Card className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardContent>
          {/* エラーメッセージ */}
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-1" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* 成功メッセージ */}
          {successMessage && (
            <Alert>
              <Terminal className="h-4 w-4 mr-1" />
              <AlertTitle>{savingMessage}</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="write" className="space-y-4 mt-0 pt-3">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル (任意)</Label>
              <Input
                id="title"
                placeholder="タイトルを入力してください"
                value={diaryTitle}
                onChange={(e) => setDiaryTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="flex items-center">
                内容 <span className="text-red-500 ml-1">*</span>
              </Label>
              <TextEditor
                value={diaryContent}
                onChange={(value) => {
                  setDiaryContent(value);
                  if (contentError && value && value.trim() !== "") {
                    setContentError(null);
                  }
                }}
              />
              {contentError && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {contentError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">公開設定</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="公開設定を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">公開</SelectItem>
                    <SelectItem value="private">非公開</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduled-time">投稿時間設定</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="scheduled-time"
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => setScheduledTime("")}
                    title="スケジュールをクリア"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-likes"
                checked={showLikes}
                onCheckedChange={setShowLikes}
              />
              <Label htmlFor="show-likes">いいね数を表示する</Label>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <DiaryPreview diary={previewData} showLikes={showLikes} />
          </TabsContent>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSavingDraft
              ? "更新中..."
              : draftData
                ? "下書きを更新"
                : "下書きを保存"}
          </Button>
          <div className="flex space-x-2">
            {activeTab === "write" ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setActiveTab("preview")}
              >
                <Eye className="h-4 w-4 mr-2" />
                プレビュー
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setActiveTab("write")}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                編集に戻る
              </Button>
            )}
            <Button
              type="button"
              disabled={isSubmitting || isSavingDraft}
              onClick={handleSubmitDiary}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "投稿中..." : "投稿する"}
            </Button>
          </div>
        </CardFooter>
      </Tabs>
    </Card>
  );
}