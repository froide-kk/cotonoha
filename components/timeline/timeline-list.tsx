import { getTimelinePosts } from "@/app/actions/dairy.actions";
import TimelineLoadMore from "./timeline-road-more";

export default async function TimelineList() {
  // 初期データを取得
  const { entries, nextCursor } = await getTimelinePosts();
  
  return <TimelineLoadMore initialEntries={entries} initialNextCursor={nextCursor} />;
}