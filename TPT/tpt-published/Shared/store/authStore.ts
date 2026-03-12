import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 사용자 정보 타입
 */
export interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
  nickName?: string | null; // 닉네임 (null이면 미설정)
  investmentType: 'SWING' | 'DAY' | 'SCALPING' | 'FREE' | '';
  isPremium: boolean;
  isCourseCompleted: boolean;
  exchangeName?: string | null;
  paymentMethod?: string | null;
  trainerId?: number | null;
  trainerName?: string | null;
  uid?: string | null;
  userStatus?: UserStatus;
  levelTestStatus?: LevelTestStatus; // 레벨테스트 상태 (유료 회원 전용)
  membershipLevel?: 'BASIC' | 'PREMIUM';
  signedAt?: string; // 회원가입 일시 (YYYY-MM-DD)
  remainingToken?: number; // 남은 토큰 개수 (API 필드명: token)
  token?: number; // API 원본 필드명
}

/**
 * 사용자 상태 타입
 * - PAID_BEFORE_TEST, PAID_AFTER_TEST_TRAINER_ASSIGNING 삭제됨 (레벨테스트가 선택 사항으로 변경)
 */
export type UserStatus =
  | 'UID_REVIEW_PENDING' // UID 검토 중
  | 'UID_REJECTED' // UID 거절
  | 'UID_APPROVED' // UID 승인 (무료 회원)
  | 'PAID_BEFORE_TRAINER_ASSIGNING' // 결제 완료, 트레이너 배정 대기 중
  | 'TRAINER_ASSIGNED'; // 트레이너 배정 완료 (유료 회원)

/**
 * 레벨테스트 상태 타입 (유료 회원 전용)
 */
export type LevelTestStatus =
  | 'AVAILABLE' // 응시 가능
  | 'BEFORE_GRADE' // 채점 전
  | 'COMPLETED'; // 채점 완료 (4개월 뒤 '응시 가능' 상태로 전환)

/**
 * 인증 상태 관리 스토어
 */
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  checkAuth: (myInfoFn?: () => Promise<any>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,

      /**
       * 로그인 처리
       */
      login: (user) =>
        set({
          isAuthenticated: true,
          user,
        }),

      /**
       * 로그아웃 처리
       */
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),

      /**
       * 사용자 정보 부분 업데이트
       */
      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),

      /**
       * 인증 상태 확인 (최초 접속 시 사용)
       * @param myInfoFn - 사용자 정보 조회 API 함수 (선택사항)
       */
      checkAuth: async (myInfoFn?: () => Promise<any>) => {
        try {
          if (!myInfoFn) {
            // API 함수가 제공되지 않으면 로컬 스토리지 기반으로만 인증 상태 확인
            const currentState = get();
            if (!currentState.user) {
              set({ isAuthenticated: false, user: null });
            }
            return;
          }

          const res = await myInfoFn();

          if (res?.success && res?.data) {
            set({
              isAuthenticated: true,
              user: res.data,
            });
          } else {
            set({ isAuthenticated: false, user: null });
          }
        } catch (err) {
          console.error('checkAuth 오류:', err);
          set({ isAuthenticated: false, user: null });
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage 키
      // 특정 필드만 persist하려면 partialize 사용 가능
      // partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
    }
  )
);
