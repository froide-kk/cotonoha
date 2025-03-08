'use client'

import { DiaryEntry } from "@/app/actions/dairy.actions"
import TimelineContent from "./timeline-content"
import ReactionGroup from "./reaction-groups"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

type TimelineItemProps = {
  entry: DiaryEntry
}

export default function TimelineItem({ entry }: TimelineItemProps) {
  const router = useRouter()
  
  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return '数分前'
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`
    } else {
      return date.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
    const navigateToProfile = () => {
    router.push(`/profile/${entry.user.id}`)
  }
    const getAvatarUrl = () => {
    if (entry.user.avatarUrl) {
      // URLの検証
      try {
        new URL(entry.user.avatarUrl);
        return entry.user.avatarUrl;
      } catch (e) {
        if (entry.user.avatarUrl.startsWith('/')) {
          return entry.user.avatarUrl;
        }
      }
    }
    return '/images/unknown-user-icon.svg';
  };

  const avatarUrl = getAvatarUrl();
  
  return (
    <article className="border rounded-lg p-4 bg-white shadow-sm hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-3">
        <div 
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer relative"
          onClick={navigateToProfile}
        >
        <div 
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer relative"
          onClick={navigateToProfile}
        >
          <img 
            src={avatarUrl}
            alt={entry.user.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.warn(`画像読み込みエラー: ${avatarUrl}`);
              const target = e.target as HTMLImageElement;
              target.src = '/images/unknown-user-icon.svg';
            }}
          />
        </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href={`/profile/${entry.user.id}`}
              className="font-medium hover:underline"
            >
              {entry.user.name}
            </Link>
            <span className="text-gray-500 text-sm">{formatDate(entry.created_at)}</span>
          </div>
          {entry.title && (
            <h3 className="text-lg font-semibold mb-2">{entry.title}</h3>
          )}
          <TimelineContent 
            content={entry.content} 
            entryId={entry.id} 
          />
          <ReactionGroup 
            diaryId={entry.id}
            reactions={entry.reactions}
            userReactions={entry.userReactions}
          />
        </div>
      </div>
    </article>
  )
}