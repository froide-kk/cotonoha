import { Suspense } from "react"
import AccountSettings from "@/components/settings/account-settings"
import SettingsSkeleton from "@/components/settings/settings-skeleton"

export default function AccountSettingsPage() {
  return (
    <div className="container mx-auto py-10">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">設定</h1>
        <p className="text-muted-foreground">アカウント設定を管理し、アプリケーションの動作をカスタマイズします。</p>
      </div>
    <Suspense fallback={<SettingsSkeleton />}>
      <AccountSettings />
    </Suspense>
    </div>
    </div>
  )}
