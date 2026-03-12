/**
 * 칼럼 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse, PageColumnListResponseDTO } from '../apiTypes';

/**
 * 칼럼 목록 조회 (사용자)
 * @param page 페이지 번호 (0부터 시작)
 * @param size 페이지 크기
 * @param category 카테고리명 (All, 성장일지, 트레이더 칼럼 등)
 */
export const getColumnList = async (
  page: number = 0,
  size: number = 20,
  category: string = 'All'
): Promise<ApiResponse<PageColumnListResponseDTO>> => {
  const url = `${API_ENDPOINTS.COLUMN.LIST}?page=${page}&size=${size}&category=${encodeURIComponent(category)}`;
  console.log(`📰 [칼럼] 목록 조회 요청 - page: ${page}, size: ${size}, category: ${category}`);

  const response = await fetcher<PageColumnListResponseDTO>(url, {
    method: 'GET',
  });

  console.log(`📰 [칼럼] 목록 조회 결과:`, response);
  return response;
};

/**
 * 칼럼 상세 조회
 */
export const getColumnDetail = async (columnId: number): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.COLUMN.DETAIL(columnId), {
    method: 'GET',
  });
};

/**
 * 칼럼 카테고리 목록 조회
 */
export const getColumnCategories = async (): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.COLUMN.CATEGORIES, {
    method: 'GET',
  });
};

/**
 * 칼럼 좋아요
 */
export const likeColumn = async (columnId: number): Promise<ApiResponse<void>> => {
  return fetcher<void>(API_ENDPOINTS.COLUMN.LIKE(columnId), {
    method: 'POST',
  });
};

/**
 * 칼럼 댓글 작성
 */
export const createColumnComment = async (
  columnId: number,
  data: any
): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.COLUMN.COMMENT(columnId), {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * 칼럼 댓글 수정
 */
export const updateColumnComment = async (
  columnId: number,
  commentId: number,
  data: any
): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.COLUMN.UPDATE_COMMENT(columnId, commentId), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * 칼럼 댓글 삭제
 */
export const deleteColumnComment = async (
  columnId: number,
  commentId: number
): Promise<ApiResponse<void>> => {
  return fetcher<void>(API_ENDPOINTS.COLUMN.DELETE_COMMENT(columnId, commentId), {
    method: 'DELETE',
  });
};
