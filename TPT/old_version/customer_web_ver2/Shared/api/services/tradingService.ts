/**
 * 주간/월간 매매 일지 통계 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../apiTypes';

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
 */
export const createWeeklySummary = async (
  year: number,
  month: number,
  week: number,
  data: any
): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.WEEKLY_TRADING.CREATE(year, month, week), {
    method: 'POST',
    body: JSON.stringify(data),
  });
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
