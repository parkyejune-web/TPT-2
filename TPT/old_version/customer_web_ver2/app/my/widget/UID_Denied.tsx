'use client';

import { useRouter } from 'next/navigation';
import CustomButton from '../../../Shared/ui/CustomButton';

/**
 * UID 승인 거부 상태 위젯
 * UserStatus: UID_REJECTED
 */
export default function UIDDenied() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl text-red-600 text-start mb-2">UID 승인이 거부되었습니다.</h1>
      <div className="text-md text-start mb-4 text-gray-700">
        <p className="mb-2">
          입력하신 UID 정보가 거래소와 일치하지 않거나, 유효하지 않은 정보입니다.
        </p>
        <p className="mb-2">
          올바른 UID를 다시 확인하신 후 재등록해주시기 바랍니다.
        </p>
        <p className="text-sm text-gray-500">
          문의사항이 있으시면 고객센터로 연락 주시기 바랍니다.
        </p>
      </div>
      <div className="flex gap-3">
        <CustomButton variant="prettyFull" onClick={() => router.push('/my/uid-resubmit')}>
          UID 재등록하기
        </CustomButton>
        <CustomButton variant="normalClean" onClick={() => router.push('/complaint/create')}>
          문의하기
        </CustomButton>
      </div>
    </div>
  );
}
