'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetcher } from '../../Shared/api/apiInstance';
import { API_ENDPOINTS } from '../../Shared/api/endpoints';

interface DayPnL {
  day: number;
  pnl: number;
}

interface PnLCalendarData {
  year: number;
  month: number;
  days: DayPnL[];
}

/**
 * 월별 PnL 달력 컴포넌트
 * 각 날짜의 PnL을 초록(양수) 또는 빨강(음수)으로 표시
 */
export default function PnLCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [pnlData, setPnlData] = useState<DayPnL[]>([]);
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    loadPnLCalendar();
  }, [year, month]);

  const loadPnLCalendar = async () => {
    setLoading(true);
    try {
      const response = await fetcher<PnLCalendarData>(
        API_ENDPOINTS.FEEDBACK_REQUEST.PNL_CALENDAR(year, month),
        { method: 'GET' }
      );
      if (response.success && response.data) {
        setPnlData(response.data.days || []);
      }
    } catch (error) {
      console.error('PnL 달력 조회 오류:', error);
      setPnlData([]);
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

  // 특정 날짜의 PnL 찾기
  const getPnLForDay = (day: number): number | null => {
    const found = pnlData.find((d) => d.day === day);
    return found ? found.pnl : null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      {/* 헤더 */}
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
      {loading ? (
        <div className="py-10 text-center text-gray-500">로딩 중...</div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const pnl = getPnLForDay(day);
            let bgColor = 'bg-gray-50';
            let textColor = 'text-gray-800';

            if (pnl !== null) {
              if (pnl > 0) {
                bgColor = 'bg-green-100';
                textColor = 'text-green-700';
              } else if (pnl < 0) {
                bgColor = 'bg-red-100';
                textColor = 'text-red-700';
              }
            }

            return (
              <div
                key={day}
                className={`aspect-square flex flex-col items-center justify-center rounded-md ${bgColor} ${textColor} text-xs md:text-sm transition hover:opacity-80`}
              >
                <div className="font-medium">{day}</div>
                {pnl !== null && (
                  <div className="text-xs font-semibold mt-1">
                    {pnl > 0 ? '+' : ''}
                    {pnl.toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
