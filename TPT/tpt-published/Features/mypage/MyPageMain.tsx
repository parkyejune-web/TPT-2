'use client';

import { UserStatus, LevelTestStatus } from '../../Shared/store/authStore';
import { RENDER_RULES } from '../../app/my/constants/userStatusRules';
import StatusWrapper from './StatusWrapper';
import PnLCalendar from './PnLCalendar';
import YearlyMonthList from './YearlyMonthList';
import WrongAnswerNote from './WrongAnswerNote';
import LevelTestWidget from './LevelTestWidget';
import ReviewManagementWidget from './ReviewManagementWidget';

// Import widgets
import UIDPending from '../../app/my/widget/UID_Pending';
import UIDDenied from '../../app/my/widget/UID_Denied';
import UIDApproved from '../../app/my/widget/UID_Approved';
import PaidBeforeTrainerAssigning from '../../app/my/widget/Paid_Before_Trainer_Assigning';
import AfterAssignedTrainer from '../../app/my/widget/After_Assigned_Trainer';

type Props = {
  state: UserStatus;
  isPremium?: boolean;
  levelTestStatus?: LevelTestStatus;
};

/**
 * 마이페이지 메인 컨텐츠 영역
 * 사용자 상태에 따라 다른 위젯을 표시
 *
 * NOTE: 레벨테스트가 선택 응시로 변경됨에 따라:
 * - PAID_BEFORE_TEST, PAID_AFTER_TEST_TRAINER_ASSIGNING 상태 삭제
 * - isPremium이 true인 경우 레벨테스트 위젯을 별도로 표시
 * - levelTestStatus로 레벨테스트 응시 상태 관리
 */
export default function MyPageMain({ state, isPremium = false, levelTestStatus }: Props) {
  // basic_available은 무료 고객이 쓸 수 있는 기능의 보여짐 여부를 제어하기 위한 변수
  // premium_available은 유료 고객이 쓸 수 있는 기능의 보여짐 여부를 제어하기 위한 변수
  // message는 기능이 보여지지 못할 때 표시할 안내 문구

  // false일 때 blur, true 일 때 visible
  const { basic_available, premium_available, message } = RENDER_RULES[state];

  // 캘린더를 보여줄 상태들 (UID 승인 이후)
  const shouldShowCalendar =
    state === 'UID_APPROVED' ||
    state === 'PAID_BEFORE_TRAINER_ASSIGNING' ||
    state === 'TRAINER_ASSIGNED';

  const renderMainContent = () => {
    switch (state) {
      case 'UID_REVIEW_PENDING':
        return <UIDPending />;
      case 'UID_REJECTED':
        return <UIDDenied />;
      case 'UID_APPROVED':
        return <UIDApproved />;
      case 'PAID_BEFORE_TRAINER_ASSIGNING':
        // return <PaidBeforeTrainerAssigning />;
        return null;
      case 'TRAINER_ASSIGNED':
        return <AfterAssignedTrainer />;
      default:
        return <div>알 수 없는 상태입니다.</div>;
    }
  };

  return (
    <main className="p-4 sm:p-6 md:p-10 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto text-center gap-5">
        {renderMainContent()}

        {/* 레벨테스트 위젯 - 유료 회원(isPremium)에게만 표시 */}
        {isPremium && (
          <div className="mt-10">
            <LevelTestWidget levelTestStatus={levelTestStatus} />
          </div>
        )}

        {/* 후기 관리 위젯 - TRAINER_ASSIGNED 상태에서만 표시 */}
        {/* {state === 'TRAINER_ASSIGNED' && (
          <div className="mt-10">
            <ReviewManagementWidget />
          </div>
        )} */}

        {/* 오답노트 - 캘린더를 보여주는 상태에서만 표시 */}
        {shouldShowCalendar && (
          <div className="mt-10">
            <WrongAnswerNote />
          </div>
        )}

        {/* 연도별 월 목록 - 캘린더를 보여주는 상태에서만 표시 */}
        {shouldShowCalendar && (
          <div className="mt-10">
            <YearlyMonthList />
          </div>
        )}

        {/* 캘린더 컴포넌트 - UID 승인 이후 상태에서만 표시 */}
        {shouldShowCalendar && (
          <div className="mt-10">
            <PnLCalendar />
          </div>
        )}
      </div>
    </main>
  );
}
