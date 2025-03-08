import { Button } from "@/components/ui/button"

export default function LanguageSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">言語設定</h1>
          <p className="text-gray-600">アプリの表示言語を選択してください。</p>
        </div>
        <div className="flex flex-col gap-4">
          <label className="font-medium text-lg" htmlFor="language">
            言語を選択
          </label>
          <select
            id="language"
            className="p-2 border rounded-md w-full max-w-md"
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
          <Button type="submit">保存</Button>
        </div>
      </div>
    </div>
  );
}