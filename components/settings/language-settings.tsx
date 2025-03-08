"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { saveLanguageSettings } from "@/app/actions/settings.actions"

const languages = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "ko", label: "한국어" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "es", label: "Español" },
]

export default function LanguageSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState("ja")

  async function handleSaveSettings() {
    setIsLoading(true)
    const {toast} = useToast();

    try {
      await saveLanguageSettings({
        language,
      })

      toast({
        title: "言語設定を保存しました",
        description: "言語設定が正常に更新されました。",
      })
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "言語設定の保存に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>言語設定</CardTitle>
        <CardDescription>アプリの表示言語を選択します。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="language-select" className="text-sm font-medium">
            言語
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language-select" className="w-full">
              <SelectValue placeholder="言語を選択" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

