// app/onboarding/page.tsx
import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const supabase = await createClient()

  // ユーザー認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  // プロフィールの存在チェック
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // オンボーディングが完了している場合のみリダイレクト
  if (profile && profile.is_onboarded === true) {  // onboarding_completedからis_onboardedに修正
    return redirect('/timeline')  // /notesから/timelineに修正
  }

  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='max-w-lg mx-auto'>
        <h1 className='text-3xl font-bold mb-6 text-center'>
          プロフィール設定
        </h1>
        <p className='text-lg text-center mb-8'>
          ようこそ！少しだけあなたについて教えてください
        </p>
        <div>
            <h1>aaa</h1>
        </div>
      </div>
    </main>
  )
}