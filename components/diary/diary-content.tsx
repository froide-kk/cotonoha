interface DiaryContentProps {
  content: string;
}

export default function DiaryContent({ content }: DiaryContentProps) {
  return (
    <>
      <div>
        <p className="text-gray-800 whitespace-pre-line leading-relaxed">
          {content}
        </p>
      </div>
    </>
  );
}
