// middleware.ts
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// 定数を外部で定義して再利用性を高める
const AUTH_REQUIRED_PATHS = ['/dashboard', '/profile', '/diary', '/timeline']
const ONBOARDING_PATH = '/onboarding'
const AUTH_PATHS = ['/sign-in', '/sign-up']

export async function middleware(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: { headers: request.headers },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!(supabaseUrl && supabaseAnonKey)) {
      return response // 環境変数がない場合は早期リターン
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }

          response = NextResponse.next({ request })

          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    const pathname = request.nextUrl.pathname

    // 未認証ユーザーの処理
    if (!user) {
      // 認証が必要なパスへのアクセス制御
      if (
        AUTH_REQUIRED_PATHS.some(path => pathname.startsWith(path)) ||
        pathname === ONBOARDING_PATH
      ) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
      return response
    }

    // 認証済みユーザーの処理
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_onboarded')  // onboarding_completedからis_onboardedに修正
      .eq('id', user.id)
      .single()

    const isOnboarded = profile?.is_onboarded === true  // フィールド名の修正

    // 認証ページへのアクセスをリダイレクト
    if (AUTH_PATHS.includes(pathname)) {
      return NextResponse.redirect(
        new URL(isOnboarded ? '/timeline' : ONBOARDING_PATH, request.url)  // トップページの代わりにtimelineへ
      )
    }

    // オンボーディングページへのリダイレクト
    if (!isOnboarded && pathname !== ONBOARDING_PATH) {
      return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url))
    }

    // オンボーディング完了済みのユーザーをタイムラインへリダイレクト
    if (isOnboarded && pathname === ONBOARDING_PATH) {
      return NextResponse.redirect(new URL('/timeline', request.url))  // トップページの代わりにtimelineへ
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next({
      request: { headers: request.headers },
    })
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}