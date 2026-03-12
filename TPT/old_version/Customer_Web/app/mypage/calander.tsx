"use client";
import React from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calander.css";

type Value = CalendarProps["value"];

// 날짜별 데이터 타입
interface DailyData {
	[date: string]: number; // "YYYY-MM-DD": 값
}

interface CustomCalendarProps {
	value: Value;
	onChange: (value: Value) => void;
}

// 📌 Mock Data (2025년 9월 기준 예시)
const mockData: DailyData = {
	"2025-09-01": -1,
	"2025-09-02": 3,
	"2025-09-05": -4.2,
	"2025-09-10": 2.5,
	"2025-09-12": -0.7,
	"2025-09-15": 1.8,
	"2025-09-20": -2,
	"2025-09-25": 4.3,
};

export default function CustomCalendar({ value, onChange }: CustomCalendarProps) {
	// 날짜를 YYYY-MM-DD 문자열로 변환하는 함수
	const formatDate = (date: Date) => {
		return date.toISOString().split("T")[0];
	};

	return (
		<Calendar
			onChange={onChange}
			value={value}
			locale="ko-KR"
			// 📌 날짜마다 데이터 표시
			tileContent={({ date, view }) => {
				if (view === "month") {
					const key = formatDate(date);
					const dailyValue = mockData[key];
					if (dailyValue !== undefined) {
						return (
							<div
								style={{
									fontSize: "0.7rem",
									marginTop: "2px",
									color: dailyValue >= 0 ? "green" : "red",
								}}
							>
								{dailyValue > 0 ? `+${dailyValue}` : dailyValue}
							</div>
						);
					}
				}
				return null;
			}}
		/>
	);
}
