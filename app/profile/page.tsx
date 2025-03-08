import Profile from "../../components/profile/profile";
import { Suspense } from "react";
import { DiaryHeatmap } from "@/components/profile/contribution-map";
import { generateMockDiaryData } from "@/lib/diary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiaryCounts } from "@/components/profile/diary-counts";
import DiaryList from "@/components/diary/diary-list";

export default async function ProfilePage() {
  // モックデータを生成
  const diaryCountsData = generateMockDiaryData();

  return (
    <div className="container mx-auto py-8">
      <Profile />
      <Tabs defaultValue="contribution-map" className="w-full">
        <TabsList className="flex flex-row justify-center bg-transparent mt-8">
          <TabsTrigger
            className="bg-transparent data-[state=active]:border-b-2 !rounded-none px-10 data-[state=active]:shadow-transparent"
            value="contribution-map"
          >
            COTONOHA
          </TabsTrigger>
          <TabsTrigger
            className="bg-transparent data-[state=active]:border-b-2 !rounded-none px-10 data-[state=active]:shadow-transparent"
            value="my-diary"
          >
            日記一覧
          </TabsTrigger>
        </TabsList>
        <TabsContent value="contribution-map">
          <h1 className="text-3xl font-bold mb-6">あなたの日記タイムライン</h1>
          <div className="mt-10">
            <div className="flex justify-center items-center mb-8">
              <img src="/images/tree_growth/old_tree.png" />
            </div>

            <p className="text-muted-foreground mb-8">
              過去12ヶ月間の日記投稿状況を一目で確認できます。色が濃いほど多くの日記を書いた日です。
            </p>

            <Card>
              <CardHeader>
                <CardTitle>投稿ヒートマップ</CardTitle>
                <CardDescription>
                  日々の記録の積み重ねが見える化されています
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Suspense fallback={<HeatmapSkeleton />}>
                  <DiaryHeatmap diaryCountsData={diaryCountsData} />
                </Suspense>
              </CardContent>
            </Card>
            <DiaryCounts diaryCountsData={diaryCountsData} />
          </div>
        </TabsContent>
        <TabsContent value="my-diary">
          <div className="mt-10">
            <h1 className="text-3xl font-bold mb-6">あなたの日記一覧</h1>
            <p className="text-muted-foreground mb-8">あなたの日記一覧です。</p>
            <DiaryList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HeatmapSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="h-[200px] w-full" />
    </div>
  );
}
