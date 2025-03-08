"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { format, subYears } from "date-fns";
import { ja } from "date-fns/locale";

// Client Componentとして動的にインポート
const HeatMap = dynamic(
  () => import("@uiw/react-heat-map").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] flex items-center justify-center">
        ヒートマップを読み込み中...
      </div>
    ),
  }
);

interface DiaryHeatmapProps {
  diaryCountsData: Record<string, number>;
}

export function DiaryHeatmap({ diaryCountsData }: DiaryHeatmapProps) {
  const [mounted, setMounted] = useState(false);
  const today = new Date();
  const startDate = subYears(today, 1);
  const endDate = today;

  // データをヒートマップ用の形式に変換
  const heatmapData = Object.entries(diaryCountsData).map(([date, count]) => ({
    date,
    count,
  }));

  // クライアントサイドでのみレンダリング
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div>
        <HeatMap
          value={heatmapData}
          width="100%"
          height={200}
          startDate={startDate}
          endDate={endDate}
          rectSize={14}
          rectRender={(props, data) => {
            // ツールチップの内容をカスタマイズ
            if (data.count !== undefined) {
              return (
                <rect
                  {...props}
                  data-tip={`${format(new Date(data.date), "yyyy年MM月dd日", { locale: ja })}: ${data.count}件の日記`}
                />
              );
            }
            return <rect {...props} />;
          }}
          legendRender={(legendProps) => (
            <rect {...legendProps} rx={2} ry={2} />
          )}
          panelColors={{
            0: "#ebedf0",
            2: "#c6e48b",
            4: "#7bc96f",
            6: "#239a3b",
            8: "#196127",
          }}
          monthLabels={[
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ]}
          weekLabels={["日", "月", "火", "水", "木", "金", "土"]}
        />
      </div>
      <div className="flex justify-end mt-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>少ない</span>
          {["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"].map(
            (color) => (
              <div
                key={color}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
            )
          )}
          <span>多い</span>
        </div>
      </div>
    </div>
  );
}
