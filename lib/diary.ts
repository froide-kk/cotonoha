// 最多投稿日を取得する関数
export function getMaxPostDay(data: Record<string, number>): string {
  const maxCount = Math.max(...Object.values(data), 0);
  return maxCount.toString();
}

// 継続率を計算する関数（過去30日間の投稿率）
export function calculateConsistencyRate(data: Record<string, number>): string {
  const today = new Date();
  let daysWithPosts = 0;

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];

    if (data[dateString] && data[dateString] > 0) {
      daysWithPosts++;
    }
  }

  return ((daysWithPosts / 30) * 100).toFixed(1);
}

// モックデータを生成する関数
export function generateMockDiaryData(): Record<string, number> {
  const data: Record<string, number> = {}
  const today = new Date()
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  // 過去1年間の日付を生成
  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    // ランダムに投稿があるかどうかを決定（70%の確率で投稿あり）
    if (Math.random() < 0.7) {
      const dateString = d.toISOString().split("T")[0]
      // 1〜10の間でランダムな投稿数を生成
      data[dateString] = Math.floor(Math.random() * 10) + 1
    }
  }

  // 特定のパターンを作成（週末に多く投稿するパターン）
  const sixMonthsAgo = new Date(today)
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  for (let d = new Date(sixMonthsAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const day = d.getDay() // 0: 日曜日, 6: 土曜日
    const dateString = d.toISOString().split("T")[0]

    // 週末は投稿数を増やす
    if (day === 0 || day === 6) {
      data[dateString] = Math.floor(Math.random() * 5) + 6 // 6〜10の間
    }
  }

  // 連続投稿期間を作成（1ヶ月間毎日投稿）
  const twoMonthsAgo = new Date(today)
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
  const oneMonthAgo = new Date(today)
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  for (let d = new Date(twoMonthsAgo); d <= oneMonthAgo; d.setDate(d.getDate() + 1)) {
    const dateString = d.toISOString().split("T")[0]
    data[dateString] = Math.floor(Math.random() * 5) + 3 // 3〜7の間
  }

  return data
}

