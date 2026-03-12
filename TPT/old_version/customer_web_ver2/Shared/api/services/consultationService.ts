/**
 * 상담 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../apiTypes';

/**
 * 상담 예약 생성 요청 타입
 */
export interface ConsultationCreateRequest {
  date: string; // YYYY-MM-DD 형식
  time: string; // HH:MM:SS 형식
}

/**
 * 상담 예약 수정 요청 타입
 */
export interface ConsultationUpdateRequest {
  oldConsultationId: number;
  newDate: string; // YYYY-MM-DD 형식
  newTime: string; // HH:MM:SS 형식
}

/**
 * 상담 응답 타입
 */
export interface ConsultationResponse {
  id: number;
  date: string; // YYYY-MM-DD 형식
  time: string; // HH:MM:SS 형식
}

/**
 * 시간대 슬롯 타입
 */
export type TimeSlot = "H09" | "H10" | "H11" | "H13" | "H14" | "H15" | "H16" | "H17" | "H18";

/**
 * 상담 가능 시간대 DTO
 */
export interface SlotAvailabilityDTO {
  timeSlot: TimeSlot;
  available: boolean;
}

/**
 * 내 상담 예약 목록 조회
 */
export const getMyConsultations = async (): Promise<ApiResponse<ConsultationResponse[]>> => {
  return fetcher<ConsultationResponse[]>(API_ENDPOINTS.CONSULTATION.MY_LIST, {
    method: 'GET',
  });
};

/**
 * 상담 예약 생성
 */
export const createConsultation = async (
  data: ConsultationCreateRequest
): Promise<ApiResponse<number>> => {
  return fetcher<number>(API_ENDPOINTS.CONSULTATION.CREATE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * 상담 예약 수정
 */
export const updateConsultation = async (
  data: ConsultationUpdateRequest
): Promise<ApiResponse<number>> => {
  return fetcher<number>(API_ENDPOINTS.CONSULTATION.UPDATE, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * 상담 예약 삭제
 */
export const deleteConsultation = async (consultationId: number): Promise<ApiResponse<void>> => {
  return fetcher<void>(API_ENDPOINTS.CONSULTATION.DELETE(consultationId), {
    method: 'DELETE',
  });
};

/**
 * 특정 날짜의 상담 가능 시간대 조회
 */
export const getConsultationAvailability = async (date: string): Promise<ApiResponse<SlotAvailabilityDTO[]>> => {
  return fetcher<SlotAvailabilityDTO[]>(`${API_ENDPOINTS.CONSULTATION.AVAILABILITY}?date=${date}`, {
    method: 'GET',
  });
};
