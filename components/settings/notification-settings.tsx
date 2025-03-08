"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { saveNotificationSettings } from "@/app/actions/settings.actions"

export default function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [reminderEnabled, setReminderEnabled] = useState(true)

  async function handleSaveSettings() {
    setIsLoading(true)
    const {toast} = useToast();

    try {
      await saveNotificationSettings({
        reminderEnabled,
      })

      toast({
        title: "通知設定を保存しました",
        description: "通知設定が正常に更新されました。",
      })
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "通知設定の保存に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>通知設定</CardTitle>
        <CardDescription>アプリからの通知設定を管理します。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="reminder-notification" className="flex flex-col space-y-1">
            <span>リマインド通知</span>
            <span className="text-sm font-normal text-muted-foreground">
              最後の投稿から24時間後にリマインド通知を送信します。
            </span>
          </Label>
          <Switch id="reminder-notification" checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "保存中..." : "設定を保存"}
        </Button>
      </CardFooter>
    </Card>
  )
}

