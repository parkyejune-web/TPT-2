/**
 * 주간/월간 매매 일지 통계 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  CreateWeeklyTradingSummaryRequestDTO,
  UpsertWeeklyMemoRequestDTO,
  WeeklyMemoResponseDTO
} from '../apiTypes';

/**
 * 주간 매매 일지 통계 조회
 */
export const getWeeklySummary = async (
  year: number,
  month: number,
  week: number
): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.WEEKLY_TRADING.GET(year, month, week), {
    method: 'GET',
  });
};

/**
 * 주간 매매 일지 통계 작성
 * @deprecated - upsertWeeklyMemo 사용 권장
 */
export const createWeeklySummary = async (
  year: number,
  month: number,
  week: number,
  data: CreateWeeklyTradingSummaryRequestDTO
): Promise<ApiResponse<void>> => {
  console.log('[createWeeklySummary] 요청:', { year, month, week, data });
  const response = await fetcher<void>(API_ENDPOINTS.WEEKLY_TRADING.CREATE(year, month, week), {
    method: 'POST',
    body: JSON.stringify(data),
  });
  console.log('[createWeeklySummary] 응답:', response);
  return response;
};

/**
 * 주간 매매일지 메모 Upsert (Customer)
 * 고객이 자신의 주간 매매일지 메모를 생성하거나 수정합니다. (Upsert 패턴)
 * - 완강 전 (BEFORE_COMPLETION, PENDING_COMPLETION): 메모 작성/수정 가능
 * - 완강 후 (AFTER_COMPLETION): 고객은 메모 수정 불가
 */
export const upsertWeeklyMemo = async (
  year: number,
  month: number,
  week: number,
  data: UpsertWeeklyMemoRequestDTO
): Promise<ApiResponse<WeeklyMemoResponseDTO>> => {
  console.log('[upsertWeeklyMemo] 요청:', { year, month, week, data });
  const response = await fetcher<WeeklyMemoResponseDTO>(
    API_ENDPOINTS.WEEKLY_TRADING.UPSERT_MEMO(year, month, week),
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  console.log('[upsertWeeklyMemo] 응답:', response);
  return response;
};

/**
 * 특정 연도의 월 목록 조회
 */
export const getMonthsInYear = async (year: number): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.MONTHLY_TRADING.GET_YEARS(year), {
    method: 'GET',
  });
};

/**
 * 월간 매매 일지 통계 조회
 */
export const getMonthlySummary = async (year: number, month: number): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.MONTHLY_TRADING.GET_MONTHS(year, month), {
    method: 'GET',
  });
};
