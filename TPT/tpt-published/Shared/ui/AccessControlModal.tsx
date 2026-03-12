"use client";

import { AccessDeniedReason } from "../hooks/useAccessControl";
import LoginRequiredModal from "./LoginRequiredModal";
import UidApprovalRequiredModal from "./UidApprovalRequiredModal";

interface AccessControlModalProps {
  isOpen: boolean;
  reason: AccessDeniedReason;
  onClose: () => void;
}

/**
 * 접근 권한 검사 통합 모달
 * 거부 사유에 따라 적절한 모달을 표시
 */
export default function AccessControlModal({ isOpen, reason, onClose }: AccessControlModalProps) {
  if (!isOpen || !reason) return null;

  if (reason === 'NOT_LOGGED_IN') {
    return <LoginRequiredModal isOpen={isOpen} onClose={onClose} />;
  }

  if (reason === 'UID_NOT_APPROVED') {
    return <UidApprovalRequiredModal isOpen={isOpen} onClose={onClose} />;
  }

  return null;
}
