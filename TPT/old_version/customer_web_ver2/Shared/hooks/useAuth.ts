'use client';

import { useState, useCallback } from 'react';
import { useAuthStore, User } from '../store/authStore';
import { authService, feedbackService, complaintService } from '../api/services';
import { clearCsrfToken } from '../utils/csrfToken';
import type {
  ApiResponse,
  LoginRequest,
  SignupRequest,
} from '../api/apiTypes';

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
 * 인증 관련 커스텀 훅
 *
 * Customer_Web의 useAuth를 customer_web_ver2에 맞게 마이그레이션
 */
export const useAuth = () => {
  const { user, isAuthenticated, login: storeLogin, logout: storeLogout, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 로그인
   */
  const login = useCallback(
    async (data: LoginRequest): Promise<ApiResponse<any>> => {
      setIsLoading(true);
      try {
        const result = await authService.login(data);
        if (result.success) {
          console.log('[useAuth] 로그인 성공, 사용자 정보 조회 시작');
          // 로그인 성공 후 /my API를 호출하여 사용자 정보 가져오기
          // CSRF 토큰은 응답 헤더에서 자동으로 추출되어 localStorage에 저장됨
          const myInfoResult = await authService.getMyInfo();
          if (myInfoResult.success && myInfoResult.data) {
            console.log('[useAuth] 사용자 정보 조회 성공 (원본):', myInfoResult.data);
            const transformedUser = transformServerUserData(myInfoResult.data as ServerUserData);
            console.log('[useAuth] 변환된 사용자 정보:', transformedUser);
            storeLogin(transformedUser);
          } else {
            console.error('[useAuth] 사용자 정보 조회 실패:', myInfoResult);
          }
        }
        return result;
      } catch (error) {
        console.error('[useAuth] 로그인 오류:', error);
        return { success: false, error: '로그인 중 오류가 발생했습니다.' };
      } finally {
        setIsLoading(false);
      }
    },
    [storeLogin]
  );

  /**
   * 회원가입
   */
  const signup = useCallback(async (data: SignupRequest): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    try {
      return await authService.signup(data);
    } catch (error) {
      console.error('회원가입 오류:', error);
      return { success: false, error: '회원가입 중 오류가 발생했습니다.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 로그아웃
   */
  const logout = useCallback(async (): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    try {
      const result = await authService.logout();
      storeLogout();
      // 로그아웃 시 CSRF 토큰 제거
      clearCsrfToken();
      return result;
    } catch (error) {
      console.error('로그아웃 오류:', error);
      return { success: false, error: '로그아웃 중 오류가 발생했습니다.' };
    } finally {
      setIsLoading(false);
    }
  }, [storeLogout]);

  /**
   * 회원 탈퇴
   */
  const deleteUser = useCallback(async (): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    try {
      const result = await authService.deleteUser();
      storeLogout();
      // 회원탈퇴 시 CSRF 토큰 제거
      clearCsrfToken();
      return result;
    } catch (error) {
      console.error('회원탈퇴 오류:', error);
      return { success: false, error: '회원탈퇴 중 오류가 발생했습니다.' };
    } finally {
      setIsLoading(false);
    }
  }, [storeLogout]);

  /**
   * 내 정보 조회
   */
  const getMyInfo = useCallback(async (): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    try {
      const result = await authService.getMyInfo();
      if (result.success && result.data) {
        console.log('[useAuth] getMyInfo 성공 (원본):', result.data);
        const transformedUser = transformServerUserData(result.data as ServerUserData);
        console.log('[useAuth] getMyInfo 변환된 사용자 정보:', transformedUser);
        storeLogin(transformedUser);
      }
      return result;
    } catch (error) {
      console.error('내 정보 조회 오류:', error);
      return { success: false, error: '내 정보 조회 중 오류가 발생했습니다.' };
    } finally {
      setIsLoading(false);
    }
  }, [storeLogin]);

  /**
   * 비밀번호 재설정 (비로그인 상태)
   */
  const resetPasswordUnauthenticated = useCallback(
    async (data: any): Promise<ApiResponse<void>> => {
      setIsLoading(true);
      try {
        return await authService.updatePassword(data);
      } catch (error) {
        console.error('비밀번호 재설정 오류:', error);
        return { success: false, error: '비밀번호 재설정 중 오류가 발생했습니다.' };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * 비밀번호 변경 (로그인 상태)
   */
  const resetPasswordAuthenticated = useCallback(
    async (data: any): Promise<ApiResponse<void>> => {
      setIsLoading(true);
      try {
        return await authService.changePassword(data);
      } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        return { success: false, error: '비밀번호 변경 중 오류가 발생했습니다.' };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * 프로필 이미지 변경
   */
  const updateProfileImage = useCallback(
    async (file: File): Promise<ApiResponse<any>> => {
      setIsLoading(true);
      try {
        const result = await authService.updateProfileImage(file);
        console.log('[useAuth] updateProfileImage 결과:', result);
        if (result.success && result.data) {
          // 프로필 이미지 URL 업데이트
          const newImageUrl = result.data.myProfileImage;
          console.log('[useAuth] 프로필 이미지 URL 업데이트:', newImageUrl);
          updateUser({ profileImage: newImageUrl });
        }
        return result;
      } catch (error) {
        console.error('프로필 이미지 변경 오류:', error);
        return { success: false, error: '프로필 이미지 변경 중 오류가 발생했습니다.' };
      } finally {
        setIsLoading(false);
      }
    },
    [updateUser]
  );

  /**
   * 스윙 피드백 요청
   */
  const requestSwingFeedback = useCallback(async (data: FormData): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    try {
      return await feedbackService.createSwingFeedback(data);
    } catch (error) {
      console.error('스윙 피드백 요청 오류:', error);
      return { success: false, error: '스윙 피드백 요청 중 오류가 발생했습니다.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 데이 트레이딩 피드백 요청
   */
  const requestDayFeedback = useCallback(async (data: FormData): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    try {
      return await feedbackService.createDayFeedback(data);
    } catch (error) {
      console.error('데이 피드백 요청 오류:', error);
      return { success: false, error: '데이 피드백 요청 중 오류가 발생했습니다.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 스켈핑 피드백 요청
   */
  const requestScalpingFeedback = useCallback(async (data: FormData): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    try {
      return await feedbackService.createScalpingFeedback(data);
    } catch (error) {
      console.error('스켈핑 피드백 요청 오류:', error);
      return { success: false, error: '스켈핑 피드백 요청 중 오류가 발생했습니다.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 민원 작성
   */
  const writeComplaint = useCallback(
    async (title: string, content: string, image?: File): Promise<ApiResponse<any>> => {
      setIsLoading(true);
      try {
        return await complaintService.createComplaint({ title, content, image });
      } catch (error) {
        console.error('민원 작성 오류:', error);
        return { success: false, error: '민원 작성 중 오류가 발생했습니다.' };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * 민원 목록 조회
   */
  const readComplaint = useCallback(async (): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    try {
      return await complaintService.getComplaintList();
    } catch (error) {
      console.error('민원 조회 오류:', error);
      return { success: false, error: '민원 조회 중 오류가 발생했습니다.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    deleteUser,
    getMyInfo,
    resetPasswordUnauthenticated,
    resetPasswordAuthenticated,
    updateProfileImage,
    requestSwingFeedback,
    requestDayFeedback,
    requestScalpingFeedback,
    writeComplaint,
    readComplaint,
  };
};
