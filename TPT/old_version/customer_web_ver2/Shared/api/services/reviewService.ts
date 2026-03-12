/**
 * 리뷰 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse, } from '../apiTypes';

/**
 * 공개 리뷰 목록 조회 (무한 스크롤)
 */
export const getReviewList = async (page: number = 0, size: number = 20): Promise<ApiResponse<any>> => {
  return fetcher<any>(`${API_ENDPOINTS.REVIEW.LIST}?page=${page}&size=${size}`, {
    method: 'GET',
  });
};

/**
 * 리뷰 작성
 */
export const createReview = async (data: any): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append('content', data.content);
  formData.append('rating', String(data.rating));
  if (data.image) {
    formData.append('image', data.image);
  }

  return fetcher<any>(API_ENDPOINTS.REVIEW.CREATE, {
    method: 'POST',
    body: formData,
    // FormData는 자동으로 Content-Type 설정되므로 headers 생략
  });
};

/**
 * 리뷰 상세 조회 (공개용)
 */
export const getReviewDetail = async (reviewId: number): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.REVIEW.DETAIL(reviewId), {
    method: 'GET',
  });
};

/**
 * 내 리뷰 목록 조회
 */
export const getMyReviewList = async (): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.REVIEW.MY_LIST, {
    method: 'GET',
  });
};

/**
 * 내 리뷰 상세 조회
 */
export const getMyReviewDetail = async (reviewId: number): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.REVIEW.MY_DETAIL(reviewId), {
    method: 'GET',
  });
};
