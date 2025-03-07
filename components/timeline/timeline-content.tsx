import ReadMoreButton from "./readmore-button";

type TimelineContentProps = {
  content: string;
  entryId: string;
};

export default function TimelineContent({ content, entryId }: TimelineContentProps) {
  const MAX_LENGTH = 100; // 表示する最大文字数
  const isTruncated = content.length > MAX_LENGTH;
  const displayContent = isTruncated 
    ? content.substring(0, MAX_LENGTH) + '...' 
    : content;
  
  return (
    <div>
      <p className="text-gray-800 whitespace-pre-line leading-relaxed">{displayContent}</p>
      {isTruncated && (
        <div className="text-right mt-2">
          <ReadMoreButton entryId={entryId} />
        </div>
      )}
    </div>
  );
}