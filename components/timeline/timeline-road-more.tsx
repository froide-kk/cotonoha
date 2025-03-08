'use client'

import { DiaryEntry, getTimelinePosts } from "@/app/actions/dairy.actions"
import { useState, useTransition, useEffect } from "react"
import TimelineItem from "./timeline-item"
import { useInView } from "react-intersection-observer"

type TimelineInfiniteScrollProps = {
  initialEntries: DiaryEntry[]
  initialNextCursor: string | null
}

export default function TimelineInfiniteScroll({ 
  initialEntries, 
  initialNextCursor 
}: TimelineInfiniteScrollProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>(initialEntries)
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor)
  const [isPending, startTransition] = useTransition()
  
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  })

  useEffect(() => {
    if (inView && nextCursor && !isPending) {
      startTransition(async () => {
        try {
          const result = await getTimelinePosts(nextCursor)
          setEntries(prev => [...prev, ...result.entries])

          setNextCursor(result.nextCursor)
        } catch (error) {
          console.error('投稿の読み込みエラー:', error)
        }
      })
    }
  }, [inView, nextCursor, isPending])

  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <TimelineItem key={entry.id} entry={entry} />
      ))}
      
      {nextCursor && (
        <div 
          ref={ref}
          className="py-4 flex items-center justify-center"
        >
          {isPending ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">読み込み中...</span>
            </div>
          ) : (
            <div className="h-10 w-full"></div> 
          )}
        </div>
      )}

      {!nextCursor && entries.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          これ以上の投稿はありません
        </div>
      )}
      
      {entries.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-2">タイムラインに表示する投稿がありません</p>
          <p className="text-sm">フォローしているユーザーの投稿がここに表示されます</p>
        </div>
      )}
    </div>
  )
}