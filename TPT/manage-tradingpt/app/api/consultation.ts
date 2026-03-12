import { apiCall, getIsMockMode, mockData } from './base';
import type { ApiResponse } from './base';

// Types
export interface LocalTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface Consultation {
  id: number;
  customerName: string;
  customerPhoneNumber: string;
  date: string; // YYYY-MM-DD
  time: LocalTime | string; // 서버에서 문자열("HH:mm:ss") 또는 LocalTime 객체로 반환 가능
  createdAt: string;
  isProcessed: boolean;
  memo?: string;
}

export interface ConsultationPage {
  content: Consultation[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ConsultationBlockData {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm 형식
}

// 상담 목록 조회 (관리자)
export async function getAdminConsultations(params?: {
  processed?: 'ALL' | 'TRUE' | 'FALSE';
  page?: number;
  size?: number;
}): Promise<ApiResponse<ConsultationPage>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: {
              content: mockData.mockConsultations || [],
              totalElements: (mockData.mockConsultations || []).length,
              totalPages: 1,
              size: params?.size || 20,
              number: params?.page || 0,
              first: true,
              last: true,
              empty: (mockData.mockConsultations || []).length === 0,
            },
          }),
        300
      )
    );
  }

  const queryParams = new URLSearchParams();
  if (params?.processed) queryParams.append('processed', params.processed);
  if (params?.page !== undefined) queryParams.append('page', String(params.page));
  if (params?.size !== undefined) queryParams.append('size', String(params.size));

  const query = queryParams.toString();
  return apiCall<ConsultationPage>(`/api/v1/admin/consultations${query ? `?${query}` : ''}`, {
    method: 'GET',
  });
}

// 상담 수락 (관리자)
export async function acceptConsultation(consultationId: number): Promise<ApiResponse<number>> {
  return apiCall<number>(`/api/v1/admin/consultations/${consultationId}/accept`, {
    method: 'PUT',
  });
}

// 상담 메모 저장/수정 (관리자)
export async function updateConsultationMemo(
  consultationId: number,
  memo: string
): Promise<ApiResponse<number>> {
  return apiCall<number>(`/api/v1/admin/consultations/${consultationId}/memo`, {
    method: 'PUT',
    body: JSON.stringify({ memo }),
  });
}

// 상담 슬롯 차단 생성 (관리자)
export async function createConsultationBlock(
  data: ConsultationBlockData
): Promise<ApiResponse<number>> {
  return apiCall<number>('/api/v1/admin/consultations/blocks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 상담 슬롯 차단 해제 (관리자)
export async function deleteConsultationBlock(
  data: ConsultationBlockData
): Promise<ApiResponse<number>> {
  return apiCall<number>('/api/v1/admin/consultations/blocks', {
    method: 'DELETE',
    body: JSON.stringify(data),
  });
}

// 시간 포맷 유틸리티
export function formatTimeString(time: LocalTime | string): string {
  if (typeof time === 'string') return time;
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}

export function parseTimeString(timeStr: string): LocalTime {
  const [hour, minute] = timeStr.split(':').map(Number);
  return {
    hour,
    minute,
    second: 0,
    nano: 0,
  };
}
