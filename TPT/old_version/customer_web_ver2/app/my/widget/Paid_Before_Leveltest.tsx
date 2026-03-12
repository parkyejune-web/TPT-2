'use client';

import { useRouter } from 'next/navigation';
import CustomButton from '../../../Shared/ui/CustomButton';

/**
 * 결제 완료 후 레벨테스트 전 상태 위젯
 * UserStatus: PAID_BEFORE_TEST
 */
export default function PaidBeforeLeveltest() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl text-[#B9AB70] text-start mb-2">
        프리미엄 멤버십에 가입하셨습니다!
      </h1>
      <div className="text-md text-start mb-4 text-gray-700">
        <p className="mb-2">
          TPT 프리미엄 서비스 이용을 환영합니다.
        </p>
        <p className="mb-2">
          트레이너 배정을 위해 레벨테스트를 진행해주세요.
        </p>
        <p className="text-sm text-gray-500">
          레벨테스트는 약 60분 소요되며, 한 번만 응시 가능합니다.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">레벨테스트 안내</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>총 소요시간: 60분</li>
          <li>문제 유형: 객관식, 주관식, 차트 분석</li>
          <li>시험 시작 후 중단 불가</li>
          <li>결과는 24시간 이내 확인 가능</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <CustomButton variant="prettyFull" onClick={() => router.push('/my/leveltest')}>
          레벨테스트 시작하기
        </CustomButton>
        <CustomButton variant="normalClean" onClick={() => router.push('/my/leveltest/guide')}>
          자세히 보기
        </CustomButton>
      </div>
    </div>
  );
}
