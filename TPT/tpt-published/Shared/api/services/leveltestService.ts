/**
 * 레벨테스트 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  LeveltestSubmitRequest,
  LeveltestAttemptSubmitResponse,
  LeveltestAttemptListResponseDTO,
  LeveltestAttemptDetailResponseDTO
} from '../apiTypes';

/**
 * 레벨테스트 문제 목록 조회 (무한 스크롤)
 */
export const getLeveltestQuestions = async (
  page: number = 0,
  size: number = 20
): Promise<ApiResponse<any>> => {
  console.log(`[getLeveltestQuestions] 요청 - page: ${page}, size: ${size}`);
  const response = await fetcher<any>(`${API_ENDPOINTS.LEVELTEST.LIST}?page=${page}&size=${size}`, {
    method: 'GET',
  });
  console.log('[getLeveltestQuestions] 응답:', response);
  return response;
};

/**
 * 레벨테스트 제출
 */
export const submitLeveltest = async (
  data: LeveltestSubmitRequest
): Promise<ApiResponse<LeveltestAttemptSubmitResponse>> => {
  console.log('[submitLeveltest] 요청:', data);
  const response = await fetcher<LeveltestAttemptSubmitResponse>(API_ENDPOINTS.LEVELTEST.SUBMIT, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  console.log('[submitLeveltest] 응답:', response);
  return response;
};

/**
 * 레벨테스트 시도 상세 조회
 */
export const getLeveltestAttemptDetail = async (
  attemptId: number
): Promise<ApiResponse<LeveltestAttemptDetailResponseDTO>> => {
  console.log(`[getLeveltestAttemptDetail] 요청 - attemptId: ${attemptId}`);
  const response = await fetcher<LeveltestAttemptDetailResponseDTO>(
    API_ENDPOINTS.LEVELTEST.ATTEMPT_DETAIL(attemptId),
    {
      method: 'GET',
    }
  );
  console.log('[getLeveltestAttemptDetail] 응답:', response);
  return response;
};

/**
 * 채점 완료된 시도 조회
 */
export const getGradedAttempts = async (): Promise<ApiResponse<LeveltestAttemptListResponseDTO[]>> => {
  console.log('[getGradedAttempts] 요청');
  const response = await fetcher<LeveltestAttemptListResponseDTO[]>(
    API_ENDPOINTS.LEVELTEST.GRADED_ATTEMPTS,
    {
      method: 'GET',
    }
  );
  console.log('[getGradedAttempts] 응답:', response);
  return response;
};
