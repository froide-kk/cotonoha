'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 型定義
export type DiaryEntry = {
  id: string
  title: string
  content: string
  diary_date: string
  posted_at: string
  created_at: string
  status: string
  user: {
    id: string
    name: string
    avatarUrl: string
  }
  reactions: {
    heart: number
    thumbs_up: number
    muscle: number
    party: number
    clap: number
    total: number
  }
  userReactions: {
    heart: boolean
    thumbs_up: boolean
    muscle: boolean
    party: boolean
    clap: boolean
  } | null
}

export type ReactionType = 'heart' | 'thumbs_up' | 'muscle' | 'party' | 'clap'

// タイムラインの投稿を取得する関数
export async function getTimelinePosts(cursor?: string | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  let query = supabase
    .from('diaries')
    .select(`
      id,
      title,
      content,
      diary_date,
      posted_at,
      created_at,
      status,
      user_id,
      profiles!user_id(id, user_name, icon)
    `)
    .eq('status', 'public')
    .order('created_at', { ascending: false })
    .limit(10)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }
  
  const { data: diaries, error } = await query

  if (error) {
    console.error('Error fetching timeline posts:', error.message)
    return { entries: [], nextCursor: null }
  }
  
  if (!diaries?.length) {
    return { entries: [], nextCursor: null }
  }

  const diaryIds = diaries.map(diary => diary.id)
  
  // リアクション数を取得
  const { data: reactionsData } = await supabase
    .from('likes')
    .select('diary_id, heart, thumbs_up, muscle, party, clap')
    .in('diary_id', diaryIds)

  // ユーザー自身のリアクション状態を取得
  const { data: userReactions } = await supabase
    .from('likes')
    .select('diary_id, heart, thumbs_up, muscle, party, clap')
    .in('diary_id', diaryIds)
    .eq('user_id', user.id)

  // エントリーを整形
  const entries: DiaryEntry[] = diaries.map(diary => {
    // この日記に対するすべてのリアクション
    const diaryReactions = reactionsData?.filter(r => r.diary_id === diary.id) || []
    
    // リアクション数のカウント
    const reactions = {
      heart: diaryReactions.filter(r => r.heart).length,
      thumbs_up: diaryReactions.filter(r => r.thumbs_up).length,
      muscle: diaryReactions.filter(r => r.muscle).length,
      party: diaryReactions.filter(r => r.party).length,
      clap: diaryReactions.filter(r => r.clap).length,
      total: diaryReactions.length
    }

    // ユーザー自身のリアクション状態
    const userReaction = userReactions?.find(r => r.diary_id === diary.id)
    const userReactionState = userReaction 
      ? {
          heart: userReaction.heart,
          thumbs_up: userReaction.thumbs_up,
          muscle: userReaction.muscle,
          party: userReaction.party,
          clap: userReaction.clap
        }
      : null

    // ここが重要: profilesの処理を安全に行う
    // Supabaseは時々関連データを配列として返す場合がある
    const profileData = diary.profiles;
    let userProfile;
    
    if (Array.isArray(profileData)) {
      // 配列の場合は最初の要素を使用
      userProfile = profileData[0] || {};
    } else {
      // オブジェクトの場合はそのまま使用
      userProfile = profileData || {};
    }

    return {
      id: diary.id,
      title: diary.title || '', // titleがnullの場合に空文字を設定
      content: diary.content || '',
      diary_date: diary.diary_date,
      posted_at: diary.posted_at,
      created_at: diary.created_at,
      status: diary.status,
      user: {
        id: userProfile.id || '',
        name: userProfile.user_name || '名前なし',
        avatarUrl: userProfile.icon || '/images/unknown-user-icon.svg'
      },
      reactions,
      userReactions: userReactionState
    }
  })

  // 次のページ用のカーソル
  const nextCursor = entries.length > 0 
    ? entries[entries.length - 1].created_at 
    : null

  return { entries, nextCursor }
}

// リアクションの切り替え関数
export async function toggleReaction(diaryId: string, reactionType: ReactionType) {
  const supabase = await createClient()
  
  // ログインユーザーの取得
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'ログインが必要です', newState: false }
  }

  try {
    // 現在のリアクション状態を取得
    const { data: existingReaction } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('diary_id', diaryId)
      .maybeSingle()
    
    let newState = false
    
    if (existingReaction) {
      // 新しい状態は現在の状態の反対
      newState = !existingReaction[reactionType]
      
      // 既存のリアクションを更新
      const { error } = await supabase
        .from('likes')
        .update({ [reactionType]: newState })
        .eq('id', existingReaction.id)
        
      if (error) throw error
    } else {
      // 新しいリアクションを作成
      newState = true
      
      const newReaction = {
        user_id: user.id,
        diary_id: diaryId,
        heart: reactionType === 'heart',
        thumbs_up: reactionType === 'thumbs_up',
        muscle: reactionType === 'muscle',
        party: reactionType === 'party',
        clap: reactionType === 'clap'
      }
      
      const { error } = await supabase
        .from('likes')
        .insert([newReaction])
        
      if (error) throw error
    }
    
    setTimeout(() => {
      revalidatePath('/timeline')
    }, 100)
    
    return { 
      success: true, 
      newState: newState
    }
  } catch (error) {
    console.error('リアクション更新エラー:', error)
    return { 
      success: false, 
      error: 'リアクションの更新に失敗しました',
      newState: false
    }
  }
}