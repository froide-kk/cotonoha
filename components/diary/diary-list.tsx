import { getTimelinePosts } from "@/app/actions/dairy.actions";
import DiaryItem from "./diary-item";

export default async function DiaryList() {
  // 初期データを取得
  const { entries } = await getTimelinePosts();
  return (
    <>
      <div className="space-y-4">
        {entries.map((entry) => (
          <DiaryItem entry={{ ...entry, id: Number(entry.id), createdAt: new Date(entry.createdAt) }} />
        ))}
      </div>
    </>
  );
}
