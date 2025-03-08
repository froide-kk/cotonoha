"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { changePassword, deleteAccount } from "@/app/actions/settings.actions"

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "現在のパスワードは8文字以上である必要があります",
    }),
    newPassword: z.string().min(8, {
      message: "新しいパスワードは8文字以上である必要があります",
    }),
    confirmPassword: z.string().min(8, {
      message: "確認用パスワードは8文字以上である必要があります",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  })

export default function AccountSettings() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: z.infer<typeof passwordFormSchema>) {
    setIsLoading(true)
    const { toast } = useToast()

    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      toast({
        title: "パスワードを変更しました",
        description: "パスワードが正常に更新されました。",
      })

      form.reset()
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "パスワードの変更に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteAccount() {
    setIsLoading(true)
    const {toast} = useToast();

    try {
      await deleteAccount()
      toast({
        title: "アカウントを削除しました",
        description: "アカウントが正常に削除されました。",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "アカウントの削除に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>パスワード変更</CardTitle>
          <CardDescription>アカウントのパスワードを変更します。</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>現在のパスワード</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新しいパスワード</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード（確認）</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "更新中..." : "パスワードを更新"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>アカウント削除</CardTitle>
          <CardDescription>アカウントを完全に削除します。この操作は元に戻せません。</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">アカウントを削除</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>本当にアカウントを削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  この操作は元に戻せません。アカウントとすべてのデータが完全に削除されます。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isLoading ? "削除中..." : "削除する"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}

