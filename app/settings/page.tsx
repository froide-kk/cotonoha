import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import SettingsNav from "@/components/settings/settings-nav"
import AccountSettings from "@/components/settings/account-settings"
import NotificationSettings from "@/components/settings/notification-settings"
import DisplaySettings from "@/components/settings/display-settings"
import ThemeSettings from "@/components/settings/theme-settings"
import LanguageSettings from "@/components/settings/language-settings"
import SettingsSkeleton from "@/components/settings/settings-skeleton"

export const metadata = {
  title: "設定",
  description: "アカウント設定を管理します。",
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">設定</h1>
          <p className="text-muted-foreground">アカウント設定を管理し、アプリケーションの動作をカスタマイズします。</p>
        </div>
        <Separator />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SettingsNav />
          </aside>
          <div className="flex-1 lg:max-w-3xl">
            <Tabs defaultValue="account" className="space-y-4">
              <TabsList>
                <TabsTrigger value="account">アカウント</TabsTrigger>
                <TabsTrigger value="notifications">通知</TabsTrigger>
                <TabsTrigger value="display">表示</TabsTrigger>
                <TabsTrigger value="theme">テーマ</TabsTrigger>
                <TabsTrigger value="language">言語</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="space-y-4">
                <Suspense fallback={<SettingsSkeleton />}>
                  <AccountSettings />
                </Suspense>
              </TabsContent>
              <TabsContent value="notifications" className="space-y-4">
                <Suspense fallback={<SettingsSkeleton />}>
                  <NotificationSettings />
                </Suspense>
              </TabsContent>
              <TabsContent value="display" className="space-y-4">
                <Suspense fallback={<SettingsSkeleton />}>
                  <DisplaySettings />
                </Suspense>
              </TabsContent>
              <TabsContent value="theme" className="space-y-4">
                <Suspense fallback={<SettingsSkeleton />}>
                  <ThemeSettings />
                </Suspense>
              </TabsContent>
              <TabsContent value="language" className="space-y-4">
                <Suspense fallback={<SettingsSkeleton />}>
                  <LanguageSettings />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

