'use client';

import { useState } from 'react';

interface WeekSelectorProps {
  onChange: (data: { month: number; week: number }) => void;
}

/**
 * 월/주차 선택 컴포넌트
 */
export default function WeekSelector({ onChange }: WeekSelectorProps) {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [week, setWeek] = useState<number>(1);

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    onChange({ month: newMonth, week });
  };

  const handleWeekChange = (newWeek: number) => {
    setWeek(newWeek);
    onChange({ month, week: newWeek });
  };

  return (
    <div className="flex gap-3 items-center">
      <label className="font-medium">주차 선택:</label>
      <select
        value={month}
        onChange={(e) => handleMonthChange(Number(e.target.value))}
        className="border border-gray-300 rounded px-3 py-2"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>
            {m}월
          </option>
        ))}
      </select>
      <select
        value={week}
        onChange={(e) => handleWeekChange(Number(e.target.value))}
        className="border border-gray-300 rounded px-3 py-2"
      >
        {Array.from({ length: 5 }, (_, i) => i + 1).map((w) => (
          <option key={w} value={w}>
            {w}주차
          </option>
        ))}
      </select>
    </div>
  );
}
