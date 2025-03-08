import { Suspense } from "react"
import AccountSettings from "@/components/settings/account-settings"
import SettingsSkeleton from "@/components/settings/settings-skeleton"

export default function AccountSettingsPage() {
  return (
    <div className="container mx-auto py-10">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">アカウント設定</h1>
      </div>
    <Suspense fallback={<SettingsSkeleton />}>
      <AccountSettings />
    </Suspense>
    </div>
    </div>
  )}
