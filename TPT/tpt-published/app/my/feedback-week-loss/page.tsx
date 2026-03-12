'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getWeeklyLossFeedbacks } from '../../../Shared/api/services/feedbackService';
import type { WeeklyFeedbackListItem } from '../../../Shared/api/apiTypes';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 주간 손실 매매 모아보기 페이지 - Apple/Toss 수준 프리미엄 디자인
 */
export default function FeedbackWeekLossPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const year = searchParams.get('year') || '2025';
  const month = searchParams.get('month') || '1';
  const week = searchParams.get('week') || '첫째 주';

  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<WeeklyFeedbackListItem[]>([]);
  const [totalAssetPnlSum, setTotalAssetPnlSum] = useState<number>(0);

  // 주차 문자열을 숫자로 변환
  const getWeekNumber = (weekStr: string): number => {
    const weekMap: { [key: string]: number } = {
      '첫째 주': 1,
      '둘째 주': 2,
      '셋째 주': 3,
      '넷째 주': 4,
      '다섯째 주': 5,
    };
    return weekMap[weekStr] || 1;
  };

  useEffect(() => {
    const fetchLossFeedbacks = async () => {
      setLoading(true);
      try {
        const weekNumber = getWeekNumber(week);
        const response = await getWeeklyLossFeedbacks(
          parseInt(year),
          parseInt(month),
          weekNumber
        );

        if (response.success && response.data) {
          setFeedbacks(response.data.lossFeedbacks);
          setTotalAssetPnlSum(response.data.totalAssetPnlSum ?? 0);
        } else {
          console.error('[FeedbackWeekLoss] 손실 매매 조회 실패:', response.error);
        }
      } catch (error) {
        console.error('[FeedbackWeekLoss] 손실 매매 조회 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLossFeedbacks();
  }, [year, month, week]);

  const formatPnL = (pnl: number | undefined | null): string => {
    if (pnl == null) return '0.00%';
    return `${pnl.toFixed(2)}%`;
  };

  const getInvestmentTypeLabel = (type: string): string => {
    switch (type) {
      case 'SWING':
        return '스윙';
      case 'DAY':
        return '데이';
      case 'SCALPING':
        return '스켈핑';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'FR':
        return '읽음';
      case 'FN':
        return '미확인';
      case 'N':
        return '대기';
      default:
        return status;
    }
  };

  const handleFeedbackClick = (feedbackId: number) => {
    router.push(`/my/feedback-detail?id=${feedbackId}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">로딩 중</p>
        </div>
      </div>
    );
  }

  const responseCount = feedbacks.filter((f) => f.hasResponse).length;

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-gray-900 hover:text-gray-600 transition-colors -ml-2 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
              <span className="text-sm sm:text-base font-medium">뒤로</span>
            </button>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              {year}년 {month}월 {week}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20">
        {/* 타이틀 */}
        <div className="mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            손실 매매
          </h1>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
            복기를 통해 실수를 방지하고 개선하세요
          </p>
        </div>

        {/* 통계 - 미니멀 카드 */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-12 sm:mb-16">
          <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all hover:bg-gray-100">
            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">총 매매</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              {feedbacks.length}
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all hover:bg-gray-100">
            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">답변 완료</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              {responseCount}
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all hover:bg-gray-100">
            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">총 P&L</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 tracking-tight">
              {formatPnL(totalAssetPnlSum)}
            </p>
          </div>
        </div>

        {/* 매매 목록 */}
        {feedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              매매 기록 없음
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              이 주차에는 손실 매매가 없습니다
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {feedbacks.map((feedback) => {
              const statusText = getStatusLabel(feedback.status);
              return (
                <button
                  key={feedback.feedbackId}
                  onClick={() => handleFeedbackClick(feedback.feedbackId)}
                  className="w-full text-left bg-white border border-gray-200 hover:border-gray-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-200 hover:shadow-sm active:scale-[0.99] group"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug flex-1 min-w-0">
                      {feedback.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xl sm:text-2xl font-bold text-red-600 tabular-nums">
                        {formatPnL(feedback.totalAssetPnl)}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                    <span className="tabular-nums">{feedback.feedbackRequestDate}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{getInvestmentTypeLabel(feedback.investmentType)}</span>
                    {feedback.hasResponse && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{statusText}</span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
