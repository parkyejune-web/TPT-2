'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, User } from '../store/authStore';
import { authService } from '../api/services';

/**
 * 서버에서 반환되는 사용자 정보 타입
 */
interface ServerUserData {
  name: string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  myProfileImage?: string | null; // 서버에서는 myProfileImage로 반환
  investmentType: 'SWING' | 'DAY' | 'SCALPING' | 'FREE' | '';
  isPremium: boolean;
  isCourseCompleted: boolean;
  exchangeName?: string | null;
  paymentMethod?: string | null;
  trainerId?: number | null;
  trainerName?: string | null;
  uid?: string | null;
  userStatus?: 'UID_REVIEW_PENDING' | 'UID_REJECTED' | 'UID_APPROVED' | 'PAID_BEFORE_TEST' | 'PAID_AFTER_TEST_TRAINER_ASSIGNING' | 'TRAINER_ASSIGNED';
}

/**
 * 서버 응답을 클라이언트 User 타입으로 변환
 */
const transformServerUserData = (serverData: ServerUserData): User => {
  const { myProfileImage, ...rest } = serverData;
  return {
    ...rest,
    profileImage: myProfileImage, // myProfileImage -> profileImage 변환
  };
};

/**
 * AuthProvider
 *
 * 앱 최초 로드 시 /my API를 호출하여 로그인 상태를 확인합니다.
 * - 로그인 상태면 zustand store에 사용자 정보 저장
 * - 비로그인 상태면 store 초기화
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('[AuthProvider] 인증 상태 확인 시작');

        // /my API 호출하여 인증 상태 확인
        const result = await authService.getMyInfo();

        if (result.success && result.data) {
          console.log('[AuthProvider] 로그인 상태 확인됨 (원본):', result.data);

          // 서버 응답을 클라이언트 형식으로 변환
          const transformedUser = transformServerUserData(result.data as ServerUserData);
          console.log('[AuthProvider] 변환된 사용자 정보:', transformedUser);

          // zustand store에 저장
          useAuthStore.getState().login(transformedUser);
        } else {
          console.log('[AuthProvider] 비로그인 상태');
          useAuthStore.getState().logout();
        }
      } catch (error) {
        console.error('[AuthProvider] 인증 확인 오류:', error);
        useAuthStore.getState().logout();
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  // 인증 상태 확인 전까지는 로딩 표시
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
