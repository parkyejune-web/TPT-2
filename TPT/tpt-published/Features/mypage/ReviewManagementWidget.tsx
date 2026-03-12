'use client';

import { useRouter } from 'next/navigation';
import { MessageSquarePlus, List } from 'lucide-react';
import CustomButton from '../../Shared/ui/CustomButton';

/**
 * 후기 관리 위젯 (TRAINER_ASSIGNED 상태의 유료 회원 전용)
 * - 후기 작성 / 내 후기 확인 기능 제공
 */
export default function ReviewManagementWidget() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-[#F9F7F0] to-[#F4F1E6] border border-[#E5DFC9] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquarePlus size={24} className="text-[#B9AB70]" />
        <h3 className="text-lg font-semibold text-gray-800">후기 관리</h3>
      </div>

      <p className="text-sm text-gray-600 mb-5">
        TPT 서비스 이용 경험을 공유해주세요.
        <br />
        소중한 후기는 다른 고객님들께 큰 도움이 됩니다.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <CustomButton
          variant="prettyFull"
          onClick={() => router.push('/my/review')}
          className="flex items-center justify-center gap-2"
        >
          <MessageSquarePlus size={18} />
          후기 작성하기
        </CustomButton>
        <CustomButton
          variant="normalClean"
          onClick={() => router.push('/my/review?tab=list')}
          className="flex items-center justify-center gap-2"
        >
          <List size={18} />
          내 후기 확인
        </CustomButton>
      </div>
    </div>
  );
}
