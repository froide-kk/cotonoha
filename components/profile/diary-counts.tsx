import { calculateConsistencyRate, getMaxPostDay } from "@/lib/diary";
import StatCard from "../stat-card";

export function DiaryCounts({ diaryCountsData }) {
  return (
    <>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">統計情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="総投稿日数"
            value={Object.keys(diaryCountsData).length.toString()}
            description="日記を書いた日の総数"
          />
          <StatCard
            title="最多投稿日"
            value={getMaxPostDay(diaryCountsData)}
            description="1日の最大投稿数"
          />
          <StatCard
            title="継続率"
            value={`${calculateConsistencyRate(diaryCountsData)}%`}
            description="過去30日間の投稿率"
          />
        </div>
      </div>
    </>
  );
}