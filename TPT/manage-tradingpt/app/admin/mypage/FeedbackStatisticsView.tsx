'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getMonthlyWeekFeedbacks,
  getWeeklyDayFeedbacks,
  getDailyFeedbackList,
  getAdminMonthlySummary,
  getAdminWeeklySummary,
  type DailyFeedbackListItem,
  type MonthlySummaryResponseDTO,
  type WeeklySummaryResponseDTO,
  type MonthlyWeekFeedbackSummaryResponseDTO,
  type WeeklyWeekFeedbackSummaryResponseDTO,
  type EntryPointStatisticsResponseDTO,
  type DirectionStatisticsResponseDTO,
  type PerformanceComparisonMonthSnapshot,
  type PerformanceComparisonWeekSnapshot,
} from '../../api/statistics';
import { getInvestmentTypeLabel, getCourseStatusLabel } from '../../api/feedback';

interface FeedbackStatisticsViewProps {
  customerId: number;
  type: 'monthly' | 'weekly';
  year: number;
  month: number;
  week?: number; // 주간 피드백의 경우에만 사용
}

// 숫자 포맷팅 함수 (양수에 + 부호, 색상 적용) - tpt-published와 동일
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

// YYYY-MM-DD 형식의 날짜를 M/D 형식으로 변환
const formatDateToShort = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 피드백 상태 라벨
const getFeedbackStatusLabel = (status: string) => {
  switch (status) {
    case 'FR':
      return { text: '읽음', className: 'bg-green-100 text-green-800' };
    case 'FN':
      return { text: '미읽음', className: 'bg-yellow-100 text-yellow-800' };
    case 'N':
      return { text: '미응답', className: 'bg-gray-100 text-gray-600' };
    default:
      return { text: status, className: 'bg-gray-100 text-gray-600' };
  }
};

// 요일 변환 함수
const getDayOfWeekLabel = (year: number, month: number, day: number): string => {
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[dayOfWeek];
};

