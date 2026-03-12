import { apiCall, getIsMockMode, mockData } from './index';
import type { ApiResponse } from './index';

interface PendingUser {
  userId: number;
  name: string;
  phone: string;
  createdAt: string;
  status: string;
  uid: string;
}

interface UserStatusResponse {
  success: boolean;
  message?: string;
}

interface GrantTokenResponse {
  success: boolean;
  message?: string;
}

// 회원 검색 결과 인터페이스
export interface SearchedUser {
  userId: number;
  name: string;
  phoneNumber: string;
  uid: string;
  status: string;
  requestedAt: string;
}

export interface PagedSearchResult {
  content: SearchedUser[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 신규 구독 고객 인터페이스
export interface LevelTestInfo {
  status: string | null;
  grade: string | null;
  gradingTrainerName: string | null;
}

export interface NewSubscriptionCustomer {
  customerId: number;
  name: string;
  phoneNumber: string;
  hasAttemptedLevelTest: boolean;
  levelTestInfo: LevelTestInfo | null;
  hasConsultation: boolean;
  assignedTrainerName: string | null;
}

export interface SliceNewSubscriptionCustomerResponse {
  content: NewSubscriptionCustomer[];
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 미구독(무료) 고객 인터페이스
export interface FreeCustomer {
  customerId: number;
  name: string;
  phoneNumber: string;
  primaryInvestmentType: string | null;
  token: number;
  createdAt: string;
}

export interface SliceFreeCustomerResponse {
  content: FreeCustomer[];
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 신규 가입자 목록 조회
export async function getPendingUsers(): Promise<ApiResponse<PendingUser[]>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, data: mockData.mockPendingUsers }), 300)
    );
  }
  return apiCall('/api/v1/admin/users/pending', { method: 'GET' });
}

// UID 승인/거절 처리
export async function updateUserStatus(
  userId: number,
  status: 'UID_APPROVED' | 'UID_REJECTED'
): Promise<ApiResponse<UserStatusResponse>> {
  return apiCall(`/api/v1/admin/users/${userId}/status?status=${status}`, {
    method: 'PATCH',
  });
}

// 고객에게 토큰 부여
export async function grantUserToken(
  userId: number,
  tokenCount: number
): Promise<ApiResponse<GrantTokenResponse>> {
  return apiCall(`/api/v1/admin/users/${userId}/token`, {
    method: 'PATCH',
    body: JSON.stringify({ tokenCount }),
  });
}

// UID로 회원 검색 (페이지네이션)
export async function searchUsersByUid(
  uid: string,
  page: number = 0,
  size: number = 20
): Promise<ApiResponse<PagedSearchResult>> {
  return apiCall(`/api/v1/admin/users/search-by-uid?uid=${encodeURIComponent(uid)}&page=${page}&size=${size}`, {
    method: 'GET',
  });
}

// 이름으로 회원 검색 (페이지네이션)
export async function searchUsersByName(
  name: string,
  page: number = 0,
  size: number = 20
): Promise<ApiResponse<PagedSearchResult>> {
  return apiCall(`/api/v1/admin/users/search-by-name?name=${encodeURIComponent(name)}&page=${page}&size=${size}`, {
    method: 'GET',
  });
}

// 신규 구독 고객 목록 조회
export async function getNewSubscriptionCustomers(
  page: number = 0,
  size: number = 20
): Promise<ApiResponse<SliceNewSubscriptionCustomerResponse>> {
  return apiCall(`/api/v1/admin/users/new-subscription-customers?page=${page}&size=${size}`, {
    method: 'GET',
  });
}

// 미구독(무료) 고객 목록 조회
export async function getFreeCustomers(
  page: number = 0,
  size: number = 20,
  sort: string = 'createdAt,desc'
): Promise<ApiResponse<SliceFreeCustomerResponse>> {
  return apiCall(`/api/v1/admin/users/free-customers?page=${page}&size=${size}&sort=${sort}`, {
    method: 'GET',
  });
}

// 특정 유저 UID 값 변경
export async function updateUserUid(
  userId: number,
  newUid: string
): Promise<ApiResponse<void>> {
  return apiCall(`/api/v1/admin/users/${userId}/uid`, {
    method: 'PATCH',
    body: JSON.stringify({ uid: newUid }),
  });
}
