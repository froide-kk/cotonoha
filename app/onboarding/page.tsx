// app/onboarding/page.tsx
import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import OnboardingForm from '@/components/onboarding/onboarding-form';
import { updateProfileAction } from '../actions/profile.actions';

export default async function OnboardingPage() {
    const supabase = await createClient();
  
    // ユーザー認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return redirect('/sign-in');
    }
  
    // プロフィールの存在チェック
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
  
    // オンボーディングが完了している場合のみリダイレクト
    if (profile && profile.is_onboarded === true) {
      return redirect('/timeline');
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
          <Suspense fallback={<ProfileFormSkeleton />}>
            <OnboardingForm 
              initialProfile={profile} 
              userId={user.id} 
              updateProfileAction={updateProfileAction}
            />
          </Suspense>
        </div>
      </main>
    );
  }
// ローディング表示用のスケルトン
function ProfileFormSkeleton() {
    return (
      <div className="space-y-4">
        <div className="h-32 w-32 rounded-full bg-gray-200 animate-pulse mx-auto"></div>
        <div className="h-10 w-full bg-gray-200 animate-pulse"></div>
        <div className="h-32 w-full bg-gray-200 animate-pulse"></div>
        <div className="h-10 w-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }