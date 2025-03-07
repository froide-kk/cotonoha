'use client'

import { useRouter } from 'next/navigation';

type ReadMoreButtonProps = {
  entryId: string;
};

export default function ReadMoreButton({ entryId }: ReadMoreButtonProps) {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/diary/${entryId}`);
  };
  
  return (
    <button
      onClick={handleClick}
      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
    >
      もっと見る
    </button>
  );
}