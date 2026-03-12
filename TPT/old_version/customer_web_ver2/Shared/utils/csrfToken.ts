/**
 * CSRF 토큰 관리 유틸리티
 *
 * 주의: Cookie는 HttpOnly 설정으로 JavaScript에서 접근 불가
 * CSRF 토큰은 서버 응답 헤더에서만 추출하여 localStorage에 저장
 */

/**
 * localStorage에서 CSRF 토큰 가져오기
 */
export function getCsrfToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('XSRF-TOKEN');
}

/**
 * CSRF 토큰을 localStorage에 저장
 * apiInstance.ts의 fetcher에서 응답 헤더로부터 호출됨
 */
export function setCsrfToken(token: string): void {
  if (typeof window === 'undefined') return;
  const currentToken = localStorage.getItem('XSRF-TOKEN');

  if (token !== currentToken) {
    console.log('🔄 CSRF 토큰 업데이트:', token);
    localStorage.setItem('XSRF-TOKEN', token);
  }
}

/**
 * CSRF 토큰 초기화 (로그아웃 시 사용)
 */
export function clearCsrfToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('XSRF-TOKEN');
  console.log('🗑️ CSRF 토큰 제거됨');
}
