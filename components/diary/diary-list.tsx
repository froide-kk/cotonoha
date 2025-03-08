import { getDiaryList } from "@/app/actions/dairy.actions";
import DiaryItem from "./diary-item";

export default async function DiaryList() {
  const diaryList = await getDiaryList();

  return (
    <>
      <div className="space-y-4">
        {diaryList?.map((diary) => <DiaryItem diary={diary} />)}
      </div>
    </>
  );
}
