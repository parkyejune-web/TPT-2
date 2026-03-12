'use client';

import React, { useState } from 'react';
import CustomButton from '../../Shared/ui/CustomButton';
import CustomModal from '../../Shared/ui/CustomModal';
import { useRouter } from 'next/navigation';
import { upsertWeeklyMemo } from '../../Shared/api/services/tradingService';
import { useAuthStore } from '../../Shared/store/authStore';

// 숫자 포맷팅 함수 (양수에 + 부호, 색상 적용)
const formatNumber = (value: number | string, addPercent: boolean = false): { text: string; color: string } => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return { text: String(value), color: 'text-gray-900' };

  const suffix = addPercent ? '%' : '';
  if (num > 0) {
    return { text: `+${num}${suffix}`, color: 'text-green-600' };
  } else if (num < 0) {
    return { text: `${num}${suffix}`, color: 'text-red-600' };
  } else {
    return { text: `0${suffix}`, color: 'text-gray-900' };
  }
};

// 손익비 포맷팅 함수 (1: 접두어, 색상/부호 없음)
const formatProfitLossRatio = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  return `1 : ${num}`;
};

interface DayData {
  day: string; // 요일
  dayNumber: number; // 실제 날짜 (1-31)
  trades: number | string;
  wins: number | string;
  losses: number | string;
  dailyPnL: number | string;
  new: boolean;
  dateString: string; // 서버에서 제공하는 날짜 (M/D 형식)
}

interface WeekSummary {
  winRate: string;
  profitLossRatio: string;
  weeklyPnL: string;
}

interface WeekComparison {
  before: {
    winRate: string;
    profitLossRatio: string;
    weeklyPnL: string;
  };
  current: {
    winRate: string;
    profitLossRatio: string;
    weeklyPnL: string;
  };
}

interface DirectionDetail {
  count: number;
  winRate: number;
  rnr: number;
}

interface DirectionStatistics {
  o: DirectionDetail | null; // 방향성 O
  x: DirectionDetail | null; // 방향성 X
}

// 스윙 완강 후 주별 매매일지 엔트리 타입
interface SwingWeeklyEntry {
  date: string; // 날짜 (YYYY-MM-DD)
  formattedDate: string; // "11월 25일 (화)" 형식
  title: string; // 매매일지 제목 또는 "N건의 매매일지"
  feedbackId: number; // 피드백 ID (날짜별 목록일 경우 0)
  new: boolean; // 새로운 피드백 여부
  dayNumber?: number; // 날짜 (일)
}

interface WeekFeedbackProps {
  year: string;
  month: string;
  week: string; // ex) "셋째 주"
  days: DayData[];
  summary: WeekSummary;
  comparison: WeekComparison;
  initialMemo?: string;
  directionStatistics?: DirectionStatistics | null;
  investmentType?: string;
  courseStatus?: string;
  swingWeeklyEntries?: SwingWeeklyEntry[];
  // 트레이너 평가 데이터 (DAY + 완강 후 전용)
  weeklyLossTradingAnalysis?: string | null;
  weeklyProfitableTradingAnalysis?: string | null;
  weeklyEvaluation?: string | null;
}

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

