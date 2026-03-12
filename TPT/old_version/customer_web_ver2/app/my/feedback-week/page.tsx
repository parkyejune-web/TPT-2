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

          // 일별 데이터 변환
          const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
          const daysData: DayData[] =
            data.weeklyFeedbackSummaryResponseDTO.weeklyWeekFeedbackSummaryResponseDTOS.map(
              (dayData: any) => {
                const dayDate = new Date(dayData.date);
                const dayOfWeek = dayDate.getDay();
                const dayName = dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
                const dayNumber = dayDate.getDate();

                return {
                  day: dayName,
                  dayNumber: dayNumber,
                  trades: dayData.tradingCount || '-',
                  wins: dayData.winCount || '-',
                  losses: dayData.lossCount || '-',
                  dailyPnL: dayData.dailyPnl || '-',
                  new: dayData.status === 'FN', // FN: 피드백 답변 안 읽음
                };
              }
            );
          setDays(daysData);

          // 주간 요약 데이터
          setSummary({
            winRate: `${data.weeklyFeedbackSummaryResponseDTO.winningRate.toFixed(1)}%`,
            profitLossRatio: `${data.weeklyFeedbackSummaryResponseDTO.weeklyAverageRnr.toFixed(
              2
            )}`,
            weeklyPnL: `${data.weeklyFeedbackSummaryResponseDTO.weeklyPnl.toFixed(2)}`,
          });

          // 성과 비교 데이터 (지난 주 vs 이번 주)
          if (data.performanceComparison) {
            setComparison({
              before: {
                winRate: `${data.performanceComparison.before.winRate.toFixed(1)}%`,
                profitLossRatio: `${data.performanceComparison.before.rnr.toFixed(2)}`,
                weeklyPnL: `${data.performanceComparison.before.pnl.toFixed(2)}`,
              },
              current: {
                winRate: `${data.performanceComparison.current.winRate.toFixed(1)}%`,
                profitLossRatio: `${data.performanceComparison.current.rnr.toFixed(2)}`,
                weeklyPnL: `${data.performanceComparison.current.pnl.toFixed(2)}`,
              },
            });
          }

          // 메모 데이터 (있는 경우)
          if (data.memo) {
            setMemo(data.memo);
          }
        } else {
          console.error('주간 통계 조회 실패:', response.error);
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
    />
  );
}
