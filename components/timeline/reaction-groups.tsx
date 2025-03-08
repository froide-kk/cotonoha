'use client'

import { useState, useOptimistic, useTransition } from 'react'
import ReactionButton from './reaction-button'
import { ReactionType, toggleReaction } from '@/app/actions/dairy.actions'

type ReactionGroupProps = {
  diaryId: string
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

type OptimisticState = {
  reactionCounts: {
    heart: number
    thumbs_up: number
    muscle: number
    party: number
    clap: number
  }
  userReactions: {
    heart: boolean
    thumbs_up: boolean
    muscle: boolean
    party: boolean
    clap: boolean
  }
}

type ServerResponse = {
  reactions: {
    [key in ReactionType]?: number
  },
  userReactions: {
    [key in ReactionType]?: boolean
  }
}

export default function ReactionGroup({ 
  diaryId, 
  reactions, 
  userReactions 
}: ReactionGroupProps) {
  const [isPending, startTransition] = useTransition()
  
  const [serverResults, setServerResults] = useState<ServerResponse>({
    reactions: {},
    userReactions: {}
  })
  
  const defaultUserReactions = {
    heart: false,
    thumbs_up: false,
    muscle: false,
    party: false,
    clap: false
  }

  // ベースとなるユーザーリアクション状態
  const baseUserReactions = userReactions || defaultUserReactions
  
  // サーバーの応答があればそれを優先したリアクション状態
  const actualUserReactions = {
    heart: serverResults.userReactions.heart !== undefined ? serverResults.userReactions.heart : baseUserReactions.heart,
    thumbs_up: serverResults.userReactions.thumbs_up !== undefined ? serverResults.userReactions.thumbs_up : baseUserReactions.thumbs_up,
    muscle: serverResults.userReactions.muscle !== undefined ? serverResults.userReactions.muscle : baseUserReactions.muscle,
    party: serverResults.userReactions.party !== undefined ? serverResults.userReactions.party : baseUserReactions.party,
    clap: serverResults.userReactions.clap !== undefined ? serverResults.userReactions.clap : baseUserReactions.clap
  }
  
  // ベースとなるリアクションカウント（サーバーの応答があればそれを優先）
  const actualReactionCounts = {
    heart: serverResults.reactions.heart !== undefined ? serverResults.reactions.heart : reactions.heart,
    thumbs_up: serverResults.reactions.thumbs_up !== undefined ? serverResults.reactions.thumbs_up : reactions.thumbs_up,
    muscle: serverResults.reactions.muscle !== undefined ? serverResults.reactions.muscle : reactions.muscle,
    party: serverResults.reactions.party !== undefined ? serverResults.reactions.party : reactions.party,
    clap: serverResults.reactions.clap !== undefined ? serverResults.reactions.clap : reactions.clap
  }
  
  const [optimisticState, addOptimisticReaction] = useOptimistic<
    OptimisticState,
    { type: ReactionType, newState: boolean }
  >(
    {
      reactionCounts: actualReactionCounts,
      userReactions: actualUserReactions
    },
    (state, { type, newState }) => {
      const newReactionCounts = { ...state.reactionCounts }
      const newUserReactions = { ...state.userReactions }
      
      const wasActive = newUserReactions[type]
      
      // リアクション状態を更新
      newUserReactions[type] = newState
      
      // リアクション数を調整（状態変化に応じて）
      if (wasActive && !newState) {
        // アクティブ → 非アクティブ: カウント減
        newReactionCounts[type] = Math.max(0, newReactionCounts[type] - 1)
      } else if (!wasActive && newState) {
        // 非アクティブ → アクティブ: カウント増
        newReactionCounts[type] = newReactionCounts[type] + 1
      }
      return {
        reactionCounts: newReactionCounts,
        userReactions: newUserReactions
      }
    }
  )
  
  const updateReaction = async (action: { type: ReactionType, newState: boolean }) => {
    const { type, newState } = action
    
    // リアクション処理を開始
    startTransition(async () => {
      // 現在のカウント数を取得
      const currentCount = optimisticState.reactionCounts[type]
      // 現在のアクティブ状態
      const currentActive = optimisticState.userReactions[type]
      
      const newCount = newState
        ? currentActive ? currentCount : currentCount + 1  
        : currentActive ? currentCount - 1 : currentCount  
      
      addOptimisticReaction(action)
      
      try {
        const result = await toggleReaction(diaryId, type)
        
        if (result.success) {
          setServerResults(prev => ({
            reactions: {
              ...prev.reactions,
              [type]: newCount
            },
            userReactions: {
              ...prev.userReactions,
              [type]: result.newState
            }
          }))
        } else {
          console.error('リアクション更新エラー:', result.error)
        }
      } catch (error) {
        console.error('リアクション処理中のエラー:', error)
      }
    })
  }

  return (
    <div className="flex flex-wrap gap-1 mt-3">
      <ReactionButton 
        diaryId={diaryId} 
        type="heart" 
        count={optimisticState.reactionCounts.heart} 
        active={optimisticState.userReactions.heart}
        addOptimisticReaction={updateReaction}
        isPending={isPending}
      />
      <ReactionButton 
        diaryId={diaryId} 
        type="thumbs_up" 
        count={optimisticState.reactionCounts.thumbs_up} 
        active={optimisticState.userReactions.thumbs_up}
        addOptimisticReaction={updateReaction}
        isPending={isPending}
      />
      <ReactionButton 
        diaryId={diaryId} 
        type="muscle" 
        count={optimisticState.reactionCounts.muscle} 
        active={optimisticState.userReactions.muscle}
        addOptimisticReaction={updateReaction}
        isPending={isPending}
      />
      <ReactionButton 
        diaryId={diaryId} 
        type="party" 
        count={optimisticState.reactionCounts.party} 
        active={optimisticState.userReactions.party}
        addOptimisticReaction={updateReaction}
        isPending={isPending}
      />
      <ReactionButton 
        diaryId={diaryId} 
        type="clap" 
        count={optimisticState.reactionCounts.clap} 
        active={optimisticState.userReactions.clap}
        addOptimisticReaction={updateReaction}
        isPending={isPending}
      />
    </div>
  )
}