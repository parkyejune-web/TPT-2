"use client";

import React from "react";

interface TimeFeedbackProps {
	year: string;
	month: string;
	week: string;
	day: string;
	time: string;
	title: string;
}

export default function TimeFeedback({
	year,
	month,
	week,
	day,
	time,
	title,
}: TimeFeedbackProps) {
	return (
		<div className="w-full max-w-lg p-6">
			{/* 상단 타이틀 */}
			<h2 className="text-gray-400 text-lg mb-2">
				{year}년 / {month}월 / {week} / {day} {time}
			</h2>
			<h1 className="text-2xl font-bold mb-4">매매일지 상세</h1>

			<hr className="mb-6 border-gray-300" />

			{/* 본문 */}
			<div className="text-gray-800 mb-2 text-xl font-semibold">
				{title}
			</div>
			<div className="text-gray-500 text-sm">
				{year}.{month}.{day}.{time}
			</div>
		</div>
	);
}
