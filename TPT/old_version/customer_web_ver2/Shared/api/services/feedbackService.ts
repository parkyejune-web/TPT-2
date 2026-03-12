/**
 * 피드백 요청 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../apiTypes';

/**
 * 스윙 피드백 요청 생성
 */
export const createSwingFeedback = async (data: FormData): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.FEEDBACK_REQUEST.CREATE_SWING, {
    method: 'POST',
    body: data,
    // FormData는 자동으로 Content-Type 설정되므로 headers 생략
  });
};

/**
 * 데이 트레이딩 피드백 요청 생성
 */
export const createDayFeedback = async (data: FormData): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.FEEDBACK_REQUEST.CREATE_DAY, {
    method: 'POST',
    body: data,
  });
};

/**
 * 스켈핑 피드백 요청 생성
 */
export const createScalpingFeedback = async (data: FormData): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.FEEDBACK_REQUEST.CREATE_SCALPING, {
    method: 'POST',
    body: data,
  });
};

/**
 * 피드백 목록 조회 (무한 스크롤)
 */
export const getFeedbackList = async (page: number = 0, size: number = 20): Promise<ApiResponse<any>> => {
  return fetcher<any>(`${API_ENDPOINTS.FEEDBACK_REQUEST.LIST}?page=${page}&size=${size}`, {
    method: 'GET',
  });
};

/**
 * 피드백 상세 조회
 */
export const getFeedbackDetail = async (feedbackRequestId: number): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.FEEDBACK_REQUEST.DETAIL(feedbackRequestId), {
    method: 'GET',
  });
};

/**
 * 피드백 삭제
 */
export const deleteFeedback = async (feedbackRequestId: number): Promise<ApiResponse<void>> => {
  return fetcher<void>(API_ENDPOINTS.FEEDBACK_REQUEST.DELETE(feedbackRequestId), {
    method: 'DELETE',
  });
};

/**
 * 특정 날짜의 피드백 요청 목록 조회
 */
export const getFeedbackByDate = async (
  year: number,
  month: number,
  day: number
): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.FEEDBACK_REQUEST.BY_DATE(year, month, day), {
    method: 'GET',
  });
};

/**
 * 월별 PnL 달력 조회
 */
export const getPnLCalendar = async (year: number, month: number): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.FEEDBACK_REQUEST.PNL_CALENDAR(year, month), {
    method: 'GET',
  });
};
