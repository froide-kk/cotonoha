import { formatDate } from "date-fns";
import DiaryContent from "./diary-content";

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function DiaryItem({ diary }: { diary: DiaryEntry }) {
  return (
    <>
      <div className="border rounded-lg p-4 bg-white shadow-sm hover:bg-gray-50 transition-colors">
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span>{diary.title}</span>
              <span className="text-gray-500 text-sm">
                {diary.createdAt < new Date()
                  ? formatDate(diary.createdAt, "yyyy/MM/dd HH:mm")
                  : "数秒前"}
              </span>
            </div>
            <DiaryContent content={diary.content} />
          </div>
        </div>
      </div>
    </>
  );
}
