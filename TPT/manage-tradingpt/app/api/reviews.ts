import { apiCall, getIsMockMode, mockData } from './base';
import type { ApiResponse } from './base';

// Types
export interface TrainerReply {
  trainerId: number;
  replyContent: string;
  repliedAt: string;
}

export interface Review {
  id: number;
  customerId: number;
  customerName: string;
  uid: string | null;
  phoneNumber: string;
  content: string;
  rating: number; // 1-5 별점
  submittedAt: string;
  trainerReply?: TrainerReply;
  isPublic: boolean;
}

export interface SliceInfo {
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export interface ReviewListResponse {
  reviews: Review[];
  sliceInfo: SliceInfo;
}

// 공개 리뷰 목록 조회 (무한 스크롤)
export async function getPublicReviews(params?: {
  page?: number;
  size?: number;
}): Promise<ApiResponse<ReviewListResponse>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: {
              reviews: mockData.mockReviews || [],
              sliceInfo: {
                currentPage: params?.page || 0,
                pageSize: params?.size || 12,
                hasNext: false,
                isFirst: true,
                isLast: true,
              },
            },
          }),
        300
      )
    );
  }

  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', String(params.page));
  if (params?.size !== undefined) queryParams.append('size', String(params.size));

  const query = queryParams.toString();
  return apiCall<ReviewListResponse>(`/api/v1/admin/reviews${query ? `?${query}` : ''}`, {
    method: 'GET',
  });
}

// 리뷰 답변 작성 (관리자/트레이너)
export async function createReviewReply(
  reviewId: number,
  content: string
): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/reviews/${reviewId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

// 리뷰 공개 여부 변경 (관리자/트레이너)
export async function updateReviewVisibility(
  reviewId: number,
  isPublic: boolean
): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/reviews/${reviewId}/visibility`, {
    method: 'PATCH',
    body: JSON.stringify({ isPublic }),
  });
}

// 리뷰 작성 (관리자용 - 임의 데이터 생성)
export async function createReview(content: string): Promise<ApiResponse<void>> {
  return apiCall<void>('/api/v1/admin/reviews', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

// 리뷰 상세 조회 (관리자/트레이너)
export async function getReviewDetail(reviewId: number): Promise<ApiResponse<Review>> {
  return apiCall<Review>(`/api/v1/admin/reviews/${reviewId}`, {
    method: 'GET',
  });
}

// 리뷰 삭제 (관리자/트레이너)
export async function deleteReview(reviewId: number): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/reviews/${reviewId}`, {
    method: 'DELETE',
  });
}

// 리뷰 답글 삭제 (관리자/트레이너)
export async function deleteReviewReply(reviewId: number): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/reviews/${reviewId}`, {
    method: 'PATCH',
  });
}

// 리뷰 답변 수정 (관리자/트레이너)
export async function updateReviewReply(
  reviewId: number,
  content: string
): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/reviews/${reviewId}/reply`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
}
