"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ThumbnailPlaceholder from "../../Shared/ui/ThumbnailPlaceholder";
import AccessControlModal from "../../Shared/ui/AccessControlModal";
import { useAccessControl, AccessDeniedReason } from "../../Shared/hooks/useAccessControl";
import { getTrainerWrittenFeedbacks, TrainerWrittenFeedbackItem } from "../../Shared/api/services/feedbackService";

export function TraderJournalSection() {
  const router = useRouter();
  const { checkAccess } = useAccessControl();
  const [feedbacks, setFeedbacks] = useState<TrainerWrittenFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDeniedReason, setAccessDeniedReason] = useState<AccessDeniedReason>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await getTrainerWrittenFeedbacks(0, 12);
        if (response.success && response.data) {
          setFeedbacks(response.data.feedbacks || []);
        } else {
          setError(response.message || '매매일지를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('[TraderJournalSection] 에러:', err);
        setError('매매일지를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleCardClick = (id: number) => {
    // UID_APPROVED_REQUIRED 권한 검사
    const accessResult = checkAccess('UID_APPROVED_REQUIRED');
    if (!accessResult.allowed) {
      setAccessDeniedReason(accessResult.reason);
      setIsAccessModalOpen(true);
      return;
    }
    router.push(`/my/feedback-detail?id=${id}`);
  };

  const handleNext = () => {
    if (currentIndex + 4 < feedbacks.length) {
      setCurrentIndex(currentIndex + 4);
    }
  };

  const handlePrev = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex(currentIndex - 4);
    }
  };

  if (loading) {
    return (
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">TPT 트레이더 매매일지</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">TPT 트레이더 매매일지</h2>
        </div>
        <div className="text-center py-12 text-gray-500">{error}</div>
      </section>
    );
  }

  const displayedFeedbacks = feedbacks.slice(currentIndex, currentIndex + 4);

  // title에서 PNL 부분을 추출하여 색상 처리하는 함수
  const renderTitleWithPnl = (title: string) => {
    if (!title) return <span>매매일지</span>;

    // +로 시작하고 %로 끝나는 패턴 또는 -로 시작하고 %로 끝나는 패턴 매칭
    const pnlRegex = /([+-]\d+(?:\.\d+)?%)/g;
    const parts = title.split(pnlRegex);

    return parts.map((part, index) => {
      if (part.match(/^\+\d+(?:\.\d+)?%$/)) {
        // +로 시작하는 PNL -> 초록색
        return <span key={index} className="text-green-600 font-semibold">{part}</span>;
      } else if (part.match(/^-\d+(?:\.\d+)?%$/)) {
        // -로 시작하는 PNL -> 빨간색
        return <span key={index} className="text-red-600 font-semibold">{part}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">TPT 트레이더 매매일지</h2>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {displayedFeedbacks.length > 0 ? displayedFeedbacks.map((feedback, index) => (
            <div
              key={`feedback-${feedback.id}-${index}`}
              onClick={() => handleCardClick(feedback.id)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
            >
              {/* 차트 이미지 영역 */}
              <div className="relative h-48">
                {feedback.imageUrls && feedback.imageUrls.length > 0 ? (
                  <Image
                    src={feedback.imageUrls[0]}
                    alt={feedback.title || '매매일지'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ThumbnailPlaceholder className="h-full" />
                )}
                {/* TPT 로고 */}
                <div className="absolute top-2 left-2">
                  <Image
                    src="/images/final_main_logo.svg"
                    alt="TPT"
                    width={20}
                    height={20}
                    className="drop-shadow-md"
                  />
                </div>
              </div>

              {/* 내용 */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{renderTitleWithPnl(feedback.title)}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {feedback.tradingReview?.substring(0, 50) || '매매일지 내용'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{feedback.trainerName}</span>
                  {feedback.pnl !== undefined && feedback.pnl !== null && (
                    <span className={feedback.pnl >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      P&L: {feedback.pnl >= 0 ? '+' : ''}{feedback.pnl}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              아직 매매일지가 없습니다.
            </div>
          )}
        </div>

        {/* 이전 버튼 - 첫 번째 카드와 겹치게 배치 */}
        {feedbacks.length > 4 && currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 z-10 border border-gray-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* 다음 버튼 - 마지막 카드와 겹치게 배치 */}
        {feedbacks.length > 4 && currentIndex + 4 < feedbacks.length && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 z-10 border border-gray-200"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      {/* 접근 권한 검사 모달 */}
      <AccessControlModal
        isOpen={isAccessModalOpen}
        reason={accessDeniedReason}
        onClose={() => {
          setIsAccessModalOpen(false);
          setAccessDeniedReason(null);
        }}
      />
    </section>
  );
}
