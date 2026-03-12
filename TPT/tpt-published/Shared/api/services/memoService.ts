/**
 * 메모(오답노트) 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import type { ApiResponse } from '../apiTypes';

export interface MemoData {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoRequest {
  title: string;
  content: string;
}

/**
 * 내 메모 조회
 */
export async function getMemo(): Promise<ApiResponse<MemoData>> {
  return fetcher<MemoData>('/api/v1/memos', {
    method: 'GET',
  });
}

/**
 * 메모 생성/수정 (Upsert)
 */
export async function createOrUpdateMemo(data: MemoRequest): Promise<ApiResponse<MemoData>> {
  return fetcher<MemoData>('/api/v1/memos', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 메모 삭제
 */
export async function deleteMemo(): Promise<ApiResponse<void>> {
  return fetcher<void>('/api/v1/memos', {
    method: 'DELETE',
  });
}
