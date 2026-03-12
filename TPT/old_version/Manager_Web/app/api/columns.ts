import { apiCall, getIsMockMode } from './base';
import type { ApiResponse } from './base';

// Types
export interface Column {
  columnId: number;
  title: string;
  subtitle: string;
  content?: string;
  categoryName: string;
  writerName: string;
  likeCount: number;
  commentCount: number;
  isBest: boolean;
  createdAt: string;
  updatedAt: string;
  fontFamily?: string; // 확장성을 위한 폰트 패밀리
}

export interface ColumnPage {
  content: Column[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ColumnCategory {
  id: number;
  name: string;
  color: string;
  createdAt: string;
}

export interface ColumnComment {
  commentId: number;
  content: string;
  writerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnDetail {
  columnId: number;
  title: string;
  subtitle: string;
  content: string;
  categoryName: string;
  writerName: string;
  profileImageUrl?: string;
  likeCount: number;
  commentCount: number;
  isBest: boolean;
  createdAt: string;
  updatedAt: string;
  comments: ColumnComment[];
  fontFamily?: string;
}

export interface ColumnCreateRequest {
  title: string;
  subtitle: string;
  content: string;
  category: string;
  writerName: string;
  fontFamily?: string;
  thumbnailImage?: string;
}

export interface ColumnUpdateRequest {
  title: string;
  subtitle: string;
  content: string;
  category: string;
  writerName: string;
  fontFamily?: string;
  thumbnailImage?: string;
}

export interface CategoryCreateRequest {
  name: string;
  color: string;
}

export interface CategoryUpdateRequest {
  name: string;
  color: string;
}

export interface CommentCreateRequest {
  content: string;
}

// 칼럼 목록 조회
export async function getColumns(params?: {
  page?: number;
  size?: number;
  sort?: string;
}): Promise<ApiResponse<ColumnPage>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: {
              content: [],
              totalElements: 0,
              totalPages: 1,
              size: params?.size || 20,
              number: params?.page || 0,
              first: true,
              last: true,
              empty: true,
            },
          }),
        300
      )
    );
  }

  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', String(params.page));
  if (params?.size !== undefined) queryParams.append('size', String(params.size));
  if (params?.sort) queryParams.append('sort', params.sort);

  const query = queryParams.toString();
  return apiCall<ColumnPage>(`/api/v1/admin/columns${query ? `?${query}` : ''}`, {
    method: 'GET',
  });
}

// 칼럼 상세 조회
export async function getColumnDetail(columnId: number): Promise<ApiResponse<ColumnDetail>> {
  if (getIsMockMode()) {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({ success: false, error: 'Not found' }),
        300
      );
    });
  }

  return apiCall<ColumnDetail>(`/api/v1/admin/columns/${columnId}`, {
    method: 'GET',
  });
}

// 칼럼 작성
export async function createColumn(
  data: ColumnCreateRequest
): Promise<ApiResponse<number>> {
  return apiCall<number>('/api/v1/admin/columns', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 칼럼 수정
export async function updateColumn(
  columnId: number,
  data: ColumnUpdateRequest
): Promise<ApiResponse<number>> {
  return apiCall<number>(`/api/v1/admin/columns/${columnId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 칼럼 삭제
export async function deleteColumn(columnId: number): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/columns/${columnId}`, {
    method: 'DELETE',
  });
}

// 베스트 칼럼 지정 (토글 방식 - body 없음)
export async function toggleBestColumn(
  columnId: number
): Promise<ApiResponse<number>> {
  return apiCall<number>(`/api/v1/admin/columns/${columnId}/best`, {
    method: 'PATCH',
  });
}

// 댓글 작성
export async function createComment(
  columnId: number,
  data: CommentCreateRequest
): Promise<ApiResponse<number>> {
  return apiCall<number>(`/api/v1/admin/columns/${columnId}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 카테고리 목록 조회
export async function getCategories(): Promise<ApiResponse<ColumnCategory[]>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: [],
          }),
        300
      )
    );
  }

  return apiCall<ColumnCategory[]>('/api/v1/admin/columns/categories', {
    method: 'GET',
  });
}

// 카테고리 생성
export async function createCategory(
  data: CategoryCreateRequest
): Promise<ApiResponse<number>> {
  return apiCall<number>('/api/v1/admin/columns/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 카테고리 수정
export async function updateCategory(
  categoryId: number,
  data: CategoryUpdateRequest
): Promise<ApiResponse<number>> {
  return apiCall<number>(`/api/v1/admin/columns/categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 카테고리 삭제
export async function deleteCategory(categoryId: number): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/columns/categories/${categoryId}`, {
    method: 'DELETE',
  });
}
