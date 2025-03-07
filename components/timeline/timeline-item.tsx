import { DiaryEntry } from "@/app/actions/dairy.actions";
import TimelineContent from "./timeline-content";


type TimelineItemProps = {
  entry: DiaryEntry;
};

export default function TimelineItem({ entry }: TimelineItemProps) {
  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '数分前';
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`;
    } else {
      return date.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };
  
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-3">
        <img 
          src={entry.user.avatarUrl} 
          alt={entry.user.name} 
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{entry.user.name}</span>
            <span className="text-gray-500 text-sm">{formatDate(entry.createdAt)}</span>
          </div>
          <TimelineContent content={entry.content} entryId={entry.id} />
        </div>
      </div>
    </div>
  );
}