"use client";
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { reviewService } from "@/Shared/api/services";
import type { ReviewStatisticsResponseDTO, ReviewTagStatisticsResponseDTO } from "@/Shared/api/apiTypes";

// 기본 태그 목록 (API 응답이 없을 때 fallback)
const DEFAULT_TAGS: ReviewTagStatisticsResponseDTO[] = [
	{ tagId: 1, tagName: "맞춤 상담 300만원 어치의 가치가 있어요", reviewCount: 0 },
	{ tagId: 2, tagName: "전문 전략 200만원 어치의 가치가 있어요", reviewCount: 0 },
	{ tagId: 3, tagName: "고수익 가능성 500만원 어치의 가치가 있어요", reviewCount: 0 },
];

interface ReviewSummaryProps {
	onStatisticsLoaded?: (totalCount: number) => void;
}

export default function ReviewSummary({ onStatisticsLoaded }: ReviewSummaryProps) {
	const [statistics, setStatistics] = useState<ReviewStatisticsResponseDTO | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [maxTagCount, setMaxTagCount] = useState(1);

	useEffect(() => {
		const fetchStatistics = async () => {
			setIsLoading(true);
			try {
				const response = await reviewService.getReviewStatistics();
				if (response.success && response.data) {
					setStatistics(response.data);
					// 태그 통계 중 최대값 계산 (막대 그래프 비율 계산용)
					const max = Math.max(
						...response.data.tagStatistics.map((tag) => tag.reviewCount),
						1
					);
					setMaxTagCount(max);
					// 부모 컴포넌트에 총 리뷰 개수 전달
					onStatisticsLoaded?.(response.data.totalReviewCount);
				} else {
					// API 실패 시에도 0으로 전달
					onStatisticsLoaded?.(0);
				}
			} catch (error) {
				console.error('리뷰 통계 조회 오류:', error);
				onStatisticsLoaded?.(0);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStatistics();
	}, [onStatisticsLoaded]);

	if (isLoading) {
		return (
			<div className="bg-white p-3 sm:p-4">
				<div className="animate-pulse space-y-3">
					<div className="h-6 bg-gray-200 rounded w-20"></div>
					<div className="h-10 bg-gray-200 rounded"></div>
					<div className="h-10 bg-gray-200 rounded"></div>
					<div className="h-10 bg-gray-200 rounded"></div>
				</div>
			</div>
		);
	}

	// API 데이터가 있으면 사용, 없으면 기본값 사용
	const averageRating = statistics?.averageRating ?? 0;
	const tagStatistics = (statistics?.tagStatistics && statistics.tagStatistics.length > 0)
		? statistics.tagStatistics
		: DEFAULT_TAGS;

	return (
		<div className="bg-white p-2 sm:p-3 md:p-4">
			{/* 평점 */}
			<div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
				<Star className="text-[#B9AB70] fill-[#B9AB70] w-4 h-4 sm:w-[18px] sm:h-[18px]" />
				<span className="text-sm sm:text-base md:text-lg font-serif text-[#B9AB70]">
					{averageRating.toFixed(1)}
				</span>
			</div>

			{/* 막대 그래프 */}
			<div className="space-y-2 sm:space-y-3">
				{tagStatistics.map((tag) => {
					const percentage = maxTagCount > 0
						? Math.round((tag.reviewCount / maxTagCount) * 100)
						: 0;
					return (
						<div key={tag.tagId} className="flex flex-col w-full">
							<div className="flex justify-between items-start text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">
								<span className="text-gray-700 leading-snug break-words flex-1 pr-2">
									{tag.tagName}
								</span>
								<span className="text-gray-500 whitespace-nowrap">
									({tag.reviewCount.toLocaleString()})
								</span>
							</div>
							<div className="h-3 sm:h-4 md:h-6 bg-[#F7F7F9] rounded-md overflow-hidden">
								<div
									className="h-full bg-[#C7E4E8] transition-all duration-500"
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
