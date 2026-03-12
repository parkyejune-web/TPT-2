'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomModal from '../../Shared/ui/CustomModal';

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

interface WeekData {
  week: string;
  weekNumber: number;
  trades: number | string;
  weeklyPnL: number | string;
  new: boolean;
  startDate: string; // 서버에서 제공하는 주차 시작일 (YYYY-MM-DD)
  endDate: string;   // 서버에서 제공하는 주차 종료일 (YYYY-MM-DD)
}

/**
 * YYYY-MM-DD 형식의 날짜를 M/D 형식으로 변환
 */
const formatDateToShort = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

interface MonthSummary {
  winRate: string;
  avgProfit: string;
  finalPnL: string;
}

interface PositionDetail {
  count: number;
  winRate: number;
  rnr: number;
}

interface EntryPointStatistics {
  reverse: PositionDetail | null;  // 역추세
  pullBack: PositionDetail | null; // 눌림목
  breakOut: PositionDetail | null; // 돌파
}

interface MonthFeedbackProps {
  year: string;
  month: string;
  beforeMonth: string;
  nowMonth: string;
  weeks: WeekData[];
  summary: MonthSummary;
  beforeSummary?: MonthSummary;
  entryPointStatistics?: EntryPointStatistics | null;
  // 완강 후 여부 및 트레이너 평가 데이터
  isAfterCompletion?: boolean;
  monthlyEvaluation?: string | null;
  nextMonthGoal?: string | null;
}

