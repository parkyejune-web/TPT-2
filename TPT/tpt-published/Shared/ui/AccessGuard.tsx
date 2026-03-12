"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccessControl, AccessLevel } from "../hooks/useAccessControl";
import LoginRequiredModal from "./LoginRequiredModal";
import UidApprovalRequiredModal from "./UidApprovalRequiredModal";

interface AccessGuardProps {
  children: React.ReactNode;
  level: AccessLevel;
  /**
   * true: 모달 표시 후 사용자가 닫으면 이전 페이지로 이동
   * false: 모달 표시만 (기본값)
   */
  redirectOnClose?: boolean;
}

/**
 * 페이지 접근 권한 검사 가드 컴포넌트
 * 권한이 없는 경우 모달을 표시하고 콘텐츠를 숨김
 */
export default function AccessGuard({ children, level, redirectOnClose = true }: AccessGuardProps) {
  const router = useRouter();
  const { checkAccess } = useAccessControl();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUidModal, setShowUidModal] = useState(false);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const result = checkAccess(level);

    if (result.allowed) {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
      if (result.reason === 'NOT_LOGGED_IN') {
        setShowLoginModal(true);
      } else if (result.reason === 'UID_NOT_APPROVED') {
        setShowUidModal(true);
      }
    }
  }, [level, checkAccess]);

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    if (redirectOnClose) {
      router.back();
    }
  };

  const handleUidModalClose = () => {
    setShowUidModal(false);
    if (redirectOnClose) {
      router.back();
    }
  };

  // 아직 권한 확인 중
  if (isAllowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 권한 없음 - 모달 표시
  if (!isAllowed) {
    return (
      <>
        <div className="min-h-screen bg-gray-50"></div>
        <LoginRequiredModal isOpen={showLoginModal} onClose={handleLoginModalClose} />
        <UidApprovalRequiredModal isOpen={showUidModal} onClose={handleUidModalClose} />
      </>
    );
  }

  // 권한 있음 - 콘텐츠 렌더링
  return <>{children}</>;
}