export default function FeedbackStatisticsView({
  customerId,
  type,
  year,
  month,
  week,
}: FeedbackStatisticsViewProps) {
  const router = useRouter();

  // 월간/주간 통계 데이터
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummaryResponseDTO | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummaryResponseDTO | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // 월간 피드백: 주차 목록
  const [weeks, setWeeks] = useState<number[]>([]);
  const [loadingWeeks, setLoadingWeeks] = useState(false);

  // 주간 피드백 / 주차 클릭 시: 일별 목록
  const [days, setDays] = useState<number[]>([]);
  const [loadingDays, setLoadingDays] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  // 일별 피드백 목록
  const [dailyFeedbacks, setDailyFeedbacks] = useState<DailyFeedbackListItem[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // 월간 통계 로드
  const loadMonthlySummary = useCallback(async () => {
    setLoadingSummary(true);
    setMonthlySummary(null);

    try {
      const response = await getAdminMonthlySummary(customerId, year, month);
      if (response.success && response.data) {
        setMonthlySummary(response.data);
      }
    } catch (error) {
      console.error('월간 통계 로드 오류:', error);
    } finally {
      setLoadingSummary(false);
    }
  }, [customerId, year, month]);

  // 주간 통계 로드
  const loadWeeklySummary = useCallback(async (weekNum: number) => {
    setLoadingSummary(true);
    setWeeklySummary(null);

    try {
      const response = await getAdminWeeklySummary(customerId, year, month, weekNum);
      if (response.success && response.data) {
        setWeeklySummary(response.data);
      }
    } catch (error) {
      console.error('주간 통계 로드 오류:', error);
    } finally {
      setLoadingSummary(false);
    }
  }, [customerId, year, month]);

  // 월간 피드백: 주차 목록 로드
  const loadMonthlyWeeks = useCallback(async () => {
    setLoadingWeeks(true);
    setWeeks([]);
    setDays([]);
    setDailyFeedbacks([]);
    setSelectedWeek(null);
    setSelectedDay(null);

    try {
      const response = await getMonthlyWeekFeedbacks(customerId, year, month);
      if (response.success && response.data) {
        setWeeks(response.data.weeks || []);
      }
    } catch (error) {
      console.error('주차 목록 로드 오류:', error);
    } finally {
      setLoadingWeeks(false);
    }
  }, [customerId, year, month]);

  // 주간 피드백: 일별 목록 로드 (주차 클릭 시)
  const loadWeeklyDays = useCallback(
    async (weekNum: number) => {
      setLoadingDays(true);
      setDays([]);
      setDailyFeedbacks([]);
      setSelectedWeek(weekNum);
      setSelectedDay(null);

      try {
        const response = await getWeeklyDayFeedbacks(customerId, year, month, weekNum);
        if (response.success && response.data) {
          setDays(response.data.days || []);
        }
      } catch (error) {
        console.error('일별 목록 로드 오류:', error);
      } finally {
        setLoadingDays(false);
      }
    },
    [customerId, year, month]
  );

  // 일별 피드백 목록 로드 (일자 클릭 시)
  const loadDailyFeedbacks = useCallback(
    async (weekNum: number, dayNum: number) => {
      setLoadingFeedbacks(true);
      setSelectedDay(dayNum);
      setDailyFeedbacks([]);

      try {
        const response = await getDailyFeedbackList(customerId, year, month, weekNum, dayNum);
        if (response.success && response.data) {
          setDailyFeedbacks(response.data.feedbacks || []);
        }
      } catch (error) {
        console.error('피드백 목록 로드 오류:', error);
      } finally {
        setLoadingFeedbacks(false);
      }
    },
    [customerId, year, month]
  );

  // 피드백 클릭 시 상세 페이지로 이동
  const handleFeedbackClick = (feedbackId: number) => {
    router.push(`/admin/feedback/${feedbackId}`);
  };

  // 주차 버튼 클릭 핸들러 (표 헤더에서 클릭)
  const handleWeekClick = (weekNum: number) => {
    loadWeeklyDays(weekNum);
  };

  // 요일 버튼 클릭 핸들러 (표 헤더에서 클릭)
  const handleDayClick = (dayDate: string) => {
    if (!selectedWeek) return;
    const dateObj = new Date(dayDate);
    const dayNum = dateObj.getDate();
    loadDailyFeedbacks(selectedWeek, dayNum);
  };

  // 타입과 기간이 변경되면 데이터 다시 로드
  useEffect(() => {
    if (type === 'monthly') {
      // 월간 피드백: 통계 로드 + 주차 목록 로드
      loadMonthlySummary();
      loadMonthlyWeeks();
    } else if (type === 'weekly' && week) {
      // 주간 피드백: 통계 로드 + 해당 주의 일별 목록 바로 로드
      loadWeeklySummary(week);
      setSelectedWeek(week);
      loadWeeklyDays(week);
    }
  }, [type, year, month, week, loadMonthlySummary, loadMonthlyWeeks, loadWeeklySummary, loadWeeklyDays]);

  // 월간 통계에서 주차별 요약 데이터 추출
  const getMonthlyWeekSummaries = (): MonthlyWeekFeedbackSummaryResponseDTO[] => {
    if (!monthlySummary) return [];

    if ('monthlyFeedbackSummaryResponseDTO' in monthlySummary && monthlySummary.monthlyFeedbackSummaryResponseDTO) {
      return monthlySummary.monthlyFeedbackSummaryResponseDTO.monthlyWeekFeedbackSummaryResponseDTOS || [];
    }
    return [];
  };

  // 주간 통계에서 일별 요약 데이터 추출
  const getWeeklyDaySummaries = (): WeeklyWeekFeedbackSummaryResponseDTO[] => {
    if (!weeklySummary) return [];

    if ('weeklyFeedbackSummaryResponseDTO' in weeklySummary && weeklySummary.weeklyFeedbackSummaryResponseDTO) {
      return weeklySummary.weeklyFeedbackSummaryResponseDTO.weeklyWeekFeedbackSummaryResponseDTOS || [];
    }
    return [];
  };

  // 월간 통계 요약 (승률, R&R, P&L)
  const getMonthlySummaryStats = () => {
    if (!monthlySummary) return null;

    if ('monthlyFeedbackSummaryResponseDTO' in monthlySummary && monthlySummary.monthlyFeedbackSummaryResponseDTO) {
      const summary = monthlySummary.monthlyFeedbackSummaryResponseDTO;
      return {
        winningRate: summary.winningRate,
        averageRnr: summary.monthlyAverageRnr,
        pnl: summary.monthlyPnl,
      };
    }
    return null;
  };

  // 주간 통계 요약 (승률, R&R, P&L)
  const getWeeklySummaryStats = () => {
    if (!weeklySummary) return null;

    if ('weeklyFeedbackSummaryResponseDTO' in weeklySummary && weeklySummary.weeklyFeedbackSummaryResponseDTO) {
      const summary = weeklySummary.weeklyFeedbackSummaryResponseDTO;
      return {
        winningRate: summary.winningRate,
        averageRnr: summary.weeklyAverageRnr,
        pnl: summary.weeklyPnl,
      };
    }
    return null;
  };

  // 월간 성과 비교 데이터 추출
  const getMonthlyPerformanceComparison = (): PerformanceComparisonMonthSnapshot | null => {
    if (!monthlySummary) return null;
    if ('performanceComparison' in monthlySummary) {
      return monthlySummary.performanceComparison || null;
    }
    return null;
  };

  // 주간 성과 비교 데이터 추출
  const getWeeklyPerformanceComparison = (): PerformanceComparisonWeekSnapshot | null => {
    if (!weeklySummary) return null;
    if ('performanceComparison' in weeklySummary) {
      return weeklySummary.performanceComparison || null;
    }
    return null;
  };

  // 타점별 통계 데이터 추출 (월간, 완강 후)
  const getEntryPointStatistics = (): EntryPointStatisticsResponseDTO | null => {
    if (!monthlySummary) return null;
    if ('entryPointStatisticsResponseDTO' in monthlySummary) {
      return monthlySummary.entryPointStatisticsResponseDTO || null;
    }
    return null;
  };

  // 방향성 통계 데이터 추출 (주간, DAY + 완강 후)
  const getDirectionStatistics = (): DirectionStatisticsResponseDTO | null => {
    if (!weeklySummary) return null;
    if ('directionStatisticsResponseDTO' in weeklySummary) {
      return weeklySummary.directionStatisticsResponseDTO || null;
    }
    return null;
  };

  // 완강 후 여부 확인
  const isAfterCompletion = (summary: MonthlySummaryResponseDTO | WeeklySummaryResponseDTO | null): boolean => {
    if (!summary) return false;
    return 'courseStatus' in summary && summary.courseStatus === 'AFTER_COMPLETION';
  };

  // 투자 유형 확인
  const getInvestmentType = (summary: MonthlySummaryResponseDTO | WeeklySummaryResponseDTO | null): string => {
    if (!summary) return '';
    return 'investmentType' in summary ? summary.investmentType : '';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mt-4">
      <h4 className="font-semibold text-gray-900 mb-3">
        {type === 'monthly' ? '월간 매매 통계' : '주간 매매 통계'}
      </h4>

      {/* 월간 피드백 통계 - tpt-published MonthFeedback 스타일 */}
      {type === 'monthly' && (
        <div className="space-y-4">
          {loadingSummary ? (
            <div className="text-center py-4 text-gray-500">통계 데이터 로딩 중...</div>
          ) : monthlySummary ? (
            <>
              {/* 타이틀 */}
              <div className="mb-4">
                <h2 className="text-gray-400 text-sm sm:text-base mb-1">
                  {year}년 {month}월
                </h2>
                <h1 className="text-lg sm:text-xl font-bold">월간 매매일지</h1>
              </div>

              {/* 월간 통계 테이블 */}
              {getMonthlyWeekSummaries().length > 0 && (
                <div className="overflow-x-auto">
                  <div className="min-w-[500px]">
                    <div className="border border-gray-400 rounded-lg overflow-hidden mb-6">
                      <table className="w-full border-collapse text-center text-[10px] sm:text-xs md:text-sm">
                        <thead>
                          <tr>
                            <th className="w-[70px] sm:w-[90px] md:w-32 border border-gray-300 bg-gray-50 py-2"></th>
                            {getMonthlyWeekSummaries().map((weekData) => {
                              const startDateFormatted = formatDateToShort(weekData.startDate);
                              const endDateFormatted = formatDateToShort(weekData.endDate);
                              const isSelected = selectedWeek === weekData.week;
                              return (
                                <th
                                  key={weekData.week}
                                  className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4"
                                >
                                  <div className="flex justify-center">
                                    <button
                                      onClick={() => handleWeekClick(weekData.week)}
                                      className={`px-1.5 sm:px-3 md:px-4 py-1 text-[9px] sm:text-xs md:text-sm rounded flex flex-col items-center cursor-pointer transition-all ${
                                        isSelected
                                          ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                                          : 'bg-gray-800 text-white hover:bg-gray-700 hover:shadow-md'
                                      }`}
                                    >
                                      <span className="font-medium">{weekData.week}주차</span>
                                      <span className={`text-[8px] sm:text-[10px] md:text-xs ${isSelected ? 'text-blue-100' : 'text-gray-300'}`}>
                                        {startDateFormatted}~{endDateFormatted}
                                      </span>
                                    </button>
                                  </div>
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                              매매횟수
                            </td>
                            {getMonthlyWeekSummaries().map((weekData) => (
                              <td key={`${weekData.week}-trades`} className="border border-gray-300 py-2">
                                {weekData.tradingCount}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                              주간 P&L
                            </td>
                            {getMonthlyWeekSummaries().map((weekData) => {
                              const formatted = formatNumber(weekData.weeklyPnl ?? 0, true);
                              return (
                                <td key={`${weekData.week}-pnl`} className={`border border-gray-300 py-2 font-semibold ${formatted.color}`}>
                                  {formatted.text}
                                </td>
                              );
                            })}
                          </tr>
                          <tr>
                            <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                              월간 최종 승률
                            </td>
                            <td className="border border-gray-300 py-2" colSpan={getMonthlyWeekSummaries().length}>
                              {getMonthlySummaryStats()?.winningRate?.toFixed(1) || '-'}%
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                              월간 평균 손익비
                            </td>
                            <td className={`border border-gray-300 py-2 font-semibold ${formatNumber(getMonthlySummaryStats()?.averageRnr ?? 0).color}`} colSpan={getMonthlyWeekSummaries().length}>
                              {formatNumber(getMonthlySummaryStats()?.averageRnr ?? 0).text}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                              월간 최종 P&L
                            </td>
                            <td className={`border border-gray-300 py-2 font-semibold ${formatNumber(getMonthlySummaryStats()?.pnl ?? 0, true).color}`} colSpan={getMonthlyWeekSummaries().length}>
                              {formatNumber(getMonthlySummaryStats()?.pnl ?? 0, true).text}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 선택된 주차의 일별 데이터 - 표 바로 아래에 표시 */}
              {selectedWeek && (
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                  <h5 className="text-sm font-semibold text-blue-800 mb-3">
                    {month}월 {selectedWeek}주차 - 일별 피드백
                  </h5>
                  {loadingDays ? (
                    <div className="text-center py-4 text-gray-500">일별 데이터 로딩 중...</div>
                  ) : days.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      {selectedWeek}주차에 피드백 데이터가 없습니다.
                    </div>
                  ) : (
                    <DaysTable
                      year={year}
                      month={month}
                      days={days}
                      selectedDay={selectedDay}
                      onDayClick={(day) => loadDailyFeedbacks(selectedWeek, day)}
                    />
                  )}

                  {/* 선택된 일자의 피드백 목록 */}
                  {selectedDay && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <FeedbackListSection
                        year={year}
                        month={month}
                        selectedDay={selectedDay}
                        dailyFeedbacks={dailyFeedbacks}
                        loadingFeedbacks={loadingFeedbacks}
                        onFeedbackClick={handleFeedbackClick}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 타점별 성적표 - 스윙 + 완강 후인 경우에만 표시 */}
              {getEntryPointStatistics() && isAfterCompletion(monthlySummary) && getInvestmentType(monthlySummary) === 'SWING' && (
                <div className="mb-6">
                  <h2 className="text-base sm:text-lg font-bold mb-4">타점별 성적표</h2>
                  <div className="overflow-x-auto">
                    <div className="min-w-[400px]">
                      <div className="border border-gray-400 rounded-lg overflow-hidden">
                        <table className="w-full border-collapse text-center text-[10px] sm:text-xs md:text-sm">
                          <thead>
                            <tr>
                              <th className="w-[70px] sm:w-[90px] md:w-32 border border-gray-300 bg-gray-50 py-2 px-1 sm:px-2 md:px-4"></th>
                              <th className="border border-gray-300 bg-gray-50 py-2 px-1 sm:px-2 md:px-4">역추세</th>
                              <th className="border border-gray-300 bg-gray-50 py-2 px-1 sm:px-2 md:px-4">눌림목</th>
                              <th className="border border-gray-300 bg-gray-50 py-2 px-1 sm:px-2 md:px-4">돌파</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                                포지션 횟수
                              </td>
                              <td className="border border-gray-300 py-2">
                                {getEntryPointStatistics()?.reverse?.count ?? '-'}
                              </td>
                              <td className="border border-gray-300 py-2">
                                {getEntryPointStatistics()?.pullBack?.count ?? '-'}
                              </td>
                              <td className="border border-gray-300 py-2">
                                {getEntryPointStatistics()?.breakOut?.count ?? '-'}
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                                승률
                              </td>
                              <td className="border border-gray-300 py-2">
                                {getEntryPointStatistics()?.reverse?.winRate != null
                                  ? `${getEntryPointStatistics()!.reverse!.winRate.toFixed(1)}%`
                                  : '-'}
                              </td>
                              <td className="border border-gray-300 py-2">
                                {getEntryPointStatistics()?.pullBack?.winRate != null
                                  ? `${getEntryPointStatistics()!.pullBack!.winRate.toFixed(1)}%`
                                  : '-'}
                              </td>
                              <td className="border border-gray-300 py-2">
                                {getEntryPointStatistics()?.breakOut?.winRate != null
                                  ? `${getEntryPointStatistics()!.breakOut!.winRate.toFixed(1)}%`
                                  : '-'}
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                                R&R
                              </td>
                              <td className={`border border-gray-300 py-2 font-semibold ${
                                getEntryPointStatistics()?.reverse?.rnr != null
                                  ? formatNumber(getEntryPointStatistics()!.reverse!.rnr).color
                                  : ''
                              }`}>
                                {getEntryPointStatistics()?.reverse?.rnr != null
                                  ? formatNumber(getEntryPointStatistics()!.reverse!.rnr).text
                                  : '-'}
                              </td>
                              <td className={`border border-gray-300 py-2 font-semibold ${
                                getEntryPointStatistics()?.pullBack?.rnr != null
                                  ? formatNumber(getEntryPointStatistics()!.pullBack!.rnr).color
                                  : ''
                              }`}>
                                {getEntryPointStatistics()?.pullBack?.rnr != null
                                  ? formatNumber(getEntryPointStatistics()!.pullBack!.rnr).text
                                  : '-'}
                              </td>
                              <td className={`border border-gray-300 py-2 font-semibold ${
                                getEntryPointStatistics()?.breakOut?.rnr != null
                                  ? formatNumber(getEntryPointStatistics()!.breakOut!.rnr).color
                                  : ''
                              }`}>
                                {getEntryPointStatistics()?.breakOut?.rnr != null
                                  ? formatNumber(getEntryPointStatistics()!.breakOut!.rnr).text
                                  : '-'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 비교 섹션 - tpt-published 스타일 */}
              {getMonthlyPerformanceComparison() && (
                <div className="mt-6 sm:mt-8">
                  <h2 className="text-sm sm:text-lg font-semibold text-center mb-4 sm:mb-6">
                    <span className="bg-yellow-100 px-2 py-1 rounded">
                      {getMonthlyPerformanceComparison()?.before?.month || month - 1}월 대비 {month}월의 매매 성적 변화량
                    </span>
                  </h2>

                  <div className="grid grid-cols-2 gap-3 sm:gap-8">
                    {/* Before Month */}
                    <div>
                      <h3 className="text-xs sm:text-base font-semibold text-center mb-2 sm:mb-3">
                        {getMonthlyPerformanceComparison()?.before?.month || month - 1}월
                      </h3>
                      <div className="border-t-2 border-yellow-900 pt-2 sm:pt-3">
                        <div className="flex justify-between py-1 sm:py-2 text-gray-700 text-[10px] sm:text-sm">
                          <span>월간 최종 승률</span>
                          <span>
                            {getMonthlyPerformanceComparison()?.before?.finalWinRate?.toFixed(1) || '-'}%
                          </span>
                        </div>
                        <div className="flex justify-between py-1 sm:py-2 text-[10px] sm:text-sm">
                          <span className="text-gray-700">월간 평균 손익비</span>
                          <span className={`font-semibold ${formatNumber(getMonthlyPerformanceComparison()?.before?.averageRnr ?? 0).color}`}>
                            {formatNumber(getMonthlyPerformanceComparison()?.before?.averageRnr ?? 0).text}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 sm:py-2 text-[10px] sm:text-sm">
                          <span className="text-gray-700">월간 최종 P&L</span>
                          <span className={`font-semibold ${formatNumber(getMonthlyPerformanceComparison()?.before?.finalPnL ?? 0, true).color}`}>
                            {formatNumber(getMonthlyPerformanceComparison()?.before?.finalPnL ?? 0, true).text}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Now Month */}
                    <div>
                      <h3 className="text-xs sm:text-base font-semibold text-center mb-2 sm:mb-3">
                        {month}월
                      </h3>
                      <div className="border-t-2 border-yellow-900 pt-2 sm:pt-3">
                        <div className="flex justify-between py-1 sm:py-2 text-gray-900 font-semibold text-[10px] sm:text-sm">
                          <span>월간 최종 승률</span>
                          <span>
                            {getMonthlyPerformanceComparison()?.current?.finalWinRate?.toFixed(1) || getMonthlySummaryStats()?.winningRate?.toFixed(1) || '-'}%
                          </span>
                        </div>
                        <div className="flex justify-between py-1 sm:py-2 font-semibold text-[10px] sm:text-sm">
                          <span className="text-gray-900">월간 평균 손익비</span>
                          <span className={formatNumber(getMonthlyPerformanceComparison()?.current?.averageRnr ?? getMonthlySummaryStats()?.averageRnr ?? 0).color}>
                            {formatNumber(getMonthlyPerformanceComparison()?.current?.averageRnr ?? getMonthlySummaryStats()?.averageRnr ?? 0).text}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 sm:py-2 font-semibold text-[10px] sm:text-sm">
                          <span className="text-gray-900">월간 최종 P&L</span>
                          <span className={formatNumber(getMonthlyPerformanceComparison()?.current?.finalPnL ?? getMonthlySummaryStats()?.pnl ?? 0, true).color}>
                            {formatNumber(getMonthlyPerformanceComparison()?.current?.finalPnL ?? getMonthlySummaryStats()?.pnl ?? 0, true).text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {year}년 {month}월에 통계 데이터가 없습니다.
            </div>
          )}
        </div>
      )}

      {/* 주간 피드백 통계 - tpt-published WeekFeedback 스타일 */}
      {type === 'weekly' && selectedWeek && (
        <div className="space-y-4">
          {loadingSummary ? (
            <div className="text-center py-4 text-gray-500">통계 데이터 로딩 중...</div>
          ) : weeklySummary ? (
            <>
              {/* 타이틀 */}
              <div className="mb-4">
                <h2 className="text-gray-400 text-sm sm:text-base mb-1">
                  {year}년 / {month}월 / {selectedWeek}주차
                </h2>
                <h1 className="text-lg sm:text-xl font-bold">주간 매매일지</h1>
              </div>

              {/* 주간 통계 테이블 */}
              {getWeeklyDaySummaries().length > 0 && (
                <div className="overflow-x-auto">
                  <div className="min-w-[500px]">
                    <div className="border border-gray-400 rounded-lg overflow-hidden mb-6">
                      <table className="w-full border-collapse text-center text-[10px] sm:text-xs md:text-sm">
                        <thead>
                          <tr>
                            <th className="w-[60px] sm:w-[80px] md:w-32 border border-gray-300 bg-gray-50 py-2"></th>
                            {getWeeklyDaySummaries().map((dayData) => {
                              const dateObj = new Date(dayData.date);
                              const dayNum = dateObj.getDate();
                              const dayOfWeek = getDayOfWeekLabel(dateObj.getFullYear(), dateObj.getMonth() + 1, dayNum);
                              const isSelected = selectedDay === dayNum;
                              return (
                                <th
                                  key={dayData.date}
                                  className="border border-gray-300 py-2 px-0.5 sm:px-1 md:px-4"
                                >
                                  <div className="flex justify-center">
                                    <button
                                      onClick={() => handleDayClick(dayData.date)}
                                      className={`px-1 sm:px-2 md:px-3 py-1 text-[9px] sm:text-xs md:text-sm rounded flex flex-col items-center cursor-pointer transition-all ${
                                        isSelected
                                          ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-300'
                                          : 'bg-gray-800 text-white hover:bg-gray-700 hover:shadow-md'
                                      }`}
                                    >
                                      <span className="font-medium">{dayOfWeek}</span>
                                      <span className={`text-[8px] sm:text-[10px] md:text-xs ${isSelected ? 'text-green-100' : 'text-gray-300'}`}>
                                        {dateObj.getMonth() + 1}/{dayNum}
                                      </span>
                                    </button>
                                  </div>
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                              매매횟수
                            </td>
                            {getWeeklyDaySummaries().map((dayData) => (
                              <td key={`${dayData.date}-trades`} className="border border-gray-300 py-2">
                                {dayData.tradingCount}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                              수익횟수
                            </td>
                            {getWeeklyDaySummaries().map((dayData) => (
                              <td key={`${dayData.date}-wins`} className="border border-gray-300 py-2">
                                {dayData.winCount}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                              손실횟수
                            </td>
                            {getWeeklyDaySummaries().map((dayData) => (
                              <td key={`${dayData.date}-losses`} className="border border-gray-300 py-2">
                                {dayData.lossCount}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                              일간 P&L
                            </td>
                            {getWeeklyDaySummaries().map((dayData) => {
                              const formatted = formatNumber(dayData.dailyPnl ?? 0, true);
                              return (
                                <td key={`${dayData.date}-pnl`} className={`border border-gray-300 py-2 font-semibold ${formatted.color}`}>
                                  {formatted.text}
                                </td>
                              );
                            })}
                          </tr>
                          <tr>
                            <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                              승률
                            </td>
                            <td className="border border-gray-300 py-2" colSpan={getWeeklyDaySummaries().length}>
                              {getWeeklySummaryStats()?.winningRate?.toFixed(1) || '-'}%
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                              평균 손익비
                            </td>
                            <td className={`border border-gray-300 py-2 font-semibold ${formatNumber(getWeeklySummaryStats()?.averageRnr ?? 0).color}`} colSpan={getWeeklyDaySummaries().length}>
                              {formatNumber(getWeeklySummaryStats()?.averageRnr ?? 0).text}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                              주간 P&L
                            </td>
                            <td className={`border border-gray-300 py-2 font-semibold ${formatNumber(getWeeklySummaryStats()?.pnl ?? 0, true).color}`} colSpan={getWeeklyDaySummaries().length}>
                              {formatNumber(getWeeklySummaryStats()?.pnl ?? 0, true).text}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 선택된 일자의 피드백 목록 - 표 바로 아래에 표시 */}
              {selectedDay && (
                <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
                  <FeedbackListSection
                    year={year}
                    month={month}
                    selectedDay={selectedDay}
                    dailyFeedbacks={dailyFeedbacks}
                    loadingFeedbacks={loadingFeedbacks}
                    onFeedbackClick={handleFeedbackClick}
                  />
                </div>
              )}

              {/* 방향 분석 - 데이 + 완강 후인 경우에만 표시 */}
              {getDirectionStatistics() && isAfterCompletion(weeklySummary) && getInvestmentType(weeklySummary) === 'DAY' && (
                <div className="mb-6">
                  <h2 className="text-base sm:text-lg font-bold mb-4">방향 분석</h2>
                  <div className="overflow-x-auto">
                    <div className="min-w-[400px]">
                      <div className="border border-gray-400 rounded-lg overflow-hidden">
                        <table className="w-full border-collapse text-center text-[10px] sm:text-xs md:text-sm">
                          <thead>
                            <tr>
                              <th className="w-[70px] sm:w-[90px] md:w-32 border border-gray-300 bg-gray-50 py-2 px-1 sm:px-2 md:px-4"></th>
                              <th className="border border-gray-300 bg-gray-50 py-2 px-1 sm:px-2 md:px-4">방향성 O</th>
                              <th className="border border-gray-300 bg-gray-50 py-2 px-1 sm:px-2 md:px-4">방향성 X</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                                포지션 횟수
                              </td>
                              <td className="border border-gray-300 py-2">
                                {getDirectionStatistics()?.o?.count ?? '-'}
                              </td>
                              <td className="border border-gray-300 py-2">
                                {getDirectionStatistics()?.x?.count ?? '-'}
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                                승률
                              </td>
                              <td className="border border-gray-300 py-2">
                                {getDirectionStatistics()?.o?.winRate != null
                                  ? `${getDirectionStatistics()!.o!.winRate.toFixed(1)}%`
                                  : '-'}
                              </td>
                              <td className="border border-gray-300 py-2">
                                {getDirectionStatistics()?.x?.winRate != null
                                  ? `${getDirectionStatistics()!.x!.winRate.toFixed(1)}%`
                                  : '-'}
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 py-2 px-1 sm:px-2 md:px-4 text-left text-[9px] sm:text-xs md:text-sm whitespace-nowrap">
                                R&R
                              </td>
                              <td className={`border border-gray-300 py-2 font-semibold ${
                                getDirectionStatistics()?.o?.rnr != null
                                  ? formatNumber(getDirectionStatistics()!.o!.rnr).color
                                  : ''
                              }`}>
                                {getDirectionStatistics()?.o?.rnr != null
                                  ? formatNumber(getDirectionStatistics()!.o!.rnr).text
                                  : '-'}
                              </td>
                              <td className={`border border-gray-300 py-2 font-semibold ${
                                getDirectionStatistics()?.x?.rnr != null
                                  ? formatNumber(getDirectionStatistics()!.x!.rnr).color
                                  : ''
                              }`}>
                                {getDirectionStatistics()?.x?.rnr != null
                                  ? formatNumber(getDirectionStatistics()!.x!.rnr).text
                                  : '-'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 비교 섹션 - tpt-published 스타일 */}
              {getWeeklyPerformanceComparison() && (
                <div className="mt-6 sm:mt-8">
                  <h2 className="text-sm sm:text-lg font-semibold text-center mb-4 sm:mb-6">
                    <span className="bg-yellow-100 px-2 py-1 rounded">
                      지난 주 대비 이번 주의 매매 성적 변화량
                    </span>
                  </h2>

                  <div className="grid grid-cols-2 gap-3 sm:gap-8">
                    {/* 지난 주 */}
                    <div>
                      <h3 className="text-xs sm:text-base font-semibold text-center mb-2 sm:mb-3">
                        지난 주
                      </h3>
                      <div className="border-t-2 border-yellow-900 pt-2 sm:pt-3">
                        <div className="flex justify-between py-1 sm:py-2 text-gray-700 text-[10px] sm:text-sm">
                          <span>승률</span>
                          <span>
                            {getWeeklyPerformanceComparison()?.before?.winRate?.toFixed(1) || '-'}%
                          </span>
                        </div>
                        <div className="flex justify-between py-1 sm:py-2 text-[10px] sm:text-sm">
                          <span className="text-gray-700">손익비</span>
                          <span className={`font-semibold ${formatNumber(getWeeklyPerformanceComparison()?.before?.rnr ?? 0).color}`}>
                            {formatNumber(getWeeklyPerformanceComparison()?.before?.rnr ?? 0).text}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 sm:py-2 text-[10px] sm:text-sm">
                          <span className="text-gray-700">P&L</span>
                          <span className={`font-semibold ${formatNumber(getWeeklyPerformanceComparison()?.before?.pnl ?? 0, true).color}`}>
                            {formatNumber(getWeeklyPerformanceComparison()?.before?.pnl ?? 0, true).text}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 이번 주 */}
                    <div>
                      <h3 className="text-xs sm:text-base font-semibold text-center mb-2 sm:mb-3">
                        이번 주
                      </h3>
                      <div className="border-t-2 border-yellow-900 pt-2 sm:pt-3">
                        <div className="flex justify-between py-1 sm:py-2 text-gray-900 font-semibold text-[10px] sm:text-sm">
                          <span>승률</span>
                          <span>
                            {getWeeklyPerformanceComparison()?.current?.winRate?.toFixed(1) || getWeeklySummaryStats()?.winningRate?.toFixed(1) || '-'}%
                          </span>
                        </div>
                        <div className="flex justify-between py-1 sm:py-2 font-semibold text-[10px] sm:text-sm">
                          <span className="text-gray-900">손익비</span>
                          <span className={formatNumber(getWeeklyPerformanceComparison()?.current?.rnr ?? getWeeklySummaryStats()?.averageRnr ?? 0).color}>
                            {formatNumber(getWeeklyPerformanceComparison()?.current?.rnr ?? getWeeklySummaryStats()?.averageRnr ?? 0).text}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 sm:py-2 font-semibold text-[10px] sm:text-sm">
                          <span className="text-gray-900">P&L</span>
                          <span className={formatNumber(getWeeklyPerformanceComparison()?.current?.pnl ?? getWeeklySummaryStats()?.pnl ?? 0, true).color}>
                            {formatNumber(getWeeklyPerformanceComparison()?.current?.pnl ?? getWeeklySummaryStats()?.pnl ?? 0, true).text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {year}년 {month}월 {selectedWeek}주차에 통계 데이터가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 일별 테이블 컴포넌트
interface DaysTableProps {
  year: number;
  month: number;
  days: number[];
  selectedDay: number | null;
  onDayClick: (day: number) => void;
}

function DaysTable({ year, month, days, selectedDay, onDayClick }: DaysTableProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {days.map((d) => {
        const dayOfWeek = getDayOfWeekLabel(year, month, d);
        const isWeekend = dayOfWeek === '토' || dayOfWeek === '일';
        const isSelected = selectedDay === d;
        return (
          <button
            key={d}
            onClick={() => onDayClick(d)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center min-w-[60px] ${
              isSelected
                ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-300'
                : isWeekend
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span className="text-xs">{month}/{d}</span>
            <span className={`text-[10px] ${isSelected ? 'text-green-100' : isWeekend ? 'text-red-500' : 'text-gray-500'}`}>
              ({dayOfWeek})
            </span>
          </button>
        );
      })}
    </div>
  );
}

// 피드백 목록 섹션 컴포넌트
interface FeedbackListSectionProps {
  year: number;
  month: number;
  selectedDay: number;
  dailyFeedbacks: DailyFeedbackListItem[];
  loadingFeedbacks: boolean;
  onFeedbackClick: (feedbackId: number) => void;
}

function FeedbackListSection({
  year,
  month,
  selectedDay,
  dailyFeedbacks,
  loadingFeedbacks,
  onFeedbackClick,
}: FeedbackListSectionProps) {
  return (
    <div>
      <h5 className="text-sm font-semibold text-gray-800 mb-3">
        {month}월 {selectedDay}일 ({getDayOfWeekLabel(year, month, selectedDay)}) - 매매일지 목록
      </h5>
      {loadingFeedbacks ? (
        <div className="text-center py-4 text-gray-500">피드백 목록 로딩 중...</div>
      ) : dailyFeedbacks.length === 0 ? (
        <div className="text-center py-4 text-gray-500">해당 날짜에 매매일지가 없습니다.</div>
      ) : (
        <div className="space-y-2">
          {dailyFeedbacks.map((feedback) => {
            const statusLabel = getFeedbackStatusLabel(feedback.status);
            return (
              <div
                key={feedback.feedbackId}
                className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onFeedbackClick(feedback.feedbackId)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400">#{feedback.feedbackId}</span>
                      <span className={`px-1.5 py-0.5 text-[10px] rounded ${statusLabel.className}`}>
                        {statusLabel.text}
                      </span>
                      {feedback.hasResponse && (
                        <span className="text-green-600 text-[10px] font-medium">응답완료</span>
                      )}
                    </div>
                    <h6 className="text-sm font-medium text-gray-900 truncate">{feedback.title}</h6>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-100 text-blue-800">
                        {getInvestmentTypeLabel(feedback.investmentType)}
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 text-gray-700">
                        {getCourseStatusLabel(feedback.courseStatus)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(feedback.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFeedbackClick(feedback.feedbackId);
                    }}
                    className="px-3 py-1.5 text-xs rounded-md font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-sm whitespace-nowrap"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            );
          })}
          <p className="mt-2 text-[10px] text-gray-500">
            * 카드를 클릭하면 매매일지 상세 페이지로 이동합니다.
          </p>
        </div>
      )}
    </div>
  );
}
