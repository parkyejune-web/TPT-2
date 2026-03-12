import { apiCall, BASE_URL } from './index';
import { updateXsrfTokenFromResponse } from '../utils/xsrfToken';
import type { ApiResponse } from './index';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: any;
}

// 관리자 로그인
export async function adminLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/admin/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: err.message || `HTTP ${response.status}` };
    }

    const data = await response.json();
    updateXsrfTokenFromResponse(response);
    return { success: true, data: data.data || data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// 관리자 로그아웃
export async function adminLogout(): Promise<ApiResponse<void>> {
  return apiCall<void>('/api/v1/admin/auth/logout', {
    method: 'POST',
  });
}

// 어드민 내 정보 조회 응답 타입
export interface AdminMeResponse {
  userId: number;
  name: string;
  email: string;
  role: string;
  nickname: string;
  profileImageUrl: string;
  phoneNumber: string;
  oneLineIntroduction: string;
}

// 어드민 내 정보 조회
export async function getAdminMe(): Promise<ApiResponse<AdminMeResponse>> {
  return apiCall<AdminMeResponse>('/api/v1/admin/auth/me', {
    method: 'GET',
  });
}
