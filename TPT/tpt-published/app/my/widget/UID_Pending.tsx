'use client';

/**
 * UID 승인 대기 중 상태 위젯
 * UserStatus: UID_REVIEW_PENDING
 */
export default function UIDPending() {
  return (
    <div>
      {/* <h1 className="text-2xl text-[#B9AB70] text-start mb-2">UID 승인 대기 중입니다.</h1>
      <div className="text-md text-start mb-4 text-[#B9AB70]">
        관리자가 24시간 이내 UID를 승인할 예정입니다.
      </div> */}

      <h2 className="text-2xl text-[#B9AB70] text-start mb-2">
        계정 확인 절차가 1시간 이내로 마무리되지 않을 경우,
        <br />
        카카오채널 상담톡으로 문의해주세요.
      </h2>
    </div>
  );
}
