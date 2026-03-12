import Image from 'next/image';
import { Play, Clock, Coins, FileCheck } from 'lucide-react';
import ThumbnailPlaceholder from '../../Shared/ui/ThumbnailPlaceholder';
import type { LectureData } from '../../Shared/api/services/lectureService';

interface LectureCardProps {
  lecture: LectureData;
  onClick: () => void;
  className?: string;
}

/**
 * 프리미엄 강의 카드
 * 토스/애플 스타일의 미니멀하고 세련된 디자인
 */
export default function LectureCard({ lecture, onClick, className = '' }: LectureCardProps) {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
    }
    return `${minutes}분`;
  };

  // 토큰 강의가 이미 구매되었는지 확인 (dueDate 또는 lastWatchedAt이 있으면 구매 완료)
  const isTokenPurchased = !!lecture.dueDate || !!lecture.lastWatchedAt;
  const requiresToken = (lecture.requiredTokens ?? 0) > 0;

  // 남은 수강 기간 계산
  const getRemainingDays = (): number | null => {
    if (!lecture.dueDate) return null;
    const dueDate = new Date(lecture.dueDate);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = getRemainingDays();

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer ${className}`}
    >
      {/* 썸네일 */}
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100 mb-3">
        {lecture.thumbnailUrl ? (
          <Image
            src={lecture.thumbnailUrl}
            alt={lecture.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ThumbnailPlaceholder className="h-full" />
        )}

        {/* 플레이 버튼 - 호버 시에만 표시 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/0 group-hover:bg-white backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Play className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* 완료 상태 */}
        {lecture.completed && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {/* 과제 제출 완료 상태 */}
        {lecture.assignmentSubmitted && !lecture.completed && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center" title="과제 제출 완료">
            <FileCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        )}

        {/* 진행률 */}
        {lecture.progressPercent !== undefined && lecture.progressPercent > 0 && !lecture.completed && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${lecture.progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="px-1 flex gap-3">
        {/* 토큰 정보 (Column) - 구매 완료 여부에 따라 다르게 표시 */}
        {requiresToken && (
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            {isTokenPurchased ? (
              // 구매 완료 상태
              <>
                <div className="w-[30px] h-[30px] rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-green-600 font-semibold whitespace-nowrap">
                  {remainingDays !== null ? `D-${remainingDays}` : '구매완료'}
                </span>
              </>
            ) : (
              // 미구매 상태 - 토큰 필요
              <>
                <Image
                  src="/images/icon_coin_token.svg"
                  alt="token"
                  width={30}
                  height={30}
                  className="object-contain"
                />
                <span className="text-xs text-gray-700 font-semibold whitespace-nowrap">
                  {lecture.tokenCost} 개
                </span>
              </>
            )}
          </div>
        )}

        {/* 시간/제목/설명 (Column) */}
        <div className="flex-1 min-w-0">
          {/* 시간 정보 */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
            <span className="text-xs text-gray-500 font-medium">
              {formatDuration(lecture.durationSeconds)}
            </span>
          </div>

          {/* 타이틀 */}
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug mb-1 group-hover:text-gray-700 transition-colors">
            {lecture.title}
          </h3>

          {/* Description */}
          {lecture.content && (
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {lecture.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
