'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPnLCalendar } from '../../Shared/api/services/feedbackService';
import type { DailyPnlDTO } from '../../Shared/api/apiTypes';

// 영어 월 이름
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * 월별 PnL 달력 컴포넌트
 * 각 날짜의 PnL을 초록(양수) 또는 빨강(음수)으로 표시
 */
export default function PnLCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [pnlData, setPnlData] = useState<DailyPnlDTO[]>([]);
  const [totalPnl, setTotalPnl] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const monthName = MONTH_NAMES[month - 1];

  useEffect(() => {
    loadPnLCalendar();
  }, [year, month]);

  const loadPnLCalendar = async () => {
    setLoading(true);
    try {
      console.log('[PnLCalendar] PnL 달력 조회 시작:', { year, month });
      const response = await getPnLCalendar(year, month);

      if (response.success && response.data) {
        console.log('[PnLCalendar] PnL 달력 조회 성공:', response.data);
        setPnlData(response.data.dailyPnls || []);
        setTotalPnl(response.data.totalPnl || 0);
      } else {
        console.error('[PnLCalendar] PnL 달력 조회 실패:', response.error);
        setPnlData([]);
        setTotalPnl(0);
      }
    } catch (error) {
      console.error('[PnLCalendar] PnL 달력 조회 오류:', error);
      setPnlData([]);
      setTotalPnl(0);
    } finally {
      setLoading(false);
    }
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  // 해당 월의 첫날과 마지막날
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0(일) ~ 6(토)
  const lastDate = new Date(year, month, 0).getDate();

  // 달력 셀 생성
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= lastDate; day++) {
    calendarCells.push(day);
  }

  // 특정 날짜의 데이터 찾기
  const getDataForDay = (day: number): DailyPnlDTO | null => {
    const found = pnlData.find((d) => d.day === day);
    return found || null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      {/* 상단: Month PnL 표시 */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-base md:text-lg font-semibold text-gray-700">
          {monthName} PnL
        </span>
        <span className={`text-base md:text-lg font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}%
        </span>
      </div>

      {/* 네비게이션 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="이전 달"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg md:text-xl font-semibold">
          {year}년 {month}월
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="다음 달"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div
            key={day}
            className="text-center text-xs md:text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 본체 */}
      <div className={`grid grid-cols-7 gap-1 min-h-[320px] ${loading ? 'opacity-50' : ''}`}>
        {loading ? (
          // 로딩 중에도 동일한 그리드 구조 유지 (빈 셀로 채움)
          Array.from({ length: 35 }, (_, index) => (
            <div key={`loading-${index}`} className="aspect-square rounded-md bg-gray-50" />
          ))
        ) : (
          calendarCells.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayData = getDataForDay(day);
            const pnl = dayData?.pnl ?? null;
            const feedbackCount = dayData?.feedbackCount;
            const winRate = dayData?.winRate;

            let bgColor = 'bg-gray-50';
            let pnlColor = 'text-gray-800';

            if (pnl !== null) {
              if (pnl > 0) {
                bgColor = 'bg-green-100';
                pnlColor = 'text-green-700';
              } else if (pnl < 0) {
                bgColor = 'bg-red-100';
                pnlColor = 'text-red-700';
              }
            }

            return (
              <div
                key={day}
                className={`aspect-square flex flex-col items-center justify-center rounded-md ${bgColor} text-xs transition hover:opacity-80 p-1`}
              >
                <div className="font-medium text-gray-800">{day}</div>
                {dayData && (
                  <div className="flex flex-col items-center mt-0.5 space-y-0">
                    {/* PnL */}
                    <div className={`text-[10px] md:text-xs font-semibold ${pnlColor}`}>
                      {pnl !== null && pnl > 0 ? '+' : ''}
                      {pnl !== null ? `${pnl.toFixed(1)}%` : ''}
                    </div>
                    {/* 매매횟수 & 승률 */}
                    {(feedbackCount !== undefined || winRate !== undefined) && (
                      <div className="text-[8px] md:text-[10px] text-gray-500 leading-tight">
                        {feedbackCount !== undefined && <span>{feedbackCount}회</span>}
                        {feedbackCount !== undefined && winRate !== undefined && <span> · </span>}
                        {winRate !== undefined && <span>{winRate}%</span>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
