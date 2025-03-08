// app/actions/profile.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache';

export async function getProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Profile fetch error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, profile: data }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }

  const userName = formData.get('user_name') as string
  const bio = formData.get('bio') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      user_name: userName,
      bio: bio,
      is_onboarded: true,  
    })
    .eq('id', user.id)

  if (error) {
    console.error('Profile update error:', error)
    return { success: false, error: error.message }
  }

  redirect('/')
}

export async function updateProfileAction(formData: FormData) {
    // FormDataから値を取得
    const userId = formData.get('userId') as string;
    const userName = formData.get('userName') as string;
    const bio = formData.get('bio') as string;
    const avatarUrl = formData.get('avatarUrl') as string | null;
  
    if (!userId) {
      return { error: 'ユーザーIDが見つかりません' };
    }
  
    if (!userName || userName.trim() === '') {
      return { error: 'ニックネームは必須です' };
    }
  
    if (userName.length > 30) {
      return { error: 'ニックネームは30文字以内で入力してください' };
    }
  
    if (bio && bio.length > 100) {
      return { error: '自己紹介は100文字以内で入力してください' };
    }
  
    try {
      const supabase = await createClient();
  
      // プロフィール更新
      const { error } = await supabase
        .from('profiles')
        .update({
          user_name: userName.trim(),
          bio: bio ? bio.trim() : null,
          icon: avatarUrl,
          is_onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
  
      if (error) {
        console.error('Profile update error:', error);
        return { error: `プロフィール更新エラー: ${error.message}` };
      }
  
      // キャッシュを更新
      revalidatePath('/timeline');
      revalidatePath('/profile');
  
      return { success: true };
    } catch (err) {
      return { 
        error: err instanceof Error ? err.message : '予期せぬエラーが発生しました'
      };
    }
  }