export default function MonthFeedback({
  year,
  month,
  beforeMonth,
  nowMonth,
  weeks,
  summary,
  beforeSummary,
  entryPointStatistics,
  isAfterCompletion = false,
  monthlyEvaluation,
  nextMonthGoal,
}: MonthFeedbackProps) {
  const router = useRouter();
  const [showNoTradesModal, setShowNoTradesModal] = useState(false);

  // 주차 버튼 클릭 핸들러
  const handleWeekClick = (weekData: WeekData) => {
    // 매매횟수가 0이거나 없는 경우 Modal 표시
    const tradesCount = typeof weekData.trades === 'number' ? weekData.trades : parseInt(String(weekData.trades)) || 0;
    if (tradesCount === 0) {
      setShowNoTradesModal(true);
      return;
    }
    router.push(`/my/feedback-week?year=${year}&month=${month}&week=${weekData.week}`);
  };

  return (
    <div className="p-4 sm:p-6 mt-20 sm:mt-25 max-w-4xl mx-auto">
      {/* 타이틀 */}
      <h2 className="text-gray-400 text-base sm:text-lg mb-1 sm:mb-2">
        {year}년 {month}월
      </h2>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">월간 매매일지</h1>

      {/* 테이블 */}
      <div className="border border-gray-400 rounded-lg overflow-hidden mb-10">
        <table className="w-full border-collapse text-center text-[10px] sm:text-base">
          <thead>
            <tr>
              <th className="w-[60px] sm:w-40 border border-gray-300 bg-gray-50"></th>
              {weeks.map((w) => {
                // 서버에서 제공하는 startDate, endDate 사용
                const startDateFormatted = formatDateToShort(w.startDate);
                const endDateFormatted = formatDateToShort(w.endDate);
                return (
                  <th
                    key={w.week}
                    className="border border-gray-300 py-1 sm:py-2 px-0.5 sm:px-4"
                  >
                    <div className="flex justify-center">
                    <button
                      className="relative px-1 sm:px-4 py-0.5 sm:py-1 bg-gray-800 text-white text-[8px] sm:text-sm rounded cursor-pointer flex flex-col items-center"
                      onClick={() => handleWeekClick(w)}
                    >
                      <span>{w.week}</span>
                      <span className="text-[6px] sm:text-xs text-gray-300">{startDateFormatted}~{endDateFormatted}</span>
                      {w.new && (
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
              {weeks.map((w) => (
                <td key={w.week + '-trades'} className="border border-gray-300 py-1 sm:py-2">
                  {w.trades}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                주간 p&l
              </td>
              {weeks.map((w) => {
                const formatted = formatNumber(w.weeklyPnL, true);
                return (
                  <td key={w.week + '-pnl'} className={`border border-gray-300 py-1 sm:py-2 font-semibold ${formatted.color}`}>
                    {formatted.text}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                월간 최종 승률
              </td>
              <td className="border border-gray-300 py-1 sm:py-2" colSpan={weeks.length}>
                {summary.winRate}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                월간 평균 손익비
              </td>
              <td className="border border-gray-300 py-1 sm:py-2 font-semibold text-gray-900" colSpan={weeks.length}>
                {formatProfitLossRatio(summary.avgProfit)}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                월간 최종 p&l
              </td>
              <td className={`border border-gray-300 py-1 sm:py-2 font-semibold ${formatNumber(summary.finalPnL, true).color}`} colSpan={weeks.length}>
                {formatNumber(summary.finalPnL, true).text}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 타점별 성적표 - 스윙 + 완강 후인 경우에만 표시 */}
      {entryPointStatistics && (
        <div className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">타점별 성적표</h2>
          <div className="border border-gray-400 rounded-lg overflow-hidden">
            <table className="w-full border-collapse text-center text-[10px] sm:text-base">
              <thead>
                <tr>
                  <th className="w-[60px] sm:w-40 border border-gray-300 bg-gray-50 py-1 sm:py-2 px-1 sm:px-4"></th>
                  <th className="border border-gray-300 bg-gray-50 py-1 sm:py-2 px-1 sm:px-4">역추세</th>
                  <th className="border border-gray-300 bg-gray-50 py-1 sm:py-2 px-1 sm:px-4">눌림목</th>
                  <th className="border border-gray-300 bg-gray-50 py-1 sm:py-2 px-1 sm:px-4">돌파</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                    포지션 횟수
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2">
                    {entryPointStatistics.reverse?.count ?? '-'}
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2">
                    {entryPointStatistics.pullBack?.count ?? '-'}
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2">
                    {entryPointStatistics.breakOut?.count ?? '-'}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                    승률
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2">
                    {entryPointStatistics.reverse?.winRate != null
                      ? `${entryPointStatistics.reverse.winRate.toFixed(1)}%`
                      : '-'}
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2">
                    {entryPointStatistics.pullBack?.winRate != null
                      ? `${entryPointStatistics.pullBack.winRate.toFixed(1)}%`
                      : '-'}
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2">
                    {entryPointStatistics.breakOut?.winRate != null
                      ? `${entryPointStatistics.breakOut.winRate.toFixed(1)}%`
                      : '-'}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 py-1 sm:py-2 px-1 sm:px-4 text-left text-[9px] sm:text-base">
                    평균 손익비
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2 font-semibold text-gray-900">
                    {entryPointStatistics.reverse?.rnr != null
                      ? formatProfitLossRatio(entryPointStatistics.reverse.rnr)
                      : '-'}
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2 font-semibold text-gray-900">
                    {entryPointStatistics.pullBack?.rnr != null
                      ? formatProfitLossRatio(entryPointStatistics.pullBack.rnr)
                      : '-'}
                  </td>
                  <td className="border border-gray-300 py-1 sm:py-2 font-semibold text-gray-900">
                    {entryPointStatistics.breakOut?.rnr != null
                      ? formatProfitLossRatio(entryPointStatistics.breakOut.rnr)
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
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 sm:mb-8">
          <span className="bg-yellow-100 px-2">
            {beforeMonth} 대비 {nowMonth}의 매매 성적 변화량
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16">
          {/* Before Month */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
              {beforeMonth}
            </h3>
            <div className="border-t-2 border-yellow-900 pt-3 sm:pt-4">
              <div className="flex justify-between py-2 text-gray-700 text-sm sm:text-base">
                <span>월간 최종 승률</span>
                <span>{beforeSummary?.winRate || summary.winRate}</span>
              </div>
              <div className="flex justify-between py-2 text-sm sm:text-base">
                <span className="text-gray-700">월간 평균 손익비</span>
                <span className="font-semibold text-gray-900">
                  {formatProfitLossRatio(beforeSummary?.avgProfit || summary.avgProfit)}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm sm:text-base">
                <span className="text-gray-700">월간 최종 p&l</span>
                <span className={`font-semibold ${formatNumber(beforeSummary?.finalPnL || summary.finalPnL, true).color}`}>
                  {formatNumber(beforeSummary?.finalPnL || summary.finalPnL, true).text}
                </span>
              </div>
            </div>
          </div>

          {/* Now Month */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
              {nowMonth}
            </h3>
            <div className="border-t-2 border-yellow-900 pt-3 sm:pt-4">
              <div className="flex justify-between py-2 text-gray-900 font-semibold text-sm sm:text-base">
                <span>월간 최종 승률</span>
                <span>{summary.winRate}</span>
              </div>
              <div className="flex justify-between py-2 font-semibold text-sm sm:text-base">
                <span className="text-gray-900">월간 평균 손익비</span>
                <span className="text-gray-900">
                  {formatProfitLossRatio(summary.avgProfit)}
                </span>
              </div>
              <div className="flex justify-between py-2 font-semibold text-sm sm:text-base">
                <span className="text-gray-900">월간 최종 p&l</span>
                <span className={formatNumber(summary.finalPnL, true).color}>
                  {formatNumber(summary.finalPnL, true).text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 트레이너 평가 섹션 - 유료 고객이면 데이터가 있을 때 표시 (완강 여부 무관) */}
      {(monthlyEvaluation || nextMonthGoal) && (
        <div className="mt-10 sm:mt-12 flex flex-col gap-6">
          {/* 트레이너의 한 달 간 회원님 매매 최종 평가 */}
          {monthlyEvaluation && (
            <div className="border border-gray-300 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
                트레이너의 한 달 간 회원님 매매 최종 평가
              </h3>
              <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">
                {monthlyEvaluation}
              </p>
            </div>
          )}

          {/* 다음 달 회원님의 목표 성과 */}
          {nextMonthGoal && (
            <div className="border border-gray-300 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
                다음 달 회원님의 목표 성과
              </h3>
              <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">
                {nextMonthGoal}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 매매 내역 없음 Modal */}
      <CustomModal
        isOpen={showNoTradesModal}
        onClose={() => setShowNoTradesModal(false)}
        variant={2}
        width="w-80"
      >
        <p className="text-center text-gray-700">매매 내역이 없는 주차입니다.</p>
      </CustomModal>
    </div>
  );
}
