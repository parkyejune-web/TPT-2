'use client';

import WeekSelector from './WeekSelector';

interface FormHeaderProps {
  investmentType: 'SWING' | 'DAY' | 'SCALPING' | 'FREE' | '';
  userLevel: 'BASIC' | 'PREMIUM';
  completion: 'BEFORE_COMPLETION' | 'AFTER_COMPLETION';
  onWeekChange?: (data: { month: number; week: number }) => void;
}

const investmentTypeMap: Record<string, string> = {
  SWING: '스윙',
  DAY: '데이',
  SCALPING: '스켈핑',
  FREE: '무료',
};

const completionMap: Record<string, string> = {
  BEFORE_COMPLETION: '완강 전',
  AFTER_COMPLETION: '완강 후',
};

/**
 * 피드백 요청 폼 헤더
 */
export default function FormHeader({
  investmentType,
  userLevel,
  completion,
  onWeekChange,
}: FormHeaderProps) {
  const investmentTypeLabel = investmentTypeMap[investmentType] || investmentType;
  const completionLabel = completionMap[completion] || completion;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 text-white rounded ${
            investmentType === 'SWING'
              ? 'bg-amber-400'
              : investmentType === 'DAY'
                ? 'bg-emerald-600'
                : investmentType === 'SCALPING'
                  ? 'bg-blue-500'
                  : 'bg-gray-400'
          }`}
        >
          {investmentTypeLabel}
        </span>
        <span className="px-3 py-1 border rounded">{completionLabel}</span>
      </div>
      {onWeekChange && completion === 'AFTER_COMPLETION' && (
        <WeekSelector onChange={onWeekChange} />
      )}
    </div>
  );
}
