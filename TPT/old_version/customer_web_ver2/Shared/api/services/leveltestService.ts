/**
 * 레벨테스트 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse, LeveltestSubmitRequest } from '../apiTypes';

/**
 * 레벨테스트 문제 목록 조회 (무한 스크롤)
 */
export const getLeveltestQuestions = async (
  page: number = 0,
  size: number = 20
): Promise<ApiResponse<any>> => {
  return fetcher<any>(`${API_ENDPOINTS.LEVELTEST.LIST}?page=${page}&size=${size}`, {
    method: 'GET',
  });
};

/**
 * 레벨테스트 제출
 */
export const submitLeveltest = async (
  data: LeveltestSubmitRequest
): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.LEVELTEST.SUBMIT, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * 레벨테스트 시도 상세 조회
 */
export const getLeveltestAttemptDetail = async (attemptId: number): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.LEVELTEST.ATTEMPT_DETAIL(attemptId), {
    method: 'GET',
  });
};

/**
 * 채점 완료된 시도 조회
 */
export const getGradedAttempts = async (): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.LEVELTEST.GRADED_ATTEMPTS, {
    method: 'GET',
  });
};
