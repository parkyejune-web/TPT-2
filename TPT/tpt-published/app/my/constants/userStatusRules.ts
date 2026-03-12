import { UserStatus } from '../../../Shared/store/authStore';

/**
 * 사용자 상태별 UI 표시 규칙
 * - basic_available: 무료 고객이 쓸 수 있는 기능의 보여짐 여부 (false일 때 blur)
 * - premium_available: 유료 고객이 쓸 수 있는 기능의 보여짐 여부 (false일 때 blur)
 * - message: 기능이 보여지지 못할 때 표시할 안내 문구
 *
 * NOTE: PAID_BEFORE_TEST, PAID_AFTER_TEST_TRAINER_ASSIGNING 상태가 삭제됨
 * - 레벨테스트가 필수 응시에서 선택 응시로 변경됨
 * - 레벨테스트 상태는 별도의 levelTestStatus 필드로 관리
 */
export const RENDER_RULES: Record<
  UserStatus,
  { basic_available: boolean; premium_available: boolean; message?: string }
> = {
  // UID 승인 대기 상태에서는 모든 기능 blur
  UID_REVIEW_PENDING: {
    basic_available: false,
    premium_available: false,
    message: 'UID 승인 후 이용하실 수 있는 기능이에요.',
  },
  // UID 승인 거절 상태에서는 모든 기능 blur
  UID_REJECTED: {
    basic_available: false,
    premium_available: false,
    message: 'UID 승인 후 이용하실 수 있는 기능이에요.',
  },
  // UID 승인 이후에는 무료 기능 사용 가능, 유료 기능 blur (무료 회원)
  UID_APPROVED: {
    basic_available: true,
    premium_available: false,
  },
  // 결제 완료, 트레이너 배정 대기 중 (유료 회원이지만 아직 트레이너 미배정)
  PAID_BEFORE_TRAINER_ASSIGNING: {
    basic_available: true,
    premium_available: false,
    message: '트레이너 배정 후 이용하실 수 있는 기능이에요.',
  },
  // 트레이너 배정 완료 시 모든 기능 사용 가능 (유료 회원)
  TRAINER_ASSIGNED: {
    basic_available: true,
    premium_available: true,
  },
};
