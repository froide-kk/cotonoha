import { Suspense } from 'react'
import TimelineList from '@/components/timeline/timeline-list'


export default function TimelinePage() {
  return (
    <main className='container mx-auto px-4 py-8 max-w-2xl'>
      <h1 className='text-3xl font-bold mb-6'>タイムライン</h1>
      <Suspense fallback={<TimelineSkeleton />}>
        <TimelineList />
      </Suspense>
    </main>
  )
}

// ローディング時のスケルトンUI
function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 animate-pulse">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex mt-3 gap-2">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
