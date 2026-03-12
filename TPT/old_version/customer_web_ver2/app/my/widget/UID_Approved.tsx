'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMyConsultations } from '../../../Shared/api/services/consultationService';
import type { ConsultationResponse } from '../../../Shared/api/services/consultationService';
import CustomButton from '../../../Shared/ui/CustomButton';

/**
 * UID 승인 완료 상태 위젯
 * UserStatus: UID_APPROVED
 */
export default function UIDApproved() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<ConsultationResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConsultations();

    // 상담 예약이 변경되었을 때 자동으로 목록 새로고침
    const handleConsultationUpdate = () => {
      loadConsultations();
    };

    window.addEventListener('consultationUpdated', handleConsultationUpdate);

    return () => {
      window.removeEventListener('consultationUpdated', handleConsultationUpdate);
    };
  }, []);

  const loadConsultations = async () => {
    setLoading(true);
    const result = await getMyConsultations();
    if (result.success && result.data) {
      setConsultations(result.data.slice(0, 3)); // 최근 3개만 표시
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl text-green-600 text-start mb-2">UID 승인이 완료되었습니다!</h1>
      <div className="text-md text-start mb-4 text-gray-700">
        <p className="mb-2">
          TPT 서비스 이용을 위한 첫 단계가 완료되었습니다.
        </p>
        <p className="mb-2">
          이제 상담 예약을 진행하시거나, 프리미엄 멤버십에 가입하실 수 있습니다.
        </p>
      </div>

      {/* 상담 예약 현황 */}
      {loading ? (
        <div className="text-center text-gray-500">로딩 중...</div>
      ) : consultations.length > 0 ? (
        <div className="bg-gray-50 rounded-md p-4">
          <h3 className="text-lg font-semibold mb-3">예약된 상담</h3>
          <div className="space-y-2">
            {consultations.map((c) => (
              <div key={c.id} className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm font-medium">
                  {c.date} {c.time.substring(0, 5)}
                </p>
                <p className="text-xs text-gray-500">전화 상담 (약 1시간)</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500">
          예약된 상담이 없습니다.
        </div>
      )}

      {/* <div className="flex gap-3">
        <CustomButton variant="prettyFull" onClick={() => router.push('/my')}>
          상담 예약하기
        </CustomButton>
        <CustomButton variant="normalClean" onClick={() => router.push('/payment')}>
          멤버십 구매
        </CustomButton>
      </div> */}
    </div>
  );
}
