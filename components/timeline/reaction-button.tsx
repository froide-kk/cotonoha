'use client'

import { useState } from 'react'
import { HeartIcon, ThumbsUpIcon, Flame, PartyPopper, Award } from 'lucide-react'
import { ReactionType } from '@/app/actions/dairy.actions'

type ReactionButtonProps = {
  diaryId: string
  type: ReactionType
  count: number
  active: boolean
  isPending: boolean
  addOptimisticReaction: (action: { type: ReactionType, newState: boolean }) => void
}

// リアクションタイプ別の設定
const reactionConfig = {
  heart: {
    icon: HeartIcon,
    label: '❤️ いいね',
    activeColor: 'text-red-500',
  },
  thumbs_up: {
    icon: ThumbsUpIcon,
    label: '👍 いいね',
    activeColor: 'text-blue-500',
  },
  muscle: {
    icon: Flame,
    label: '💪 えらい',
    activeColor: 'text-purple-500',
  },
  party: {
    icon: PartyPopper,
    label: '🎉 おめでとう',
    activeColor: 'text-amber-500',
  },
  clap: {
    icon: Award,
    label: '👏 すごい',
    activeColor: 'text-green-500',
  },
}

export default function ReactionButton({ 
  diaryId, 
  type, 
  count, 
  active, 
  isPending,
  addOptimisticReaction 
}: ReactionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const { icon: Icon, label, activeColor } = reactionConfig[type]

  const handleReaction = async () => {
    if (isLoading || isPending) return
    
    try {
      setIsLoading(true)
      
      const newState = !active
      
      await addOptimisticReaction({ type, newState })
      
    } catch (error) {
      console.error('リアクション処理エラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isProcessing = isLoading || isPending

  return (
    <button
      onClick={handleReaction}
      disabled={isProcessing}
      className={`flex items-center gap-1 py-1 px-2 rounded-md transition-colors
        ${active 
          ? `${activeColor} bg-gray-100` 
          : 'text-gray-500 hover:bg-gray-100'
        }
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={label}
    >
      <Icon size={16} className={active ? activeColor : ''} />
      {count > 0 && (
        <span className="text-xs font-medium">{count}</span>
      )}
    </button>
  )
}