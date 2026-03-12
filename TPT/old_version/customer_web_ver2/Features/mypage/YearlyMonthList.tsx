'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetcher } from '../../Shared/api/apiInstance';
import { API_ENDPOINTS } from '../../Shared/api/endpoints';

interface MonthData {
  month: number;
}

/**
 * 연도별 월 목록 컴포넌트
 * 마이페이지 하단에 표시되며, 매매일지를 작성한 월 목록을 보여줌
 */
export default function YearlyMonthList() {
  const router = useRouter();

  const yearOptions = ['2025', '2024', '2023'];
  const [selectedYear, setSelectedYear] = useState('2025');
  const [monthList, setMonthList] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // 연도별 월 목록 조회
  useEffect(() => {
    const fetchMonthList = async () => {
      setLoading(true);
      try {
        const response = await fetcher<{ months: MonthData[] }>(
          API_ENDPOINTS.MONTHLY_TRADING.GET_YEARS(parseInt(selectedYear)),
          { method: 'GET' }
        );

        if (response.success && response.data) {
          // 월 목록 추출
          const months = response.data.months.map((item) => item.month);
          setMonthList(months);
        } else {
          console.error('월 목록 조회 실패:', response.error);
          setMonthList([]);
        }
      } catch (error) {
        console.error('월 목록 조회 에러:', error);
        setMonthList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthList();
  }, [selectedYear]);

  return (
    <div className="w-full flex flex-col items-start">
      {/* 제목 */}
      <h2 className="text-xl mb-6">월간 매매일지</h2>

      {/* 연도 선택 드롭다운 */}
      <div className="mb-6">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>
      </div>

      {/* 월 목록 버튼 */}
      {loading ? (
        <div className="w-full text-center py-4">로딩 중...</div>
      ) : monthList.length > 0 ? (
        <div className="flex flex-col gap-2 w-full">
          {monthList.map((month) => (
            <button
              key={month}
              onClick={() => router.push(`/my/feedback-month?year=${selectedYear}&month=${month}`)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-800">{month}</span>
                <span className="text-sm text-gray-600">월간 매매일지</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-4 text-gray-500">
          해당 연도에 매매일지가 없습니다.
        </div>
      )}
    </div>
  );
}
