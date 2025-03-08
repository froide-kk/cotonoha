import { Button } from "@/components/ui/button"

export default function AccountSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">テーマ設定</h1>
          <p className="text-gray-600">アプリのテーマを選択してください。</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100">
            <div className="w-full h-20 bg-white border"></div>
            <p className="mt-2">ライトテーマ</p>
          </div>
          <div className="border rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100">
            <div className="w-full h-20 bg-gray-900 border"></div>
            <p className="mt-2 text-gray-900">ダークテーマ</p>
          </div>
          <div className="border rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100">
            <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-purple-500 border"></div>
            <p className="mt-2">カスタムテーマ</p>
          </div>
        </div>

        <Button type="submit">保存</Button>
      </div>
    </div>
  );
}