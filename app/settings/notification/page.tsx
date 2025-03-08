import { Button } from "@/components/ui/button"

export default function NotificationSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">通知設定</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">通知の種類</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span>メール通知</span>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>プッシュ通知</span>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>SMS通知</span>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
        </div>

        <Button type="submit">保存</Button>
      </div>
    </div>
  );
}