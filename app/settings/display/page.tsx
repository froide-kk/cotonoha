import { Button } from "@/components/ui/button"

export default function DisplaySettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">表示設定</h1>
        </div>
        <div className="space-y-4 bg-white p-6 shadow rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">フォントサイズ</label>
            <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
            </select>
          </div>
          <div className="flex items-center">
            <input id="infinite-scroll" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="infinite-scroll" className="ml-2 block text-sm text-gray-900">
              無限スクロールを有効にする
            </label>
          </div>
          <Button type="submit">保存</Button>
        </div>
      </div>
    </div>
  );
}
