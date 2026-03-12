"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Edit, X } from "lucide-react";
import ReviewSummary from "./ReviewSummary";
import { useReviewList } from "./hooks/useReviewList";
import { useAuthStore } from "../../../../Shared/store/authStore";
import type { ReviewResponseDTO } from "../../../../Shared/api/apiTypes";

// 숫자 애니메이션 컴포넌트
const RollingNumber = ({ value }: { value: number }) => {
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		let start = 0;
		const end = value;
		const duration = 1500; // 1.5초
		const stepTime = 20; // 20ms마다 증가
		const increment = Math.ceil(end / (duration / stepTime));

		const timer = setInterval(() => {
			start += increment;
			if (start >= end) {
				start = end;
				clearInterval(timer);
			}
			setDisplayValue(start);
		}, stepTime);

		return () => clearInterval(timer);
	}, [value]);

	return (
		<span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-[#B9AB70] tracking-wide">
			{displayValue.toLocaleString()}
		</span>
	);
};

// 날짜 포맷 함수
const formatDate = (dateString: string): string => {
	try {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${year}.${month}.${day}.${hours}:${minutes}`;
	} catch {
		return dateString;
	}
};

export default function ReviewPage() {
	const router = useRouter();
	const { user } = useAuthStore();
	const { reviews, isLoading, error, loadMore, hasMore } = useReviewList(12);
	const [totalReviewCount, setTotalReviewCount] = useState<number>(0);
	const [selectedReview, setSelectedReview] = useState<ReviewResponseDTO | null>(null);

	// UID_REVIEW_PENDING 또는 UID_REJECTED 상태가 아닌 경우에만 후기 작성 버튼 표시
	const canWriteReview = user?.userStatus !== 'UID_REVIEW_PENDING' && user?.userStatus !== 'UID_REJECTED';

	// ReviewSummary에서 통계 데이터를 받아 누적 리뷰 개수 업데이트
	const handleStatisticsLoaded = useCallback((count: number) => {
		setTotalReviewCount(count);
	}, []);

	// 후기 작성 페이지로 이동
	const handleWriteReview = () => {
		router.push('/my/review');
	};

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 pb-50">
			{/* 제목 및 후기 작성 버튼 */}
			<div className="flex items-center justify-between mt-10 sm:mt-16 md:mt-20 mb-3 sm:mb-4">
				<div className="flex-1 hidden sm:block" />
				<h1 className="text-[13px] sm:text-xl md:text-2xl lg:text-3xl text-center flex-1 font-medium whitespace-nowrap">
					TPT 이용 고객의 실제 후기를 만나보세요.
				</h1>
				<div className="flex-1 flex justify-end">
					{canWriteReview && (
						<button
							onClick={handleWriteReview}
							className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-[#B9AB70] text-white rounded-md hover:bg-[#a89a60] transition-colors text-xs sm:text-sm font-medium"
						>
							<Edit size={14} className="sm:w-4 sm:h-4" />
							<span className="hidden sm:inline">후기 작성</span>
							<span className="sm:hidden">작성</span>
						</button>
					)}
				</div>
			</div>

			{/* 상단 고정 영역 */}
			<div className="sticky top-0 z-10 bg-white py-4 sm:py-6 flex flex-col items-center gap-4 sm:gap-6 lg:gap-10">

				{/* 상단 콘텐츠 묶음 */}
				<div className="w-full flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
					{/* 왼쪽: 누적 리뷰 개수 */}
					<div className="flex flex-col items-center justify-center sm:items-start gap-1 sm:gap-2">
						<span className="text-[#B9AB70] font-medium text-xs sm:text-sm md:text-base">
							누적 리뷰 개수
						</span>
						<RollingNumber value={totalReviewCount} />
					</div>

					{/* 오른쪽: 리뷰 요약 */}
					<div className="w-full sm:w-2/3 lg:w-1/2">
						<ReviewSummary onStatisticsLoaded={handleStatisticsLoaded} />
					</div>
				</div>
			</div>

			{/* 로딩 상태 */}
			{isLoading && reviews.length === 0 && (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B9AB70]"></div>
					<span className="ml-3 text-gray-500">리뷰를 불러오는 중...</span>
				</div>
			)}

			{/* 에러 상태 */}
			{error && reviews.length === 0 && (
				<div className="flex justify-center items-center py-12">
					<p className="text-red-500">{error}</p>
				</div>
			)}

			{/* 리뷰 없음 상태 */}
			{!isLoading && !error && reviews.length === 0 && (
				<div className="flex justify-center items-center py-12">
					<p className="text-gray-500">아직 등록된 리뷰가 없습니다.</p>
				</div>
			)}

			{/* 리뷰 리스트 */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6">
				{reviews.map((review) => (
					<div
						key={review.id}
						className="bg-white rounded-lg p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 shadow-sm border border-gray-100"
					>
						{/* 아이디 + 별점 */}
						<div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-gray-200">
							<span className="text-xs sm:text-sm font-medium text-[#B9AB70]">{review.customerName}</span>
							<div className="flex items-center gap-0.5 sm:gap-1 text-[#B9AB70] text-xs sm:text-sm">
								<span>★</span>
								<span>{review.rating?.toFixed(1) ?? '5.0'}</span>
							</div>
						</div>

						{/* 후기 본문 (스크롤 가능 영역) */}
						<div
							className="text-xs sm:text-sm text-gray-800 leading-relaxed max-h-32 sm:max-h-40 overflow-y-auto review-content"
							dangerouslySetInnerHTML={{ __html: review.content }}
						/>

						{/* 트레이너 답변 */}
						{review.trainerReply && (
							<div className="bg-gray-50 rounded-md p-2 sm:p-3 mt-1 sm:mt-2">
								<p className="text-[10px] sm:text-xs text-[#B9AB70] font-medium mb-0.5 sm:mb-1">
									{review.trainerReply.trainerName ? `${review.trainerReply.trainerName} 트레이너 답변` : '트레이너 답변'}
								</p>
								<p className="text-xs sm:text-sm text-gray-600">
									{review.trainerReply.replyContent}
								</p>
							</div>
						)}

						{/* 날짜 + 자세히 보기 버튼 */}
						<div className="flex items-center justify-between mt-2">
							<p className="text-[10px] sm:text-xs text-gray-400">{formatDate(review.submittedAt)}</p>
							<button
								onClick={() => setSelectedReview(review)}
								className="text-[10px] sm:text-xs text-[#B9AB70] hover:text-[#a89a60] font-medium transition-colors cursor-pointer"
							>
								자세히 보기
							</button>
						</div>
					</div>
				))}
			</div>

			{/* 더 보기 버튼 */}
			{hasMore && (
				<div className="flex justify-center py-4 sm:py-6">
					<button
						onClick={loadMore}
						disabled={isLoading}
						className="px-4 sm:px-6 py-2 bg-[#B9AB70] text-white rounded-md hover:bg-[#a89a60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
					>
						{isLoading ? '불러오는 중...' : '더 보기'}
					</button>
				</div>
			)}

			{/* 추가 로딩 인디케이터 */}
			{isLoading && reviews.length > 0 && (
				<div className="flex justify-center items-center py-4">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B9AB70]"></div>
				</div>
			)}

			{/* 리뷰 상세 보기 모달 */}
			{selectedReview && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* 배경 오버레이 */}
					<div
						className="absolute inset-0 bg-black/50"
						onClick={() => setSelectedReview(null)}
					/>

					{/* 모달 컨텐츠 */}
					<div className="relative bg-white rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl">
						{/* 헤더 */}
						<div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
							<div className="flex items-center gap-3">
								<span className="text-base sm:text-lg font-semibold text-[#B9AB70]">
									{selectedReview.customerName}
								</span>
								<div className="flex items-center gap-1 text-[#B9AB70]">
									<span className="text-lg">★</span>
									<span className="text-base font-medium">{selectedReview.rating?.toFixed(1) ?? '5.0'}</span>
								</div>
							</div>
							<button
								onClick={() => setSelectedReview(null)}
								className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
							>
								<X size={24} className="text-gray-500" />
							</button>
						</div>

						{/* 본문 */}
						<div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
							{/* 후기 내용 */}
							<div
								className="text-sm sm:text-base text-gray-800 leading-relaxed review-content"
								dangerouslySetInnerHTML={{ __html: selectedReview.content }}
							/>

							{/* 트레이너 답변 */}
							{selectedReview.trainerReply && (
								<div className="mt-6 bg-gray-50 rounded-lg p-4">
									<p className="text-sm text-[#B9AB70] font-semibold mb-2">
										{selectedReview.trainerReply.trainerName ? `${selectedReview.trainerReply.trainerName} 트레이너 답변` : '트레이너 답변'}
									</p>
									<p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
										{selectedReview.trainerReply.replyContent}
									</p>
								</div>
							)}

							{/* 날짜 */}
							<p className="text-xs sm:text-sm text-gray-400 mt-6 text-right">
								{formatDate(selectedReview.submittedAt)} 작성
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
