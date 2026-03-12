'use client';

import CustomButton from '../../Shared/ui/CustomButton';

interface LogoutSectionProps {
  onLogout: () => void;
  onWithdraw: () => void;
}

/**
 * 마이페이지 사이드바의 로그아웃/탈퇴 섹션
 */
export default function LogoutSection({ onLogout, onWithdraw }: LogoutSectionProps) {
  return (
    <div className="mt-auto flex flex-col gap-2 px-4 pt-6 border-t border-gray-200">
      <CustomButton variant="normalClean" onClick={onLogout}>
        로그아웃
      </CustomButton>
      <CustomButton variant="normalClean" onClick={onWithdraw}>
        회원 탈퇴
      </CustomButton>
    </div>
  );
}
