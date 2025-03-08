"use client"

import { Switch } from "@/components/ui/switch"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { saveDisplaySettings } from "@/app/actions/settings.actions"

export default function DisplaySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [fontSize, setFontSize] = useState("medium")
  const [infiniteScroll, setInfiniteScroll] = useState(true)

  async function handleSaveSettings() {
    setIsLoading(true)
    const {toast} = useToast();

    try {
      await saveDisplaySettings({
        fontSize,
        infiniteScroll,
      })

      toast({
        title: "表示設定を保存しました",
        description: "表示設定が正常に更新されました。",
      })
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "表示設定の保存に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>表示設定</CardTitle>
        <CardDescription>アプリの表示設定をカスタマイズします。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">文字サイズ</h3>
          <RadioGroup defaultValue={fontSize} onValueChange={setFontSize} className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="small" id="font-small" className="peer sr-only" />
              <Label
                htmlFor="font-small"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-xs">小</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="medium" id="font-medium" className="peer sr-only" />
              <Label
                htmlFor="font-medium"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-sm">中</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="large" id="font-large" className="peer sr-only" />
              <Label
                htmlFor="font-large"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-base">大</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="infinite-scroll" className="flex flex-col space-y-1">
            <span>無限スクロール</span>
            <span className="text-sm font-normal text-muted-foreground">コンテンツを自動的に読み込みます。</span>
          </Label>
          <div className="flex-1"></div>
          <Switch id="infinite-scroll" checked={infiniteScroll} onCheckedChange={setInfiniteScroll} />
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

