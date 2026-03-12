'use client';

/**
 * 레벨테스트 완료 후 트레이너 배정 대기 상태 위젯
 * UserStatus: PAID_AFTER_TEST_TRAINER_ASSIGNING
 */
export default function PaidAfterLeveltestPendingTrainer() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl text-[#B9AB70] text-start mb-2">
        레벨테스트를 완료하셨습니다!
      </h1>
      <div className="text-md text-start mb-4 text-gray-700">
        <p className="mb-2">
          레벨테스트 결과를 분석하여 최적의 트레이너를 배정하고 있습니다.
        </p>
        <p className="mb-2">
          트레이너 배정은 24시간 이내에 완료됩니다.
        </p>
        <p className="text-sm text-gray-500">
          배정이 완료되면 이메일과 문자로 안내해드립니다.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">진행 상황</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-gray-700">레벨테스트 완료</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⏳</span>
            <span className="text-sm text-gray-700">결과 분석 및 트레이너 매칭 중</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">○</span>
            <span className="text-sm text-gray-400">트레이너 배정 완료 대기</span>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-2">
        잠시만 기다려 주시면 곧 연락드리겠습니다.
      </div>
    </div>
  );
}
