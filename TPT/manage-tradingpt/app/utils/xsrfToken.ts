// XSRF-TOKEN 관리 유틸리티

const XSRF_TOKEN_KEY = 'XSRF-TOKEN';

/**
 * localStorage에서 XSRF-TOKEN 값을 읽어옵니다.
 */
export function getXsrfToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(XSRF_TOKEN_KEY);
}

/**
 * XSRF-TOKEN을 localStorage에 저장합니다.
 */
export function setXsrfToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(XSRF_TOKEN_KEY, token);
}

/**
 * XSRF-TOKEN을 localStorage에서 삭제합니다.
 */
export function clearXsrfToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(XSRF_TOKEN_KEY);
}

/**
 * 응답 헤더에서 새로운 XSRF-TOKEN을 추출하고 업데이트합니다.
 * 서버가 쿠키가 아닌 헤더로 토큰을 전달할 때 사용하는 방식입니다.
 */
export function updateXsrfTokenFromResponse(response: Response): boolean {
  const newToken =
    response.headers.get('X-XSRF-TOKEN') ||
    response.headers.get('XSRF-TOKEN') ||
    response.headers.get('X-Xsrf-Token') ||
    response.headers.get('X-CSRF-TOKEN') ||
    response.headers.get('x-xsrf-token') ||
    response.headers.get('x-csrf-token');

  const currentToken = getXsrfToken();

  if (newToken) {
    if (newToken !== currentToken) {
      setXsrfToken(newToken);
      console.log('🆕 XSRF Token updated from response header:', newToken);
      return true;
    } else {
      console.log('✅ XSRF Token already up-to-date:', currentToken);
      return false;
    }
  }

  console.warn('⚠️ No XSRF token found in response headers');
  return false;
}

