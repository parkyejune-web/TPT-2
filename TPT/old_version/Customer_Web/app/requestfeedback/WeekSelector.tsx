"use client";

import { useState, useEffect } from "react";

type Props = {
	onChange: (data: { month: number; week: number }) => void;
};

export default function WeekSelector({ onChange }: Props) {
	const today = new Date();

	// 현재 달
	const currentMonth = today.getMonth() + 1;

	// 이번 달의 몇 주차인지 계산
	const getWeekOfMonth = (date: Date) => {
		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		const dayOfWeek = firstDay.getDay(); // 0: 일요일 ~ 6: 토요일
		const adjustedDate = date.getDate() + dayOfWeek;
		return Math.ceil(adjustedDate / 7);
	};

	const currentWeek = getWeekOfMonth(today);

	const [month, setMonth] = useState(currentMonth);
	const [week, setWeek] = useState(currentWeek);

	// 기본값 및 변경 시 부모에게 전달
	useEffect(() => {
		onChange({ month, week });
	}, [month, week, onChange]);

	return (
		<div className="flex items-center gap-2 ml-auto">
			<select
				className="border rounded px-2 py-1"
				value={month}
				onChange={(e) => setMonth(Number(e.target.value))}
			>
				{Array.from({ length: 12 }, (_, i) => (
					<option key={i + 1} value={i + 1}>
						{i + 1}
					</option>
				))}
			</select>
			<span>월</span>

			<select
				className="border rounded px-2 py-1"
				value={week}
				onChange={(e) => setWeek(Number(e.target.value))}
			>
				{[1, 2, 3, 4, 5].map((w) => (
					<option key={w} value={w}>
						{w}
					</option>
				))}
			</select>
			<span>주차 매매기록</span>
		</div>
	);
}
