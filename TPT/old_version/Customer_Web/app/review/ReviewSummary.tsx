"use client";
import React from "react";
import { Star } from "lucide-react";

type SummaryItem = {
	label: string;
	count: number;
	total: number;
};

export default function ReviewSummary() {
	const summary: SummaryItem[] = [
		{ label: "맞춤 상담 300만원 어치의 가치가 있어요", count: 5400, total: 6000 },
		{ label: "전문 전략 200만원 어치의 가치가 있어요", count: 3400, total: 6000 },
		{ label: "고수익 가능성 500만원 어치의 가치가 있어요", count: 2400, total: 6000 },
	];

	return (
		<div className="bg-white p-3 sm:p-4">
			{/* 평점 */}
			<div className="flex items-center gap-2 mb-4">
				<Star className="text-[#B9AB70] fill-[#B9AB70]" size={18} />
				<span className="text-base sm:text-lg font-serif text-[#B9AB70]">4.9</span>
			</div>

			{/* 막대 그래프 */}
			<div className="space-y-3">
				{summary.map((item, idx) => {
					const percentage = Math.round((item.count / item.total) * 100);
					return (
						<div key={idx} className="flex flex-col w-full">
							<div className="flex justify-between items-start text-xs sm:text-sm mb-1">
								<span className="text-gray-700 leading-snug break-words">
									{item.label}
								</span>
								<span className="text-gray-500 whitespace-nowrap ml-2">
									({item.count.toLocaleString()})
								</span>
							</div>
							<div className="h-4 sm:h-6 bg-[#F7F7F9] rounded-md overflow-hidden">
								<div
									className="h-full bg-[#C7E4E8]"
									style={{ width: `${percentage}%` }}
								></div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
