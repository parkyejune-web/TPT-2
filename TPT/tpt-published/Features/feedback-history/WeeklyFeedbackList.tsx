"use client";

import { TrendingUp, TrendingDown, Calendar, DollarSign, ArrowLeft, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import type { WeeklyFeedbackListItem, InvestmentType, FeedbackStatus } from "../../Shared/api/apiTypes";

interface WeeklyFeedbackListProps {
  type: "profit" | "loss";
  year: number;
  month: number;
  week: number;
  feedbacks: WeeklyFeedbackListItem[];
}

/**
 * 주간 이익/손실 매매 모아보기 컴포넌트
 * 고급스러운 디자인으로 매매 목록 표시
 */
export default function WeeklyFeedbackList({
  type,
  year,
  month,
  week,
  feedbacks
}: WeeklyFeedbackListProps) {
  const router = useRouter();
  const isProfit = type === "profit";

  const formatPnL = (pnl: number): string => {
    if (pnl > 0) return `+${pnl.toFixed(2)}`;
    return pnl.toFixed(2);
  };

  const getInvestmentTypeLabel = (type: InvestmentType): string => {
    switch (type) {
      case "SWING": return "스윙";
      case "DAY": return "데이";
      case "SCALPING": return "스켈핑";
      default: return type;
    }
  };

  const getStatusLabel = (status: FeedbackStatus): { text: string; color: string } => {
    switch (status) {
      case "FR": return { text: "답변 읽음", color: "bg-gray-100 text-gray-600" };
      case "FN": return { text: "답변 미확인", color: "bg-blue-100 text-blue-600" };
      case "N": return { text: "답변 대기", color: "bg-yellow-100 text-yellow-600" };
      default: return { text: status, color: "bg-gray-100 text-gray-600" };
    }
  };

  const handleFeedbackClick = (feedbackId: number) => {
    router.push(`/my/feedback-detail/${feedbackId}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>돌아가기</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isProfit
                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                : "bg-gradient-to-br from-red-500 to-rose-600"
            } shadow-lg`}>
              {isProfit ? (
                <TrendingUp className="w-7 h-7 text-white" strokeWidth={2.5} />
              ) : (
                <TrendingDown className="w-7 h-7 text-white" strokeWidth={2.5} />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {year}년 {month}월 {week}주차
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {isProfit ? "수익 매매" : "손실 매매"} 모아보기
              </h1>
            </div>
          </div>

          <p className="text-gray-600">
            {isProfit
              ? "수익을 낸 매매를 분석하여 성공 패턴을 발견하세요."
              : "손실을 본 매매를 복기하여 실수를 방지하세요."}
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">총 매매 수</p>
            <p className="text-2xl font-bold text-gray-900">{feedbacks.length}건</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">답변 완료</p>
            <p className="text-2xl font-bold text-gray-900">
              {feedbacks.filter(f => f.hasResponse).length}건
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">총 P&L</p>
            <p className={`text-2xl font-bold ${
              isProfit ? "text-green-600" : "text-red-600"
            }`}>
              {formatPnL(feedbacks.reduce((sum, f) => sum + f.totalAssetPnl, 0))}
            </p>
          </div>
        </div>

        {/* 매매 목록 */}
        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isProfit ? "bg-green-100" : "bg-red-100"
            }`}>
              {isProfit ? (
                <TrendingUp className={`w-8 h-8 ${isProfit ? "text-green-600" : "text-red-600"}`} />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isProfit ? "수익 매매가" : "손실 매매가"} 없습니다
            </h3>
            <p className="text-gray-500">
              이 주차에는 {isProfit ? "수익을 낸" : "손실을 본"} 매매가 기록되지 않았습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((feedback, index) => {
              const statusInfo = getStatusLabel(feedback.status);
              return (
                <div
                  key={feedback.feedbackId}
                  onClick={() => handleFeedbackClick(feedback.feedbackId)}
                  className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* 좌측: 정보 */}
                    <div className="flex-1 min-w-0">
                      {/* 상단: 번호 + 제목 */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-sm ${
                          isProfit
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                            {feedback.title}
                          </h3>
                        </div>
                      </div>

                      {/* 중간: 메타 정보 */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 ml-11">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{feedback.feedbackRequestDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            {getInvestmentTypeLabel(feedback.investmentType)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 우측: P&L + 화살표 */}
                    <div className="flex items-center gap-4 md:gap-6 ml-11 md:ml-0">
                      <div className="flex items-center gap-2">
                        <DollarSign className={`w-5 h-5 ${
                          isProfit ? "text-green-600" : "text-red-600"
                        }`} />
                        <span className={`text-xl md:text-2xl font-bold ${
                          isProfit ? "text-green-600" : "text-red-600"
                        }`}>
                          {formatPnL(feedback.totalAssetPnl)}
                        </span>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
