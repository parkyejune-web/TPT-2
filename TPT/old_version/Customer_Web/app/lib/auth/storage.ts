// 인증 토큰 및 사용자 정보 저장 관리
export class AuthStorage {
  private static TOKEN_KEY = 'tpt_auth_token';
  private static USER_KEY = 'tpt_user_info';

  // 토큰 저장
  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // 토큰 가져오기
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  // 토큰 삭제
  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  // 사용자 정보 저장
  static setUser(user: unknown): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  // 사용자 정보 가져오기
  static getUser(): unknown | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // 사용자 정보 삭제
  static removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  // 모든 인증 정보 삭제 (로그아웃)
  static clearAll(): void {
    this.removeToken();
    this.removeUser();
  }

  // 인증 여부 확인
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}