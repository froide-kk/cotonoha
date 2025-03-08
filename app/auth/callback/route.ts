import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin
    const redirectTo = requestUrl.searchParams.get('redirect_to')

    if (!code) {
      return NextResponse.redirect(
        `${origin}/sign-in?error=auth_callback_error`,
      )
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        `${origin}/sign-in?error=${encodeURIComponent(error.message)}`,
      )
    }

    // セッション取得を確認
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(`${origin}/sign-in?error=session_not_found`)
    }

    // オンボーディング状態のみをチェック
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_onboarded')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.redirect(`${origin}/sign-in?error=profile_fetch_error`)
    }

    // オンボーディングが未完了の場合
    if (profile && profile.is_onboarded === false) {
      return NextResponse.redirect(`${origin}/onboarding`)
    }

    // オンボーディング完了済みで、リダイレクト先が指定されている場合
    if (redirectTo) {
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }

    return NextResponse.redirect(`${origin}/timeline`)
  } catch (error) {
    const origin = new URL(request.url).origin
    return NextResponse.redirect(`${origin}/sign-in?error=unexpected_error`)
  }
}