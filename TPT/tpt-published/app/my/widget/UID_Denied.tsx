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
        <p className="text-sm text-gray-500">
          고객센터로 올바른 UID를 알려주시기 바랍니다.
        </p>
      </div>
    </div>
  );
}
