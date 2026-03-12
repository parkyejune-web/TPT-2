'use client';

import { Clock } from 'lucide-react';

/**
 * 결제 완료 후 트레이너 배정 대기 상태 위젯
 * UserStatus: PAID_BEFORE_TRAINER_ASSIGNING
 */
export default function PaidBeforeTrainerAssigning() {
  return (
    <div className="flex flex-col gap-4">
      {/* 상단 텍스트 */}
      <div className="flex flex-col gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
          결제가 완료되었습니다.
        </h1>
        {/* <h3 className="text-base md:text-lg text-center text-gray-600">
          트레이너 배정이 진행 중입니다.
        </h3> */}
      </div>

      <div className="border-t border-gray-400" />

      {/* 안내 메시지 */}
      {/* <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Clock size={28} className="text-amber-600" />
          <span className="text-lg font-semibold text-amber-800">
            트레이너 배정 중
          </span>
        </div>
        <p className="text-center text-amber-700">
          트레이너 배정 중입니다.
          <br />
          트레이너 배정 후 매매일지에 대한 피드백을 요청하실 수 있습니다.
        </p>
      </div> */}
    </div>
  );
}
