/**
 * 공개 리뷰 목록 조회 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { getReviewList } from '@/Shared/api/services/reviewService';
import type { ReviewResponseDTO, SliceInfo } from '@/Shared/api/apiTypes';

interface UseReviewListReturn {
	reviews: ReviewResponseDTO[];
	sliceInfo: SliceInfo | null;
	isLoading: boolean;
	error: string | null;
	loadMore: () => void;
	refresh: () => void;
	hasMore: boolean;
}

export const useReviewList = (pageSize: number = 12): UseReviewListReturn => {
	const [reviews, setReviews] = useState<ReviewResponseDTO[]>([]);
	const [sliceInfo, setSliceInfo] = useState<SliceInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(0);

	const fetchReviews = useCallback(async (page: number, isRefresh: boolean = false) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await getReviewList(page, pageSize);

			if (response.success && response.data) {
				const { reviews: newReviews, sliceInfo: newSliceInfo } = response.data;

				if (isRefresh) {
					setReviews(newReviews);
				} else {
					setReviews(prev => [...prev, ...newReviews]);
				}
				setSliceInfo(newSliceInfo);
				setCurrentPage(page);
			} else {
				setError(response.message || '리뷰 목록을 불러오는데 실패했습니다.');
				console.error('❌ [리뷰] 목록 조회 실패:', response.message);
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
			setError(errorMessage);
			console.error('❌ [리뷰] 목록 조회 오류:', err);
		} finally {
			setIsLoading(false);
		}
	}, [pageSize]);

	// 초기 로드
	useEffect(() => {
		fetchReviews(0, true);
	}, [fetchReviews]);

	// 더 불러오기
	const loadMore = useCallback(() => {
		if (!isLoading && sliceInfo?.hasNext) {
			fetchReviews(currentPage + 1, false);
		}
	}, [isLoading, sliceInfo, currentPage, fetchReviews]);

	// 새로고침
	const refresh = useCallback(() => {
		setReviews([]);
		setCurrentPage(0);
		fetchReviews(0, true);
	}, [fetchReviews]);

	return {
		reviews,
		sliceInfo,
		isLoading,
		error,
		loadMore,
		refresh,
		hasMore: sliceInfo?.hasNext ?? false,
	};
};
