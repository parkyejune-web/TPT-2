import { apiCall } from './index';
import type { ApiResponse } from './index';

// 이벤트 응답 인터페이스
export interface EventResponse {
  id: number;
  name: string;
  startAt: string;
  endAt: string;
  tokenAmount: number;
  active: boolean;
}

export interface PagedEventResponse {
  content: EventResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 이벤트 생성 요청 인터페이스
export interface EventCreateRequest {
  name: string;
  startAt: string;
  endAt: string;
  tokenAmount: number;
}

// 이벤트 수정 요청 인터페이스
export interface EventUpdateRequest {
  name: string;
  startAt: string;
  endAt: string;
  tokenAmount: number;
  active: boolean;
}

// 이벤트 목록 조회 (관리자)
export async function getEvents(
  page: number = 0,
  size: number = 20,
  onlyActive: boolean = false
): Promise<ApiResponse<PagedEventResponse>> {
  return apiCall(`/api/v1/admin/events?page=${page}&size=${size}&onlyActive=${onlyActive}`, {
    method: 'GET',
  });
}

// 이벤트 단건 조회 (관리자)
export async function getEvent(eventId: number): Promise<ApiResponse<EventResponse>> {
  return apiCall(`/api/v1/admin/events/${eventId}`, {
    method: 'GET',
  });
}

// 이벤트 생성 (관리자)
export async function createEvent(data: EventCreateRequest): Promise<ApiResponse<number>> {
  return apiCall('/api/v1/admin/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 이벤트 수정 (관리자)
export async function updateEvent(eventId: number, data: EventUpdateRequest): Promise<ApiResponse<number>> {
  return apiCall(`/api/v1/admin/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 이벤트 삭제 (관리자)
export async function deleteEvent(eventId: number): Promise<ApiResponse<number>> {
  return apiCall(`/api/v1/admin/events/${eventId}`, {
    method: 'DELETE',
  });
}
