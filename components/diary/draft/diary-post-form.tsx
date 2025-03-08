"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Clock,
  Save,
  Eye,
  Send,
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DiaryPreview } from "../diary-preview";
import { TextEditor } from "../text-editor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export function DiaryPostForm() {
  const [activeTab, setActiveTab] = useState("write");
  const [diaryContent, setDiaryContent] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [showLikes, setShowLikes] = useState(true);
  const [scheduledTime, setScheduledTime] = useState("");
  const [contentError, setContentError] = useState<string | null>(null);

  // 成功・エラーメッセージ状態
  const [savingMessage, setSavingMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 処理中の状態
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingDraft, setIsUpdatingDraft] = useState(false);

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
      // モック: ここで実際はSupabaseにデータ保存する処理を実行
      console.log("日記を投稿:", {
        title: diaryTitle,
        content: diaryContent,
        privacy: privacy,
        showLikes: showLikes,
        scheduledTime: scheduledTime || null,
      });

      // 処理完了を模擬するため少し待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 実際の実装ではここでSupabaseのコードを記述
      /*
      const { data, error } = await supabase
        .from('diaries')
        .insert({
          title: diaryTitle,
          content: diaryContent,
          privacy: privacy,
          show_likes: showLikes,
          scheduled_time: scheduledTime || null,
          user_id: userId,  // 認証済みユーザーのID
          is_draft: false
        })
        .select();

      if (error) throw error;
      */

      // 成功メッセージを表示
      setSavingMessage("投稿完了");
      setSuccessMessage("日記を投稿しました");
      // フォームをリセット
      resetForm();
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
    // 内容が空でも更新できるようにエラーチェックは最小限に
    setIsUpdatingDraft(true);

    try {
      // モック: ここで実際はSupabaseにデータ更新する処理を実行
      console.log("下書きを更新:", {
        title: diaryTitle,
        content: diaryContent,
        privacy: privacy,
        showLikes: showLikes,
        scheduledTime: scheduledTime || null,
        is_draft: true,
      });

      // 処理完了を模擬するため少し待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 実際の実装ではここでSupabaseのコードを記述
      /*
      const { data, error } = await supabase
        .from('diaries')
        .insert({
          title: diaryTitle,
          content: diaryContent,
          privacy: privacy,
          show_likes: showLikes,
          scheduled_time: scheduledTime || null,
          user_id: userId,  // 認証済みユーザーのID
          is_draft: true
        })
        .select();

      if (error) throw error;
      */

      // 成功メッセージを表示
      setSavingMessage("更新完了");
      setSuccessMessage("下書きを更新しました");
    } catch (error) {
      console.error("下書き更新エラー:", error);
      setErrorMessage("下書きの更新中にエラーが発生しました。");
    } finally {
      setIsUpdatingDraft(false);
    }
  };

  // フォームをリセットする関数
  const resetForm = () => {
    setDiaryTitle("");
    setDiaryContent("");
    setPrivacy("public");
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
    privacy: privacy || "公開",
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
              <Terminal className="h-4 w-4 mr-1 pt-3" />
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
                <Label htmlFor="privacy">公開設定</Label>
                <Select value={privacy} onValueChange={setPrivacy}>
                  <SelectTrigger id="privacy">
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
                  <Button variant="outline" size="icon" type="button">
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
            disabled={isUpdatingDraft}
          >
            <Save className="h-4 w-4 mr-2" />
            {isUpdatingDraft ? "更新中..." : "下書きを更新"}
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
              disabled={isSubmitting}
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
