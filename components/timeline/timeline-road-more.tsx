'use client'

import { useEffect, useRef, useState } from 'react';
import TimelineItem from './timeline-item';
import { DiaryEntry, getTimelinePosts } from '@/app/actions/dairy.actions';

type TimelineLoadMoreProps = {
  initialEntries: DiaryEntry[];
  initialNextCursor: string | null;
};

export default function TimelineLoadMore({ 
  initialEntries, 
  initialNextCursor 
}: TimelineLoadMoreProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>(initialEntries);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => {
    // 無限スクロールの設定
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loading) {
          setLoading(true);
          
          try {
            const result = await getTimelinePosts(nextCursor);
            
            setEntries(prev => [...prev, ...result.entries]);
            setNextCursor(result.nextCursor);
          } catch (error) {
            console.error('投稿の読み込み中にエラーが発生しました:', error);
          } finally {
            setLoading(false);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [nextCursor, loading]);

  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <TimelineItem key={entry.id} entry={entry} />
      ))}
      
      {nextCursor && (
        <div 
          ref={observerTarget} 
          className="py-4 flex items-center justify-center"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">読み込み中...</span>
            </div>
          ) : (
            <div className="h-10 w-full"></div> // 交差を検知するための要素
          )}
        </div>
      )}
      
      {!nextCursor && entries.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          これ以上の投稿はありません
        </div>
      )}
    </div>
  );
}