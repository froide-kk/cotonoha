'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type TimelineContentProps = {
  content: string
  entryId: string
}

export default function TimelineContent({ content, entryId }: TimelineContentProps) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  
  const SHORT_LENGTH = 100 
  const EXPANDED_LENGTH = 500  
  
  const isShortTruncated = content.length > SHORT_LENGTH
  const isFullyTruncated = content.length > EXPANDED_LENGTH
  
  // 表示するコンテンツを決定
  const displayContent = expanded
    ? (isFullyTruncated ? content.substring(0, EXPANDED_LENGTH) + '...' : content)
    : (isShortTruncated ? content.substring(0, SHORT_LENGTH) + '...' : content)
  
  // もっと見るボタンのクリックハンドラ
  const handleReadMore = () => {
    if (expanded && isFullyTruncated) {
      router.push(`/diary/${entryId}`)
    } else {
      setExpanded(true)
    }
  }
  
  return (
    <div>
      <p className="text-gray-800 whitespace-pre-line leading-relaxed">
        {displayContent}
      </p>
            {(isShortTruncated && !expanded) || (isFullyTruncated && expanded) ? (
        <div className="text-right mt-2">
          <button
            onClick={handleReadMore}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            {expanded ? '詳細ページで見る' : 'もっと見る'}
          </button>
        </div>
      ) : null}
    </div>
  )
}