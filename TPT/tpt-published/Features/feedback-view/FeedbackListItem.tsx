'use client';

import { useRouter } from 'next/navigation';

interface FeedbackListItemProps {
  time: string;
  title: string;
  isNew: boolean;
  feedbackId: number;
}

/**
 * 피드백 목록 아이템 컴포넌트
 */
export default function FeedbackListItem({ time, title, isNew, feedbackId }: FeedbackListItemProps) {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
      onClick={() => router.push(`/my/feedback-detail?id=${feedbackId}`)}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{time}</span>
        <span className="text-md font-medium">{title}</span>
        {isNew && (
          <span className="px-2 py-1 text-xs bg-red-500 text-white rounded">NEW</span>
        )}
      </div>
    </div>
  );
}
