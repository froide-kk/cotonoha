"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Moon, Sun, Laptop } from "lucide-react"
import { saveThemeSettings } from "@/app/actions/settings.actions"

export default function ThemeSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState("system")

  // テーマの変更を監視して適用する
  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  async function handleSaveSettings() {
    setIsLoading(true)
    const { toast } = useToast()

    try {
      await saveThemeSettings({
        theme,
      })

      toast({
        title: "テーマ設定を保存しました",
        description: "テーマ設定が正常に更新されました。",
      })
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "テーマ設定の保存に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>テーマ設定</CardTitle>
        <CardDescription>アプリの外観をカスタマイズします。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup defaultValue={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
          <div>
            <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
            <Label
              htmlFor="theme-light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Sun className="mb-3 h-6 w-6" />
              <span>ライト</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
            <Label
              htmlFor="theme-dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Moon className="mb-3 h-6 w-6" />
              <span>ダーク</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
            <Label
              htmlFor="theme-system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Laptop className="mb-3 h-6 w-6" />
              <span>システム</span>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "保存中..." : "設定を保存"}
        </Button>
      </CardFooter>
    </Card>
  )
}

