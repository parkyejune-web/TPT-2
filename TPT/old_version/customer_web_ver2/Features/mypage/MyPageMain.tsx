'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';
import { UserStatus } from '../../Shared/store/authStore';
import { RENDER_RULES } from '../../app/my/constants/userStatusRules';
import StatusWrapper from './StatusWrapper';
import PnLCalendar from './PnLCalendar';
import YearlyMonthList from './YearlyMonthList';
import ConsultationModal from './ConsultationModal';

// Import widgets
import UIDPending from '../../app/my/widget/UID_Pending';
import UIDDenied from '../../app/my/widget/UID_Denied';
import UIDApproved from '../../app/my/widget/UID_Approved';
import PaidBeforeLeveltest from '../../app/my/widget/Paid_Before_Leveltest';
import PaidAfterLeveltestPendingTrainer from '../../app/my/widget/Paid_After_Leveltest_Pending_Trainer';
import AfterAssignedTrainer from '../../app/my/widget/After_Assigned_Trainer';

type Props = {
  state: UserStatus;
};

/**
 * 마이페이지 메인 컨텐츠 영역
 * 사용자 상태에 따라 다른 위젯을 표시
 */
export default function MyPageMain({ state }: Props) {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  // basic_available은 무료 고객이 쓸 수 있는 기능의 보여짐 여부를 제어하기 위한 변수
  // premium_available은 유료 고객이 쓸 수 있는 기능의 보여짐 여부를 제어하기 위한 변수
  // message는 기능이 보여지지 못할 때 표시할 안내 문구

  // false일 때 blur, true 일 때 visible
  const { basic_available, premium_available, message } = RENDER_RULES[state];

  // 캘린더를 보여줄 상태들
  const shouldShowCalendar =
    state === 'UID_APPROVED' ||
    state === 'PAID_BEFORE_TEST' ||
    state === 'PAID_AFTER_TEST_TRAINER_ASSIGNING' ||
    state === 'TRAINER_ASSIGNED';

  const renderMainContent = () => {
    switch (state) {
      case 'UID_REVIEW_PENDING':
        return <UIDPending />;
      case 'UID_REJECTED':
        return <UIDDenied />;
      case 'UID_APPROVED':
        return <UIDApproved />;
      case 'PAID_BEFORE_TEST':
        return <PaidBeforeLeveltest />;
      case 'PAID_AFTER_TEST_TRAINER_ASSIGNING':
        return <PaidAfterLeveltestPendingTrainer />;
      case 'TRAINER_ASSIGNED':
        return <AfterAssignedTrainer />;
      default:
        return <div>알 수 없는 상태입니다.</div>;
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-visible md:overflow-y-auto md:max-h-screen">
      <div className="max-w-2xl mx-auto text-center gap-5">
        {renderMainContent()}

        {/* 상담 예약 버튼 - 캘린더를 보여주는 상태에서만 표시 */}
        {shouldShowCalendar && (
          <div className="mt-10">
            <button
              onClick={() => setIsConsultationModalOpen(true)}
              className="w-full max-w-md mx-auto flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              <Phone size={24} />
              <span>전화 상담 예약하기</span>
            </button>
          </div>
        )}

        {/* 캘린더 컴포넌트 - UID_APPROVED, PAID_BEFORE_TEST, PAID_AFTER_TEST_TRAINER_ASSIGNING, TRAINER_ASSIGNED 상태에서만 표시 */}
        {shouldShowCalendar && (
          <div className="mt-10">
            <PnLCalendar />
          </div>
        )}

        {/* 연도별 월 목록 - 캘린더를 보여주는 상태에서만 표시 */}
        {shouldShowCalendar && (
          <div className="mt-10">
            <YearlyMonthList />
          </div>
        )}

        

        {/* UID 승인 이후에만 보임 */}
        <StatusWrapper
          type="basic"
          basic_available={basic_available}
          premium_available={premium_available}
          message={message}
        >
          {/* 추가 기본 기능 컨텐츠 (예: 안내문구 등) */}
          <div className="mt-10">
            <div className="bg-gray-50 rounded-md p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">TPT 서비스 안내</h3>
              <p className="text-sm text-gray-600">
                프리미엄 멤버십 가입 시 전문 트레이너의 1:1 피드백을 받으실 수 있습니다.
              </p>
            </div>
          </div>
        </StatusWrapper>
      </div>

      {/* 상담 예약 모달 */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />
    </main>
  );
}
