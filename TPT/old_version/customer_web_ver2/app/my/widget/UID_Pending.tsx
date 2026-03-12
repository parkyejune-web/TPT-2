'use client';

/**
 * UID 승인 대기 중 상태 위젯
 * UserStatus: UID_REVIEW_PENDING
 */
export default function UIDPending() {
  return (
    <div>
      <h1 className="text-2xl text-[#B9AB70] text-start mb-2">UID 승인 대기 중입니다.</h1>
      <div className="text-md text-start mb-4 text-[#B9AB70]">
        관리자가 24시간 이내 UID를 승인할 예정입니다.
      </div>
    </div>
  );
}