export default function WeekFeedback({
  year,
  month,
  week,
  days,
  summary,
  comparison,
  initialMemo = '',
  directionStatistics,
  investmentType = '',
  courseStatus = '',
  swingWeeklyEntries = [],
  weeklyLossTradingAnalysis,
  weeklyProfitableTradingAnalysis,
  weeklyEvaluation,
}: WeekFeedbackProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [memo, setMemo] = useState(initialMemo);
  const [isSaving, setIsSaving] = useState(false);
  const [showNoTradesModal, setShowNoTradesModal] = useState(false);
  const [showMemoSuccessModal, setShowMemoSuccessModal] = useState(false);

  // 스윙 + 완강 후 타입 여부 확인
  const isSwingAfterCompletion = investmentType === 'SWING' && courseStatus === 'AFTER_COMPLETION';

  // 메모 섹션 표시 조건: 무료 고객에게만 표시
  const shouldShowMemoSection = !user?.isPremium;

  const handleDayClick = (dayData: DayData) => {
    // 매매횟수가 0이거나 없는 경우 Modal 표시
    const tradesCount = typeof dayData.trades === 'number' ? dayData.trades : parseInt(String(dayData.trades)) || 0;
    if (tradesCount === 0) {
      setShowNoTradesModal(true);
      return;
    }
    router.push(`/my/feedback-day?year=${year}&month=${month}&week=${week}&day=${dayData.dayNumber}`);
  };

  // 수익 매매 모아보기 - 별도 페이지로 이동
  const handleShowProfitFeedbacks = () => {
    router.push(`/my/feedback-week-profit?year=${year}&month=${month}&week=${week}`);
  };

  // 손실 매매 모아보기 - 별도 페이지로 이동
  const handleShowLossFeedbacks = () => {
    router.push(`/my/feedback-week-loss?year=${year}&month=${month}&week=${week}`);
  };

  // 메모 저장/수정하기
  const handleSaveMemo = async () => {
    if (!memo.trim()) {
      alert('메모를 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const weekNumber = getWeekNumber(week);

      // 주간 매매일지 메모 Upsert 요청 데이터
      const requestData = {
        memo: memo.trim(),
      };

      console.log('[WeekFeedback] 주간 매매일지 메모 저장 요청:', {
        year: parseInt(year),
        month: parseInt(month),
        week: weekNumber,
        data: requestData,
        isCourseCompleted: user?.isCourseCompleted,
      });

      const response = await upsertWeeklyMemo(
        parseInt(year),
        parseInt(month),
        weekNumber,
        requestData
      );

      if (response.success) {
        setShowMemoSuccessModal(true);
        console.log('[WeekFeedback] 주간 매매일지 메모 저장 성공:', response.data);
      } else {
        alert(response.error || '메모 저장에 실패했습니다.');
        console.error('[WeekFeedback] 주간 매매일지 메모 저장 실패:', response.error);
      }
    } catch (error) {
      console.error('[WeekFeedback] 주간 매매일지 메모 저장 오류:', error);
      alert('메모 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 스윙 완강 후: DayFeedback 스타일의 심플한 리스트 레이아웃
  if (isSwingAfterCompletion) {
    return (
      <div className="p-6 mt-20 max-w-4xl mx-auto min-h-screen">
        {/* 상단 타이틀 */}
        <h2 className="text-gray-400 text-lg mb-2">
          {year}년 / {month}월 / {week}
        </h2>
        <h1 className="text-2xl font-bold mb-6">주별 트레이딩 피드백</h1>

        {swingWeeklyEntries.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400 text-lg">이 주에 작성된 매매일지가 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {swingWeeklyEntries.map((entry, index) => {
              // 날짜별 목록 페이지로 이동 (feedback-day)
              const handleClick = () => {
                router.push(
                  `/my/feedback-day?year=${year}&month=${month}&week=${week}&day=${entry.dayNumber}`
                );
              };

              return (
                <div key={index} className="flex items-center gap-4">
                  {/* 왼쪽 날짜 버튼 - DayFeedback의 시간 버튼 스타일 */}
                  <button
                    className="w-32 sm:w-36 px-4 py-2 bg-gray-800 text-white rounded-md text-sm cursor-pointer text-center whitespace-nowrap"
                    onClick={handleClick}
                  >
                    {entry.formattedDate}
                  </button>

                  {/* 오른쪽 제목 버튼 */}
                  <button
                    className="flex-1 flex items-center justify-between text-gray-800 border-b border-gray-300 py-2 cursor-pointer"
                    onClick={handleClick}
                  >
                    <span>{entry.title}</span>
                    {entry.new && (
                      <span className="w-2 h-2 bg-red-500 rounded-full inline-block ml-2" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 손실/수익 매매 모아보기 버튼 - 주석 처리 */}
        {/* <div className="flex flex-col w-full gap-2 sm:gap-3 mt-12 sm:mt-20">
          <CustomButton
            variant="prettyFull"
            onClick={handleShowLossFeedbacks}
          >
            손실 매매 모아보기
          </CustomButton>
          <CustomButton
            variant="prettyFull"
            onClick={handleShowProfitFeedbacks}
          >
            수익 매매 모아보기
          </CustomButton>
        </div> */}

        {/* 메모 섹션 - 무료 고객 또는 유료지만 완강 전인 고객에게만 표시 */}
        {shouldShowMemoSection && (
          <div className="mt-10 sm:mt-12">
            <h2 className="text-lg sm:text-xl mb-3 sm:mb-4">
              이번 주 나의 매매 중 가장 큰 문제점 한 가지 메모하기
            </h2>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="나의 매매를 복기하고 메모해주세요."
              className="w-full h-32 sm:h-40 p-3 sm:p-4 border border-gray-300 rounded-md resize-none text-sm sm:text-base"
            />
            <div className="flex justify-end items-center mt-3 sm:mt-4">
              <CustomButton variant="normalClean" onClick={handleSaveMemo} disabled={isSaving}>
                {isSaving ? '저장 중...' : '저장/수정하기'}
              </CustomButton>
            </div>
          </div>
        )}

        {/* 메모 저장 성공 Modal */}
        <CustomModal
          isOpen={showMemoSuccessModal}
          onClose={() => setShowMemoSuccessModal(false)}
          variant={2}
          width="w-80"
        >
          <p className="text-center text-gray-700">메모 작성이 완료되었습니다.</p>
        </CustomModal>
      </div>
    );
  }

  // 기존 레이아웃: 스윙 완강 전, 데이 타입 등
  return (
    <div className="p-4 sm:p-6 mt-20 sm:mt-25 max-w-4xl mx-auto">
      {/* 타이틀 */}
      <h2 className="text-gray-400 text-base sm:text-lg mb-1 sm:mb-2">
        {year}년 / {month}월 / {week}
      </h2>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">주간 매매일지</h1>

      {/* 테이블 */}
      <div className="border border-gray-400 rounded-lg overflow-hidden mb-10">
        <table className="w-full border-collapse text-center text-[10px] sm:text-base">
          <thead>
            <tr>
              <th className="w-[50px] sm:w-40 border border-gray-300 bg-gray-50"></th>
              {days.map((d) => {
                // 서버에서 제공하는 날짜(dateString) 사용
                return (
                  <th
                    key={d.day}
                    className="border border-gray-300 py-1 sm:py-2 px-0.5 sm:px-4"
                  >
                    <div className="flex justify-center">
                      <button
                        className="relative px-1 sm:px-3 py-0.5 sm:py-1 bg-gray-800 text-white text-[8px] sm:text-sm rounded cursor-pointer flex flex-col items-center"
                        onClick={() => handleDayClick(d)}
                      >
                        <span>{d.day}</span>
                        <span className="text-[6px] sm:text-xs text-gray-300">{d.dateString}</span>
                        {d.new && (
                          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full" />
                        )}
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                매매횟수
              </td>
              {days.map((d) => (
                <td key={d.day + '-trades'} className="border border-gray-300 py-1 sm:py-2">
                  {d.trades}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                수익횟수
              </td>
              {days.map((d) => (
                <td key={d.day + '-wins'} className="border border-gray-300 py-1 sm:py-2">
                  {d.wins}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                손실횟수
              </td>
              {days.map((d) => (
                <td key={d.day + '-losses'} className="border border-gray-300 py-1 sm:py-2">
                  {d.losses}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                일간 p&l
              </td>
              {days.map((d) => {
                const formatted = formatNumber(d.dailyPnL, true);
                return (
                  <td key={d.day + '-pnl'} className={`border border-gray-300 py-1 sm:py-2 font-semibold ${formatted.color}`}>
                    {formatted.text}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                승률
              </td>
              <td className="border border-gray-300 py-1 sm:py-2" colSpan={days.length}>
                {summary.winRate}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                평균 손익비
              </td>
              <td className="border border-gray-300 py-1 sm:py-2 font-semibold text-gray-900" colSpan={days.length}>
                {formatProfitLossRatio(summary.profitLossRatio)}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                주간 p&l
              </td>
              <td className={`border border-gray-300 py-1 sm:py-2 font-semibold ${formatNumber(summary.weeklyPnL, true).color}`} colSpan={days.length}>
                {formatNumber(summary.weeklyPnL, true).text}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 방향 분석 - 데이 + 완강 후인 경우에만 표시 */}
      {directionStatistics && (
        <div className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">방향 분석</h2>
          <div className="border border-gray-400 rounded-lg overflow-hidden">
            <table className="w-full border-collapse text-center text-[10px] sm:text-base">
              <thead>
                <tr>
                  <th className="w-[60px] sm:w-40 border border-gray-300 bg-gray-50 py-1 sm:py-2 px-1 sm:px-4"></th>
                  <th className="border border-gray-300 bg-gray-50 py-1 sm:py-2 px-1 sm:px-4">방향성 O</th>
                  <th className="border border-gray-300 bg-gray-50 py-1 sm:py-2 px-1 sm:px-4">방향성 X</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                    포지션 횟수
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2">
                    {directionStatistics.o?.count ?? '-'}
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2">
                    {directionStatistics.x?.count ?? '-'}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                    승률
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2">
                    {directionStatistics.o?.winRate != null
                      ? `${directionStatistics.o.winRate.toFixed(1)}%`
                      : '-'}
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2">
                    {directionStatistics.x?.winRate != null
                      ? `${directionStatistics.x.winRate.toFixed(1)}%`
                      : '-'}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                    평균 손익비
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2 font-semibold text-gray-900">
                    {directionStatistics.o?.rnr != null
                      ? formatProfitLossRatio(directionStatistics.o.rnr)
                      : '-'}
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2 font-semibold text-gray-900">
                    {directionStatistics.x?.rnr != null
                      ? formatProfitLossRatio(directionStatistics.x.rnr)
                      : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 비교 섹션 */}
      <div className="mt-8 sm:mt-12">
        <h2 className="text-lg sm:text-2xl font-semibold text-center mb-6 sm:mb-8">
          <span className="bg-yellow-100 px-2">
            지난 주 대비 이번 주의 매매 성적 변화량
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16">
          {/* 지난 주 */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
              지난 주
            </h3>
            <div className="border-t-2 border-yellow-900 pt-3 sm:pt-4">
              <div className="flex justify-between py-2 text-gray-700 text-sm sm:text-base">
                <span>승률</span>
                <span>{comparison.before.winRate}</span>
              </div>
              <div className="flex justify-between py-2 text-sm sm:text-base">
                <span className="text-gray-700">손익비</span>
                <span className="font-semibold text-gray-900">
                  {formatProfitLossRatio(comparison.before.profitLossRatio)}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm sm:text-base">
                <span className="text-gray-700">p&l</span>
                <span className={`font-semibold ${formatNumber(comparison.before.weeklyPnL, true).color}`}>
                  {formatNumber(comparison.before.weeklyPnL, true).text}
                </span>
              </div>
            </div>
          </div>

          {/* 이번 주 */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
              이번 주
            </h3>
            <div className="border-t-2 border-yellow-900 pt-3 sm:pt-4">
              <div className="flex justify-between py-2 text-gray-900 font-semibold text-sm sm:text-base">
                <span>승률</span>
                <span>{comparison.current.winRate}</span>
              </div>
              <div className="flex justify-between py-2 font-semibold text-sm sm:text-base">
                <span className="text-gray-900">손익비</span>
                <span className="text-gray-900">
                  {formatProfitLossRatio(comparison.current.profitLossRatio)}
                </span>
              </div>
              <div className="flex justify-between py-2 font-semibold text-sm sm:text-base">
                <span className="text-gray-900">p&l</span>
                <span className={formatNumber(comparison.current.weeklyPnL, true).color}>
                  {formatNumber(comparison.current.weeklyPnL, true).text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 섹션 */}
      <div className="flex flex-col w-full gap-2 sm:gap-3 mt-12 sm:mt-20">
        <button
          onClick={handleShowLossFeedbacks}
          className="w-full py-3 bg-white border-1 border-red-500 text-red-500 rounded-2xl font-semibold cursor-pointer hover:bg-red-50 transition-colors"
        >
          손실 매매 모아보기
        </button>
        <button
          onClick={handleShowProfitFeedbacks}
          className="w-full py-3 bg-white border-1 border-green-500 text-green-500 rounded-2xl font-semibold cursor-pointer hover:bg-green-50 transition-colors"
        >
          수익 매매 모아보기
        </button>
      </div>

      {/* 트레이너 평가 섹션 - 유료 고객이면 데이터가 있을 때 표시 (완강 여부 무관) */}
      {(weeklyLossTradingAnalysis || weeklyProfitableTradingAnalysis || weeklyEvaluation) && (
        <div className="mt-10 sm:mt-12 flex flex-col gap-6">
          {/* 회원님의 손실난 매매 분석 */}
          {weeklyLossTradingAnalysis && (
            <div className="border border-gray-300 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
                회원님의 손실난 매매 분석
              </h3>
              <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">
                {weeklyLossTradingAnalysis}
              </p>
            </div>
          )}

          {/* 회원님의 수익난 매매 분석 */}
          {weeklyProfitableTradingAnalysis && (
            <div className="border border-gray-300 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
                회원님의 수익난 매매 분석
              </h3>
              <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">
                {weeklyProfitableTradingAnalysis}
              </p>
            </div>
          )}

          {/* 회원님의 주간 매매 최종 평가 및 개선점 */}
          {weeklyEvaluation && (
            <div className="border border-gray-300 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
                회원님의 주간 매매 최종 평가 및 개선점
              </h3>
              <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">
                {weeklyEvaluation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 메모 섹션 - 무료 고객 또는 유료지만 완강 전인 고객에게만 표시 */}
      {shouldShowMemoSection && (
        <div className="mt-10 sm:mt-12">
          <h2 className="text-lg sm:text-xl mb-3 sm:mb-4">
            이번 주 나의 매매 중 가장 큰 문제점 한 가지 메모하기
          </h2>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="나의 매매를 복기하고 메모해주세요."
            className="w-full h-32 sm:h-40 p-3 sm:p-4 border border-gray-300 rounded-md resize-none text-sm sm:text-base"
          />
          <div className="flex justify-end items-center mt-3 sm:mt-4">
            <CustomButton variant="normalClean" onClick={handleSaveMemo} disabled={isSaving}>
              {isSaving ? '저장 중...' : '저장/수정하기'}
            </CustomButton>
          </div>
        </div>
      )}

      {/* 매매 내역 없음 Modal */}
      <CustomModal
        isOpen={showNoTradesModal}
        onClose={() => setShowNoTradesModal(false)}
        variant={2}
        width="w-80"
      >
        <p className="text-center text-gray-700">매매 내역이 없는 요일입니다.</p>
      </CustomModal>

      {/* 메모 저장 성공 Modal */}
      <CustomModal
        isOpen={showMemoSuccessModal}
        onClose={() => setShowMemoSuccessModal(false)}
        variant={2}
        width="w-80"
      >
        <p className="text-center text-gray-700">메모 작성이 완료되었습니다.</p>
      </CustomModal>
    </div>
  );
}
