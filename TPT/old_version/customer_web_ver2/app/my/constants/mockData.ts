import { UserStatus } from '../../../Shared/store/authStore';

/**
 * 마이페이지 개발용 Mock Data 설정
 *
 * 개발 환경에서 다양한 사용자 상태를 테스트하기 위한 mock data
 */

export interface MockUserData {
  name: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  profileImage: string | null;
  investmentType: 'SWING' | 'DAY' | 'SCALPING' | 'FREE' | '';
  userStatus: UserStatus;
  exchangeName?: string;
  uid?: string;
  trainerId?: number;
  trainerName?: string;
  isCourseCompleted: boolean;
  isPremium: boolean;
  remainingToken: number;
  isApproved: boolean; // 심사 승인 여부 (true: 승인됨, false: 승인 안됨)
}

/**
 * 사용자 상태별 Mock Data 프리셋
 */
export const MOCK_USER_PRESETS: Record<UserStatus, MockUserData> = {
  UID_REVIEW_PENDING: {
    name: '홍길동',
    username: 'honggildong',
    email: 'hong@example.com',
    phoneNumber: '010-1234-5678',
    profileImage: null,
    investmentType: 'DAY',
    userStatus: 'UID_REVIEW_PENDING',
    exchangeName: 'Binance',
    uid: 'binance_hong123',
    trainerId: undefined,
    trainerName: undefined,
    isCourseCompleted: false,
    isPremium: false,
    remainingToken: 5,
    isApproved: false,
  },
  UID_REJECTED: {
    name: '김철수',
    username: 'kimcheolsu',
    email: 'kim@example.com',
    phoneNumber: '010-2345-6789',
    profileImage: 'https://via.placeholder.com/150',
    investmentType: 'SWING',
    userStatus: 'UID_REJECTED',
    exchangeName: 'Upbit',
    uid: 'upbit_kim456',
    trainerId: undefined,
    trainerName: undefined,
    isCourseCompleted: false,
    isPremium: false,
    remainingToken: 3,
    isApproved: false,
  },
  UID_APPROVED: {
    name: '이영희',
    username: 'leeyounghee',
    email: 'lee@example.com',
    phoneNumber: '010-3456-7890',
    profileImage: null,
    investmentType: 'SCALPING',
    userStatus: 'UID_APPROVED',
    exchangeName: 'Bybit',
    uid: 'bybit_lee789',
    trainerId: undefined,
    trainerName: undefined,
    isCourseCompleted: false,
    isPremium: false,
    remainingToken: 10,
    isApproved: true,
  },
  PAID_BEFORE_TEST: {
    name: '박민수',
    username: 'parkminsu',
    email: 'park@example.com',
    phoneNumber: '010-4567-8901',
    profileImage: 'https://via.placeholder.com/150',
    investmentType: 'DAY',
    userStatus: 'PAID_BEFORE_TEST',
    exchangeName: 'OKX',
    uid: 'okx_park012',
    trainerId: undefined,
    trainerName: undefined,
    isCourseCompleted: false,
    isPremium: true,
    remainingToken: 15,
    isApproved: true,
  },
  PAID_AFTER_TEST_TRAINER_ASSIGNING: {
    name: '정수진',
    username: 'jungsujin',
    email: 'jung@example.com',
    phoneNumber: '010-5678-9012',
    profileImage: null,
    investmentType: 'SWING',
    userStatus: 'PAID_AFTER_TEST_TRAINER_ASSIGNING',
    exchangeName: 'Binance',
    uid: 'binance_jung345',
    trainerId: undefined,
    trainerName: undefined,
    isCourseCompleted: true,
    isPremium: true,
    remainingToken: 20,
    isApproved: true,
  },
  TRAINER_ASSIGNED: {
    name: '최지훈',
    username: 'choijihun',
    email: 'choi@example.com',
    phoneNumber: '010-6789-0123',
    profileImage: 'https://via.placeholder.com/150',
    investmentType: 'FREE',
    userStatus: 'TRAINER_ASSIGNED',
    exchangeName: 'Bybit',
    uid: 'bybit_choi678',
    trainerId: 1,
    trainerName: '김트레이너',
    isCourseCompleted: true,
    isPremium: true,
    remainingToken: 25,
    isApproved: true,
  },
};

/**
 * Mock Data 사용 설정
 */
export interface MockDataConfig {
  enabled: boolean; // Mock data 사용 여부
  userStatus?: UserStatus; // 사용할 사용자 상태 프리셋
}

/**
 * 기본 Mock Data 설정
 * 개발 환경에서 원하는 상태로 변경하여 사용
 */
export const DEFAULT_MOCK_CONFIG: MockDataConfig = {
  enabled: false, // true로 변경하면 mock data 사용
  userStatus: 'UID_APPROVED', // 테스트할 사용자 상태
};

/**
 * Mock Data 가져오기
 */
export function getMockUserData(config: MockDataConfig = DEFAULT_MOCK_CONFIG): MockUserData | null {
  if (!config.enabled || !config.userStatus) {
    return null;
  }
  return MOCK_USER_PRESETS[config.userStatus];
}
