/**
 * 투자 유형 변경 신청 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../apiTypes';

/**
 * 투자 유형
 */
export type InvestmentType = 'SWING' | 'DAY' | 'SCALPING';

/**
 * 변경 신청 상태
 */
export type ChangeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

/**
 * 투자 유형 변경 신청 생성 요청
 */
export interface CreateChangeRequest {
  requestedType: InvestmentType;
  reason?: string;
}

/**
 * 투자 유형 변경 신청 응답
 */
export interface ChangeRequestResponse {
  id: number;
  customerId: number;
  customerName: string;
  currentType: InvestmentType;
  requestedType: InvestmentType;
  status: ChangeRequestStatus;
  reason?: string;
  requestedDate: string; // YYYY-MM-DD 형식
  targetChangeDate: string; // YYYY-MM-DD 형식
  processedAt?: string; // ISO 8601 형식
}

/**
 * 내 변경 신청 목록 조회
 */
export const getMyChangeRequests = async (): Promise<ApiResponse<ChangeRequestResponse[]>> => {
  return fetcher<ChangeRequestResponse[]>(API_ENDPOINTS.INVESTMENT_TYPE_CHANGE.LIST, {
    method: 'GET',
  });
};

/**
 * 투자 유형 변경 신청
 */
export const createChangeRequest = async (
  data: CreateChangeRequest
): Promise<ApiResponse<ChangeRequestResponse>> => {
  return fetcher<ChangeRequestResponse>(API_ENDPOINTS.INVESTMENT_TYPE_CHANGE.CREATE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * 변경 신청 상세 조회
 */
export const getChangeRequest = async (
  requestId: number
): Promise<ApiResponse<ChangeRequestResponse>> => {
  return fetcher<ChangeRequestResponse>(API_ENDPOINTS.INVESTMENT_TYPE_CHANGE.DETAIL(requestId), {
    method: 'GET',
  });
};

/**
 * 변경 신청 취소
 */
export const cancelChangeRequest = async (requestId: number): Promise<ApiResponse<void>> => {
  return fetcher<void>(API_ENDPOINTS.INVESTMENT_TYPE_CHANGE.DELETE(requestId), {
    method: 'DELETE',
  });
};
