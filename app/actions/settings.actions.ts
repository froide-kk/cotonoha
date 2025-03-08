"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

// ユーザーアイコン変更
export async function changeUserIcon({ currentIcon, newIcon }: { currentIcon: string; newIcon: string }) {
  const supabase = await createClient()
  const user = await supabase.auth.getUser()
  if (!user.data.user) return { success: false, error: "未認証のユーザーです" }

  const { error } = await supabase
    .from("profiles")
    .update({ icon: newIcon })
    .eq("id", user.data.user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/settings")
  return { success: true }
}

// ユーザー名変更
export async function changeUserName({ currentName, newName }: { currentName: string; newName: string }) {
  const supabase = await createClient()
  const user = await supabase.auth.getUser()
  if (!user.data.user) return { success: false, error: "未認証のユーザーです" }

  const { error } = await supabase
    .from("profiles")
    .update({ name: newName })
    .eq("id", user.data.user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/settings")
  return { success: true }
}

// ユーザーメール変更
export async function changeUserEmail({ currentEmail, newEmail }: { currentEmail: string; newEmail: string }) {
  const supabase = await createClient()
  const user = await supabase.auth.getUser()
  if (!user.data.user) return { success: false, error: "未認証のユーザーです" }

  if (user.data.user.email !== currentEmail) {
    return { success: false, error: "現在のメールアドレスが一致しません" }
  }

  // メールアドレス変更
  const { error } = await supabase.auth.updateUser({ email: newEmail })
  if (error) return { success: false, error: error.message }

  revalidatePath("/settings")
  return { success: true }
}

// パスワード変更
export async function changePassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath("/settings")
  return { success: true }
}

// アカウント削除
export async function deleteAccount() {
  const supabase = await createClient()
  const user = await supabase.auth.getUser()
  if (!user.data.user) return { success: false, error: "未認証のユーザーです" }

  // ユーザーの関連データ削除
  await supabase.from("profiles").delete().eq("id", user.data.user.id)

  // アカウント削除
  const { error } = await supabase.auth.admin.deleteUser(user.data.user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/")
  return { success: true }
}

// 通知設定の保存
export async function saveNotificationSettings({
  reminderEnabled,
}: {
  reminderEnabled: boolean
}) {
  // ここは実装保留

  // 成功したら、関連するパスをrevalidate
  revalidatePath("/settings")

  return { success: true }
}

// 表示設定の保存
export async function saveDisplaySettings({
  fontSize,
  infiniteScroll,
}: {
  fontSize: string
  infiniteScroll: boolean
}) {
  // ここは実装保留

  // 成功したら、関連するパスをrevalidate
  revalidatePath("/settings")

  return { success: true }
}

// テーマ設定の保存
export async function saveThemeSettings({
  theme,
}: {
  theme: string
}) {
  // ここは実装保留
  revalidatePath("/settings")

  return { success: true }
}

// 言語設定の保存
export async function saveLanguageSettings({
  language,
}: {
  language: string
}) {
  // ここは実装保留
  revalidatePath("/settings")

  return { success: true }
}

