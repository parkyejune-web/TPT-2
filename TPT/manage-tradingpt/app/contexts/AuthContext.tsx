'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { getAdminMe, type AdminMeResponse } from '../api/auth';

interface AuthContextType {
  user: AdminMeResponse | null;
  isLoading: boolean;
  isAdmin: boolean;
  fetchUserInfo: () => Promise<void>;
  clearUserInfo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === 'ROLE_ADMIN';

  const fetchUserInfo = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') {
      setUser({ role: 'ROLE_ADMIN', userId: 0, name: 'dev', email: '', nickname: '', profileImageUrl: '', phoneNumber: '', oneLineIntroduction: '' });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await getAdminMe();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearUserInfo = useCallback(() => {
    setUser(null);
  }, []);

  // 페이지 로드 시 항상 사용자 정보 확인 (로그인 상태 판별)
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, fetchUserInfo, clearUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
