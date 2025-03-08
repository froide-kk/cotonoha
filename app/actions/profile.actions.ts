// app/actions/profile.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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