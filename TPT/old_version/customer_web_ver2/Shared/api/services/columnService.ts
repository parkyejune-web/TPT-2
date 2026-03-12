/**
 * 칼럼 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../apiTypes';

/**
 * 칼럼 목록 조회 (사용자)
 */
export const getColumnList = async (
  page: number = 0,
  size: number = 20,
  categoryId?: number
): Promise<ApiResponse<any>> => {
  let url = `${API_ENDPOINTS.COLUMN.LIST}?page=${page}&size=${size}`;
  if (categoryId) {
    url += `&categoryId=${categoryId}`;
  }
  return fetcher<any>(url, {
    method: 'GET',
  });
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
