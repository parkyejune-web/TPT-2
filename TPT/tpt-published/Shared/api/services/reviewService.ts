/**
 * 리뷰 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  PublicReviewListResponseDTO,
  ReviewResponseDTO,
  CreateReviewRequestDTO,
  ReviewTagResponseDTO,
  ReviewStatisticsResponseDTO,
} from '../apiTypes';

/**
 * 공개 리뷰 목록 조회 (무한 스크롤)
 * @param page 페이지 번호 (0부터 시작)
 * @param size 페이지 크기 (기본값: 12)
 */
export const getReviewList = async (page: number = 0, size: number = 12): Promise<ApiResponse<PublicReviewListResponseDTO>> => {
  console.log(`📋 [리뷰] 공개 리뷰 목록 조회 요청 - page: ${page}, size: ${size}`);
  const response = await fetcher<PublicReviewListResponseDTO>(`${API_ENDPOINTS.REVIEW.LIST}?page=${page}&size=${size}`, {
    method: 'GET',
  });
  console.log(`📋 [리뷰] 공개 리뷰 목록 조회 응답:`, response);
  return response;
};

/**
 * 리뷰 작성
 * API 명세: application/json, { content: string, rating: number, tagIds?: number[] }
 */
export const createReview = async (data: CreateReviewRequestDTO): Promise<ApiResponse<void>> => {
  console.log(`📋 [리뷰] 리뷰 작성 요청`, data);

  const response = await fetcher<void>(API_ENDPOINTS.REVIEW.CREATE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  console.log(`📋 [리뷰] 리뷰 작성 응답:`, response);
  return response;
};

/**
 * 리뷰 태그 목록 조회
 */
export const getReviewTags = async (): Promise<ApiResponse<ReviewTagResponseDTO[]>> => {
  console.log(`📋 [리뷰] 태그 목록 조회 요청`);
  const response = await fetcher<ReviewTagResponseDTO[]>(API_ENDPOINTS.REVIEW.TAGS, {
    method: 'GET',
  });
  console.log(`📋 [리뷰] 태그 목록 조회 응답:`, response);
  return response;
};

/**
 * 리뷰 통계 조회
 */
export const getReviewStatistics = async (): Promise<ApiResponse<ReviewStatisticsResponseDTO>> => {
  console.log(`📋 [리뷰] 통계 조회 요청`);
  const response = await fetcher<ReviewStatisticsResponseDTO>(API_ENDPOINTS.REVIEW.STATISTICS, {
    method: 'GET',
  });
  console.log(`📋 [리뷰] 통계 조회 응답:`, response);
  return response;
};

/**
 * 리뷰 상세 조회 (공개용)
 */
export const getReviewDetail = async (reviewId: number): Promise<ApiResponse<ReviewResponseDTO>> => {
  console.log(`📋 [리뷰] 리뷰 상세 조회 요청 - reviewId: ${reviewId}`);
  const response = await fetcher<ReviewResponseDTO>(API_ENDPOINTS.REVIEW.DETAIL(reviewId), {
    method: 'GET',
  });
  console.log(`📋 [리뷰] 리뷰 상세 조회 응답:`, response);
  return response;
};

/**
 * 내 리뷰 목록 조회
 */
export const getMyReviewList = async (): Promise<ApiResponse<ReviewResponseDTO[]>> => {
  console.log(`📋 [리뷰] 내 리뷰 목록 조회 요청`);
  const response = await fetcher<ReviewResponseDTO[]>(API_ENDPOINTS.REVIEW.MY_LIST, {
    method: 'GET',
  });
  console.log(`📋 [리뷰] 내 리뷰 목록 조회 응답:`, response);
  return response;
};

/**
 * 내 리뷰 상세 조회
 */
export const getMyReviewDetail = async (reviewId: number): Promise<ApiResponse<ReviewResponseDTO>> => {
  console.log(`📋 [리뷰] 내 리뷰 상세 조회 요청 - reviewId: ${reviewId}`);
  const response = await fetcher<ReviewResponseDTO>(API_ENDPOINTS.REVIEW.MY_DETAIL(reviewId), {
    method: 'GET',
  });
  console.log(`📋 [리뷰] 내 리뷰 상세 조회 응답:`, response);
  return response;
};
