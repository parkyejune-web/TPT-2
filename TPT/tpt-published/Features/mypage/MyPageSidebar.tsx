'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../Shared/hooks/useAuth';
import { UserStatus, LevelTestStatus } from '../../Shared/store/authStore';
import { useProfileImage } from './useProfileImage';
import { useNickname } from './useNickname';
import ProfileSection from './ProfileSection';
import MembershipSection from './MembershipSection';
import InvestmentTypeSection from './InvestmentTypeSection';
import TokenSection from './TokenSection';
import QuickLinksSection from './QuickLinksSection';
import MenuSection from './MenuSection';
import CustomModal from '../../Shared/ui/CustomModal';
import InvestmentTypeChangeModal from './InvestmentTypeChangeModal';
import ResetPasswordAuthModal from './ResetPasswordAuthModal';
import type { InvestmentType } from '../../Shared/api/services/investmentTypeChangeService';

type UserData = {
  name: string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
  nickName?: string | null;
  investmentType: 'SWING' | 'DAY' | 'SCALPING' | 'FREE' | '';
  userStatus?: UserStatus;
  levelTestStatus?: LevelTestStatus; // 레벨테스트 상태 (유료 회원 전용)
  exchangeName?: string;
  uid?: string | null;
  trainerId?: number | null;
  trainerName?: string | null;
  isCourseCompleted: boolean;
  isPremium: boolean;
  remainingToken?: number;
  paymentMethod?: string | null;
};

type Props = { userData: UserData };

/**
 * 마이페이지 사이드바 컴포넌트
 */
export default function MyPageSidebar({ userData }: Props) {
  const router = useRouter();
  const { logout, deleteUser } = useAuth();

  // 프로필 이미지 훅
  const { profileImage, handleProfileImageChange, uploading } = useProfileImage(
    userData?.profileImage
  );

  // 닉네임 훅
  const { nickName, handleNicknameChange, loading: nicknameLoading } = useNickname(
    userData?.nickName
  );

  // 모달 상태 관리
  const [openModal, setOpenModal] = useState<null | 'uid' | 'type'>(null);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);

  // 로그아웃
  const handleLogout = async () => {
    console.log('[MyPageSidebar] 로그아웃 시작');
    const result = await logout();
    if (result.success) {
      console.log('[MyPageSidebar] 로그아웃 성공, 로그인 페이지로 이동');
      router.push('/login');
    } else {
      console.error('[MyPageSidebar] 로그아웃 실패:', result.error);
      alert(result.error || '로그아웃에 실패했습니다.');
    }
  };

  // 회원 탈퇴
  const handleDeleteUser = async () => {
    if (confirm('정말로 탈퇴하시겠습니까?\n모든 데이터가 삭제됩니다.')) {
      console.log('[MyPageSidebar] 회원 탈퇴 시작');
      const result = await deleteUser();
      if (result.success) {
        console.log('[MyPageSidebar] 회원 탈퇴 성공, 로그인 페이지로 이동');
        alert('회원 탈퇴가 완료되었습니다.');
        router.push('/login');
      } else {
        console.error('[MyPageSidebar] 회원 탈퇴 실패:', result.error);
        alert(result.error || '회원 탈퇴에 실패했습니다.');
      }
    }
  };

  // 매매일지 작성 페이지로 이동
  const handleWriteDiary = () => {
    router.push('/my/feedback-request');
  };

  return (
    <aside className="w-full md:w-64 bg-white text-black flex flex-col py-6 md:py-10 relative md:sticky md:top-0 md:h-screen border-l border-r border-gray-200 md:overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-6 px-4">
        {/* Profile 영역 */}
        <ProfileSection
          name={userData.name}
          email={userData.email}
          phone={userData.phoneNumber || undefined}
          profileImage={profileImage}
          nickName={nickName}
          onChange={handleProfileImageChange}
          uploading={uploading}
          onLogout={handleLogout}
          onWriteDiary={handleWriteDiary}
          onNicknameChange={handleNicknameChange}
          nicknameLoading={nicknameLoading}
        />

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* TPT Type 영역 */}
        <MembershipSection
          isPremium={userData.isPremium}
          isCourseCompleted={userData.isCourseCompleted}
        />

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Investment Type 영역 */}
        {/* <InvestmentTypeSection investmentType={userData.investmentType} /> */}

        {/* Divider */}
        {/* <div className="border-t border-gray-200" /> */}

        {/* My TOKEN 영역 */}
        <TokenSection
          remainingToken={userData.remainingToken}
          isPremium={userData.isPremium}
        />

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Quick Links 영역 */}
        <QuickLinksSection />

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Menu 영역 */}
        <MenuSection
          onPasswordChange={() => setResetPasswordModalOpen(true)}
          onPaymentManagement={() => router.push('/my/payment')}
          onUidClick={() => setOpenModal('uid')}
          onTypeChange={() => setOpenModal('type')}
          onCustomerServiceClick={() => router.push('/my/support')}
          onWithdraw={handleDeleteUser}
          isPremium={userData.isPremium}
          hasPaymentMethod={!!userData.paymentMethod}
        />
      </div>

      {/* 비밀번호 변경 모달 */}
      <ResetPasswordAuthModal
        isOpen={resetPasswordModalOpen}
        onClose={() => setResetPasswordModalOpen(false)}
      />

      {/* UID 관리 모달 */}
      <CustomModal variant={1} isOpen={openModal === 'uid'} onClose={() => setOpenModal(null)} width='max-w-xl'>
        <h2 className="text-lg mb-4 font-semibold">UID 관리</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>거래소명: {userData.exchangeName || 'N/A'}</p>
          <p>UID: {userData.uid || 'N/A'}</p>
        </div>
      </CustomModal>

      {/* 투자유형 변경 모달 */}
      <InvestmentTypeChangeModal
        isOpen={openModal === 'type'}
        onClose={() => setOpenModal(null)}
        currentType={userData.investmentType as InvestmentType}
      />
    </aside>
  );
}
