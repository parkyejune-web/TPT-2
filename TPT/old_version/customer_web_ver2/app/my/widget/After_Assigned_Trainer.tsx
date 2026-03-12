'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '../../../Shared/store/authStore';
import CustomButton from '../../../Shared/ui/CustomButton';

/**
 * 트레이너 배정 완료 상태 위젯
 * UserStatus: TRAINER_ASSIGNED
 */
export default function AfterAssignedTrainer() {
  const router = useRouter();
  const { user } = useAuthStore();

  const trainerName = user?.trainerName || '담당 트레이너';
  const trainerImage = (user?.profileImage && user.profileImage.trim() !== '')
    ? user.profileImage
    : '/images/default_trainer.png';

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl text-[#B9AB70] text-start mb-2">
        트레이너 배정이 완료되었습니다!
      </h1>
      <div className="text-md text-start mb-4 text-gray-700">
        <p className="mb-2">
          이제 전문 트레이너와 함께 트레이딩 실력을 향상시킬 수 있습니다.
        </p>
      </div>

      {/* 트레이너 정보 카드 */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400">
            <Image
              src={trainerImage}
              alt={trainerName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{trainerName}</h3>
            <p className="text-sm text-gray-600">나의 전담 트레이너</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <p>✓ 1:1 맞춤형 피드백 제공</p>
          <p>✓ 실시간 트레이딩 분석 및 조언</p>
          <p>✓ 정기적인 실력 향상 리포트</p>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex flex-col gap-3">
        <CustomButton
          variant="prettyFull"
          onClick={() => router.push('/feedback-request/create')}
        >
          피드백 요청하기
        </CustomButton>
        <div className="grid grid-cols-2 gap-3">
          <CustomButton
            variant="normalClean"
            onClick={() => router.push('/feedback-view')}
          >
            피드백 보기
          </CustomButton>
          <CustomButton
            variant="normalClean"
            onClick={() => router.push('/my/trainer')}
          >
            트레이너 정보
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
