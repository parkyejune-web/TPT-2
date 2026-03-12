import { getXsrfToken, updateXsrfTokenFromResponse } from '../utils/xsrfToken';
import { getIsMockMode } from '../contexts/MockDataContext';
import * as mockData from './mockData';

export const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { isMultipart?: boolean } = {}
): Promise<ApiResponse<T>> {
  try {
    const { isMultipart, ...fetchOptions } = options;

    // ✅ fetch 직전 최신 토큰 읽기 (localStorage 최신 상태 반영)
    const currentToken = getXsrfToken();

    const headers: Record<string, string> = {
      ...(currentToken ? { 'X-XSRF-TOKEN': currentToken } : {}),
      ...(options.headers as Record<string, string>),
    };

    // ✅ body가 JSON일 때만 Content-Type 지정
    if (!isMultipart && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    console.groupCollapsed(`[API CALL] ${endpoint}`);
    console.log('➡️ Request URL:', `${BASE_URL}${endpoint}`);
    console.log('➡️ Method:', options.method || 'GET');
    console.log('➡️ Using XSRF Token:', currentToken || '(none)');
    console.groupEnd();

    // ✅ 실제 요청
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      credentials: 'include',
      headers,
    });

    // ✅ 응답에서 새로운 XSRF 토큰 갱신
    await updateXsrfTokenFromResponse(response);

    console.groupCollapsed(`[API RESPONSE] ${endpoint}`);
    console.log('⬅️ Status:', response.status);
    console.log('⬅️ Updated XSRF Token:', getXsrfToken());
    console.groupEnd();

    // ✅ 응답 파싱
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      console.error('❌ API Error:', data);
      return {
        success: false,
        error: data?.message || `HTTP ${response.status}`,
      };
    }

    console.log('✅ API Success Data:', data);

    return {
      success: true,
      data: data?.result || data?.data || data,
    };
  } catch (error) {
    console.error('🚨 API Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export { getIsMockMode, mockData };
