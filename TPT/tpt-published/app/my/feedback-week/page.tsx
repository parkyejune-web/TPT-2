'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetcher } from '../../../Shared/api/apiInstance';
import { API_ENDPOINTS } from '../../../Shared/api/endpoints';
import WeekFeedback from '../../../Features/feedback-history/WeekFeedback';

interface DayData {
  day: string;
  dayNumber: number;
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

/**
 * 주별 피드백 통계 페이지
 */
export default function FeedbackWeekPage() {
  const searchParams = useSearchParams();
  const year = searchParams.get('year') || '2025';
  const month = searchParams.get('month') || '1';
  const week = searchParams.get('week') || '첫째 주';

  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<DayData[]>([]);
  const [summary, setSummary] = useState<WeekSummary>({
    winRate: '-',
    profitLossRatio: '-',
    weeklyPnL: '-',
  });
  const [comparison, setComparison] = useState<WeekComparison>({
    before: {
      winRate: '-',
      profitLossRatio: '-',
      weeklyPnL: '-',
    },
    current: {
      winRate: '-',
      profitLossRatio: '-',
      weeklyPnL: '-',
    },
  });
  const [memo, setMemo] = useState('');
  const [directionStatistics, setDirectionStatistics] = useState<DirectionStatistics | null>(null);
  const [investmentType, setInvestmentType] = useState<string>('');
  const [courseStatus, setCourseStatus] = useState<string>('');
  const [swingWeeklyEntries, setSwingWeeklyEntries] = useState<SwingWeeklyEntry[]>([]);
  // 트레이너 평가 데이터 (DAY + 완강 후 전용)
  const [weeklyLossTradingAnalysis, setWeeklyLossTradingAnalysis] = useState<string | null>(null);
  const [weeklyProfitableTradingAnalysis, setWeeklyProfitableTradingAnalysis] = useState<string | null>(null);
  const [weeklyEvaluation, setWeeklyEvaluation] = useState<string | null>(null);

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
    const fetchWeeklySummary = async () => {
      setLoading(true);
      try {
        const weekNumber = getWeekNumber(week);
        const response = await fetcher<any>(
          API_ENDPOINTS.WEEKLY_TRADING.GET(parseInt(year), parseInt(month), weekNumber),
          { method: 'GET' }
        );

        if (response.success && response.data) {
          const data = response.data;
          console.log('[feedback-week] API 응답 데이터 (전체):', JSON.stringify(data, null, 2));

          const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
          let dailyDataSource: any[] = [];
          const isSwing = data.investmentType === 'SWING';

          // 일별 데이터 소스 찾기 (다양한 응답 구조 지원)
          // 1. 데이 트레이딩/완강 전: weeklyFeedbackSummaryResponseDTO.weeklyWeekFeedbackSummaryResponseDTOS
          if (data.weeklyFeedbackSummaryResponseDTO &&
              Array.isArray(data.weeklyFeedbackSummaryResponseDTO.weeklyWeekFeedbackSummaryResponseDTOS)) {
            dailyDataSource = data.weeklyFeedbackSummaryResponseDTO.weeklyWeekFeedbackSummaryResponseDTOS;
            console.log('[feedback-week] 데이터 소스: weeklyFeedbackSummaryResponseDTO.weeklyWeekFeedbackSummaryResponseDTOS');
          }
          // 2. 스윙 트레이딩 완강 후: dailyFeedbackSummaryDTOS
          else if (Array.isArray(data.dailyFeedbackSummaryDTOS)) {
            dailyDataSource = data.dailyFeedbackSummaryDTOS;
            console.log('[feedback-week] 데이터 소스: dailyFeedbackSummaryDTOS');
          }
          // 3. 직접 배열인 경우 (weeklyWeekFeedbackSummaryResponseDTOS가 최상위에 있는 경우)
          else if (Array.isArray(data.weeklyWeekFeedbackSummaryResponseDTOS)) {
            dailyDataSource = data.weeklyWeekFeedbackSummaryResponseDTOS;
            console.log('[feedback-week] 데이터 소스: weeklyWeekFeedbackSummaryResponseDTOS (최상위)');
          }
          else {
            console.log('[feedback-week] 일별 데이터 소스를 찾지 못함. data 키 목록:', Object.keys(data));
          }

          console.log('[feedback-week] 일별 데이터 소스:', dailyDataSource);
          console.log('[feedback-week] 투자 유형:', data.investmentType);
          console.log('[feedback-week] isSwing:', isSwing);

          if (dailyDataSource && dailyDataSource.length > 0) {
            const daysData: DayData[] = dailyDataSource.map((dayData: any) => {
              console.log('[feedback-week] 개별 일별 데이터:', dayData);

              const dayDate = new Date(dayData.date);
              const dayOfWeek = dayDate.getDay();
              const dayName = dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
              const dayNumber = dayDate.getDate();
              // 서버에서 제공하는 날짜를 M/D 형식으로 변환
              const dateString = `${dayDate.getMonth() + 1}/${dayDate.getDate()}`;

              // 스윙 완강 후: totalCount만 있음
              // 데이/완강 전: tradingCount, winCount, lossCount, dailyPnl 있음
              const hasDayTradingFields = dayData.tradingCount !== undefined;

              if (isSwing && !hasDayTradingFields) {
                // 스윙 완강 후 (totalCount만 있는 경우)
                return {
                  day: dayName,
                  dayNumber: dayNumber,
                  trades: dayData.totalCount ?? '-',
                  wins: '-',
                  losses: '-',
                  dailyPnL: '-',
                  new: dayData.status === 'FN',
                  dateString: dateString,
                };
              } else {
                // 데이 트레이딩 또는 완강 전 (상세 필드 있는 경우)
                return {
                  day: dayName,
                  dayNumber: dayNumber,
                  trades: dayData.tradingCount ?? dayData.totalCount ?? '-',
                  wins: dayData.winCount ?? '-',
                  losses: dayData.lossCount ?? '-',
                  dailyPnL: dayData.dailyPnl ?? '-',
                  new: dayData.status === 'FN',
                  dateString: dateString,
                };
              }
            });
            console.log('[feedback-week] 변환된 days 데이터:', daysData);
            setDays(daysData);
          }

          // 주간 요약 데이터
          const summaryData = data.weeklyFeedbackSummaryResponseDTO || data;
          if (summaryData.winningRate != null || summaryData.weeklyAverageRnr != null || summaryData.weeklyPnl != null) {
            setSummary({
              winRate: summaryData.winningRate != null ? `${summaryData.winningRate.toFixed(1)}%` : '-',
              profitLossRatio: summaryData.weeklyAverageRnr != null ? `${summaryData.weeklyAverageRnr.toFixed(2)}` : '-',
              weeklyPnL: summaryData.weeklyPnl != null ? `${summaryData.weeklyPnl.toFixed(2)}` : '-',
            });
          }

          // 성과 비교 데이터 (지난 주 vs 이번 주)
          if (data.performanceComparison) {
            setComparison({
              before: {
                winRate: data.performanceComparison.before?.winRate != null
                  ? `${data.performanceComparison.before.winRate.toFixed(1)}%` : '-',
                profitLossRatio: data.performanceComparison.before?.rnr != null
                  ? `${data.performanceComparison.before.rnr.toFixed(2)}` : '-',
                weeklyPnL: data.performanceComparison.before?.pnl != null
                  ? `${data.performanceComparison.before.pnl.toFixed(2)}` : '-',
              },
              current: {
                winRate: data.performanceComparison.current?.winRate != null
                  ? `${data.performanceComparison.current.winRate.toFixed(1)}%` : '-',
                profitLossRatio: data.performanceComparison.current?.rnr != null
                  ? `${data.performanceComparison.current.rnr.toFixed(2)}` : '-',
                weeklyPnL: data.performanceComparison.current?.pnl != null
                  ? `${data.performanceComparison.current.pnl.toFixed(2)}` : '-',
              },
            });
          }

          // 메모 데이터 (있는 경우)
          if (data.memo) {
            setMemo(data.memo);
          }

          // 투자 유형과 완강 상태 저장
          if (data.investmentType) {
            setInvestmentType(data.investmentType);
          }
          if (data.courseStatus) {
            setCourseStatus(data.courseStatus);
          }

          // 스윙 + 완강 후인 경우 주별 매매일지 엔트리 추출
          const isSwingAfterCompletion = data.investmentType === 'SWING' && data.courseStatus === 'AFTER_COMPLETION';
          if (isSwingAfterCompletion && Array.isArray(data.dailyFeedbackSummaryDTOS)) {
            const dayNameMap = ['일', '월', '화', '수', '목', '금', '토'];
            const entries: SwingWeeklyEntry[] = [];

            data.dailyFeedbackSummaryDTOS.forEach((dayData: any) => {
              // 매매 건수가 0인 날짜는 제외
              if (!dayData.totalCount || dayData.totalCount === 0) return;

              const dateObj = new Date(dayData.date);
              const monthNum = dateObj.getMonth() + 1;
              const dayNum = dateObj.getDate();
              const dayOfWeek = dayNameMap[dateObj.getDay()];
              const formattedDate = `${monthNum}월 ${dayNum}일 (${dayOfWeek})`;

              // 스윙 완강 후에는 feedbackSummaryDTOS 없이 날짜별 totalCount만 제공됨
              // 각 날짜를 하나의 엔트리로 추가 (클릭 시 해당 날짜의 feedback-day 페이지로 이동)
              entries.push({
                date: dayData.date,
                formattedDate,
                title: `${dayData.totalCount}건의 매매일지`,
                feedbackId: 0, // 날짜별 목록 페이지로 이동하므로 feedbackId 불필요
                new: dayData.status === 'FN',
                dayNumber: dayNum, // 날짜 정보 추가
              });
            });

            console.log('[feedback-week] 스윙 완강 후 엔트리:', entries);
            setSwingWeeklyEntries(entries);
          }

          // 데이 + 완강 후인 경우 방향 분석 데이터 설정
          const isDay = data.investmentType === 'DAY';
          const isAfterCompletion = data.courseStatus === 'AFTER_COMPLETION';

          if (isDay && isAfterCompletion && data.directionStatisticsResponseDTO) {
            console.log('[feedback-week] 방향 분석 데이터:', data.directionStatisticsResponseDTO);
            setDirectionStatistics(data.directionStatisticsResponseDTO);
          } else {
            setDirectionStatistics(null);
          }

          // 트레이너 평가 데이터 설정 (유료 고객이면 완강 여부와 무관하게 표시)
          console.log('[feedback-week] 트레이너 평가 데이터:', {
            weeklyLossTradingAnalysis: data.weeklyLossTradingAnalysis,
            weeklyProfitableTradingAnalysis: data.weeklyProfitableTradingAnalysis,
            weeklyEvaluation: data.weeklyEvaluation,
          });
          setWeeklyLossTradingAnalysis(data.weeklyLossTradingAnalysis || null);
          setWeeklyProfitableTradingAnalysis(data.weeklyProfitableTradingAnalysis || null);
          setWeeklyEvaluation(data.weeklyEvaluation || null);
        } else {
          console.error('[feedback-week] 주간 통계 조회 실패:', response.error);
        }
      } catch (error) {
        console.error('주간 통계 조회 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklySummary();
  }, [year, month, week]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <WeekFeedback
      year={year}
      month={month}
      week={week}
      days={days}
      summary={summary}
      comparison={comparison}
      initialMemo={memo}
      directionStatistics={directionStatistics}
      investmentType={investmentType}
      courseStatus={courseStatus}
      swingWeeklyEntries={swingWeeklyEntries}
      weeklyLossTradingAnalysis={weeklyLossTradingAnalysis}
      weeklyProfitableTradingAnalysis={weeklyProfitableTradingAnalysis}
      weeklyEvaluation={weeklyEvaluation}
    />
  );
}
