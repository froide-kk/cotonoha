import { formatDate } from "date-fns";
import DiaryContent from "./diary-content";

interface DiaryEntry {
  user: {
    name: string;
  };
  createdAt: Date;
  content: string;
  id: number;
}

export default function DiaryItem({ entry }: { entry: DiaryEntry }) {
  return (
    <>
      <div className="border rounded-lg p-4 bg-white shadow-sm hover:bg-gray-50 transition-colors">
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span>タイトル</span>
              <span className="text-gray-500 text-sm">
                {entry.createdAt < new Date()
                  ? formatDate(entry.createdAt, "yyyy/MM/dd HH:mm")
                  : "数秒前"}
              </span>
            </div>
            <DiaryContent content={entry.content} />
          </div>
        </div>
      </div>
    </>
  );
}
