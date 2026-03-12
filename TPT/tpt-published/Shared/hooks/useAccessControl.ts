'use client';

import { useCallback } from 'react';
import { useAuthStore, UserStatus } from '../store/authStore';

/**
 * 접근 권한 레벨 정의
 * - PUBLIC: 로그인하지 않아도 접근 가능
 * - LOGIN_REQUIRED: 로그인만 필요
 * - UID_APPROVED_REQUIRED: 로그인 + UID 승인 필요 (UID_REJECTED, UID_REVIEW_PENDING 제외)
 */
export type AccessLevel = 'PUBLIC' | 'LOGIN_REQUIRED' | 'UID_APPROVED_REQUIRED';

/**
 * 접근 거부 사유
 */
export type AccessDeniedReason = 'NOT_LOGGED_IN' | 'UID_NOT_APPROVED' | null;

/**
 * 접근 권한 검사 결과
 */
export interface AccessCheckResult {
  allowed: boolean;
  reason: AccessDeniedReason;
}

/**
 * 접근 권한 검사 훅
 *
 * home_viewer_rules.md 기반 권한 정책:
 *
 * [PUBLIC - 로그인 없이 접근 가능]
 * - TPT 후기 /menu/community/review
 * - 성장일지 /menu/growth
 * - TPT PLAN /menu/tpt-plan
 * - 거래소 사용 방법 /menu/guide/exchange
 * - TPT 이용 정책 /menu/guide/policy
 *
 * [UID_APPROVED_REQUIRED - 로그인 + UID 승인 필요]
 * - TPT 연구실 /menu/class-list
 * - 10억 인사이트 /menu/insight
 * - TPT 트레이딩 룸 /menu/analysis
 * - 매매일지 모아보기 /menu/feedback-list
 * - 홈화면 섹션 클릭 (TPT 트레이더 매매일지, BEST 매매일지, 10억 인사이트)
 *
 * [LOGIN_REQUIRED - 로그인만 필요]
 * - 문의하기 /my/support
 */
export const useAccessControl = () => {
  const { isAuthenticated, user } = useAuthStore();

  /**
   * UID 승인 상태인지 확인
   * UID_REJECTED, UID_REVIEW_PENDING이 아닌 모든 상태를 승인으로 간주
   */
  const isUidApproved = useCallback((): boolean => {
    if (!user?.userStatus) return false;
    return user.userStatus !== 'UID_REJECTED' && user.userStatus !== 'UID_REVIEW_PENDING';
  }, [user?.userStatus]);

  /**
   * 접근 권한 검사
   */
  const checkAccess = useCallback((level: AccessLevel): AccessCheckResult => {
    // PUBLIC: 누구나 접근 가능
    if (level === 'PUBLIC') {
      return { allowed: true, reason: null };
    }

    // LOGIN_REQUIRED: 로그인만 필요
    if (level === 'LOGIN_REQUIRED') {
      if (!isAuthenticated) {
        return { allowed: false, reason: 'NOT_LOGGED_IN' };
      }
      return { allowed: true, reason: null };
    }

    // UID_APPROVED_REQUIRED: 로그인 + UID 승인 필요
    if (level === 'UID_APPROVED_REQUIRED') {
      if (!isAuthenticated) {
        return { allowed: false, reason: 'NOT_LOGGED_IN' };
      }
      if (!isUidApproved()) {
        return { allowed: false, reason: 'UID_NOT_APPROVED' };
      }
      return { allowed: true, reason: null };
    }

    return { allowed: false, reason: null };
  }, [isAuthenticated, isUidApproved]);

  /**
   * 경로 기반 접근 레벨 반환
   */
  const getAccessLevelForPath = useCallback((path: string): AccessLevel => {
    // PUBLIC 경로들
    const publicPaths = [
      '/menu/community/review',
      '/menu/growth',
      '/menu/tpt-plan',
      '/menu/guide/exchange',
      '/menu/guide/policy',
      '/menu/about',
    ];

    // LOGIN_REQUIRED 경로들
    const loginRequiredPaths = [
      '/my/support',
      '/my/feedback-request',
    ];

    // UID_APPROVED_REQUIRED 경로들
    const uidApprovedRequiredPaths = [
      '/menu/class-list',
      '/menu/insight',
      '/menu/analysis',
      '/menu/feedback-list',
      '/menu/columns',
      '/my/feedback-detail',
      '/my/review',
    ];

    if (publicPaths.some(p => path.startsWith(p))) {
      return 'PUBLIC';
    }

    if (loginRequiredPaths.some(p => path.startsWith(p))) {
      return 'LOGIN_REQUIRED';
    }

    if (uidApprovedRequiredPaths.some(p => path.startsWith(p))) {
      return 'UID_APPROVED_REQUIRED';
    }

    // 기본값: PUBLIC
    return 'PUBLIC';
  }, []);

  /**
   * 경로 기반 접근 검사
   */
  const checkAccessForPath = useCallback((path: string): AccessCheckResult => {
    const level = getAccessLevelForPath(path);
    return checkAccess(level);
  }, [checkAccess, getAccessLevelForPath]);

  return {
    isAuthenticated,
    user,
    isUidApproved,
    checkAccess,
    getAccessLevelForPath,
    checkAccessForPath,
  };
};
