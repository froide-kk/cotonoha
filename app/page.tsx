import { getYear } from "date-fns";
import { Seasons } from "astronomy-engine";
import Image from "next/image";

// 現在の年の四季の日付を取得
export function getSeasonDates(year: number) {
  const seasons = Seasons(year);
  return {
    springEquinox: seasons.mar_equinox.date,
    summerSolstice: seasons.jun_solstice.date,
    autumnEquinox: seasons.sep_equinox.date,
    winterSolstice: seasons.dec_solstice.date,
  };
}

// 現在の季節を判定
function getCurrentSeason(): string {
  const now = new Date();
  const year = getYear(now);
  const { springEquinox, summerSolstice, autumnEquinox, winterSolstice } = getSeasonDates(year);

  if (now >= springEquinox && now < summerSolstice) {
    return "spring";
  } else if (now >= summerSolstice && now < autumnEquinox) {
    return "summer";
  } else if (now >= autumnEquinox && now < winterSolstice) {
    return "autumn";
  } else {
    return "winter";
  }
}

// 季節の木の画像パス
const getTreeImage = (season: string) => {
  switch (season) {
    case "spring":
      return "/images/tree/tree_spring.png";
    case "summer":
      return "/images/tree/tree_summer.png";
    case "autumn":
      return "/images/tree/tree_autumn.png";
    case "winter":
      return "/images/tree/tree_winter.png";
    default:
      return "/images/tree/tree_summer.png";
  }
};

// 現在の季節
const currentSeason = getCurrentSeason();

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-6 px-4">
      <h1 className="text-2xl font-bold">
        現在の季節: {" "}
        {currentSeason === "spring"
          ? "🌸 春"
          : currentSeason === "summer"
          ? "☀️ 夏"
          : currentSeason === "autumn"
          ? "🍁 秋"
          : "❄️ 冬"}
      </h1>

      {/* 季節の木の画像 */}
      <Image src={getTreeImage(currentSeason)} alt="Seasonal Tree" width={200} height={250} className="rounded-lg shadow-lg" />

      {/* 季節の説明 */}
      {currentSeason === "spring" && <p className="text-lg text-pink-500">春の季節です。</p>}
      {currentSeason === "summer" && <p className="text-lg text-yellow-500">夏の季節です。</p>}
      {currentSeason === "autumn" && <p className="text-lg text-orange-500">秋の季節です。</p>}
      {currentSeason === "winter" && <p className="text-lg text-blue-500">冬の季節です。</p>}
    </main>
  );
}