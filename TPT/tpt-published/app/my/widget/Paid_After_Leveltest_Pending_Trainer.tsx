'use client';

/**
 * 레벨테스트 완료 후 트레이너 배정 대기 상태 위젯
 * UserStatus: PAID_AFTER_TEST_TRAINER_ASSIGNING
 */
export default function PaidAfterLeveltestPendingTrainer() {
  return (
    <div className="flex flex-col gap-4">
      {/* 상단 텍스트 */}
      <div className="flex flex-col gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
          올바른 트레이딩으로 지속적인 성장을 기대합니다.
        </h1>
        <h3 className="text-base md:text-lg text-center text-gray-600">
          마라톤처럼 긴 여정이 될지라도, 완주할 수 있도록 곁에서 응원하겠습니다
        </h3>
      </div>

      <div className="border-t border-gray-400" />

      <h1 className="text-2xl text-[#B9AB70] text-start mb-2">
        레벨테스트를 완료하셨습니다!
      </h1>
      <div className="text-md text-start mb-4 text-gray-700">
        <p className="mb-2">
          레벨테스트 결과를 분석하여 최적의 트레이너를 배정하고 있습니다.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-gray-700">레벨테스트 완료</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⏳</span>
            <span className="text-sm text-gray-700">결과 분석 및 트레이너 매칭 중</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-400" />
    </div>
  );
}
