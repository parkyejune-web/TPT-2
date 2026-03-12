'use client';

import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { getMyConsultations } from '../../../Shared/api/services/consultationService';
import type { ConsultationResponse } from '../../../Shared/api/services/consultationService';
import ConsultationModal from '../../../Features/mypage/ConsultationModal';

/**
 * UID 승인 완료 상태 위젯
 * UserStatus: UID_APPROVED
 */
export default function UIDApproved() {
  const [consultations, setConsultations] = useState<ConsultationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

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

      {/* 상담 예약 버튼 */}
      {/* <div className="mt-6">
        <button
          onClick={() => setIsConsultationModalOpen(true)}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#D2C693] to-[#928346] text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold hover:from-[#C2B683] hover:to-[#827336]"
        >
          <Phone size={24} />
          <span>전화 상담 예약하기</span>
        </button>
      </div> */}

      {/* 상담 예약 현황 */}
      {/* {loading ? (
        <div className="text-center text-gray-500 mt-6">로딩 중...</div>
      ) : consultations.length > 0 ? (
        <div className="bg-gray-50 rounded-md p-4 mt-6">
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
        <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500 mt-6">
          예약된 상담이 없습니다.
        </div>
      )} */}

      {/* 상담 예약 모달 */}
      {/* <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      /> */}
    </div>
  );
}
