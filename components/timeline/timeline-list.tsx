import { getTimelinePosts } from "@/app/actions/dairy.actions"
import TimelineInfiniteScroll from "./timeline-road-more"


export default async function TimelineList() {
  const { entries, nextCursor } = await getTimelinePosts()
  
  return (
    <TimelineInfiniteScroll 
      initialEntries={entries} 
      initialNextCursor={nextCursor} 
    />
  )
}