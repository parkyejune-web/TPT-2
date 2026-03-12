/**
 * 구독 플랜 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import type { ApiResponse } from '../apiTypes';
import { API_ENDPOINTS } from '../endpoints';

// ==================== 타입 정의 ====================

/**
 * 구독 플랜 가격 응답 DTO
 */
export interface SubscriptionPlanPriceResponseDTO {
  name: string; // 구독 상품명
  price: number; // 구독 가격
}

// ==================== API 함수 ====================

/**
 * 현재 활성 구독 플랜 조회
 * GET /api/v1/subscription-plans/active
 */
export async function getActiveSubscriptionPlan(): Promise<ApiResponse<SubscriptionPlanPriceResponseDTO[]>> {
  console.log('[subscriptionPlanService] 활성 구독 플랜 조회 요청');

  const response = await fetcher<SubscriptionPlanPriceResponseDTO[]>(
    API_ENDPOINTS.SUBSCRIPTION_PLAN.ACTIVE,
    { method: 'GET' }
  );

  if (response.success) {
    console.log('[subscriptionPlanService] 활성 구독 플랜 조회 성공:', response.data);
  } else {
    console.error('[subscriptionPlanService] 활성 구독 플랜 조회 실패:', response.message);
  }

  return response;
}
