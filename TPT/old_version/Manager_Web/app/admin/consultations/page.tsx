'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import {
  getAdminConsultations,
  acceptConsultation,
  updateConsultationMemo,
  createConsultationBlock,
  deleteConsultationBlock,
  formatTimeString,
  type Consultation,
} from '../../api/consultation';

// 상담 가능 시간대
const AVAILABLE_TIME_SLOTS = ['09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30'];

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterProcessed, setFilterProcessed] = useState<'ALL' | 'TRUE' | 'FALSE'>('ALL');

  // 모달 상태
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [memoText, setMemoText] = useState('');

  // 슬롯 차단 상태
  const [blockDate, setBlockDate] = useState('');
  const [blockTime, setBlockTime] = useState('09:00');

  useEffect(() => {
    loadConsultations();
  }, [filterProcessed]);

  const loadConsultations = async () => {
    setLoading(true);
    const response = await getAdminConsultations({
      processed: filterProcessed,
      page: 0,
      size: 100,
    });

    if (response.success && response.data) {
      setConsultations(response.data.content || []);
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleAcceptConsultation = async (consultation: Consultation) => {
    if (
      !confirm(
        `${consultation.customerName}님의 상담을 수락하시겠습니까?\n날짜: ${consultation.date}\n시간: ${formatTimeString(consultation.time)}`
      )
    ) {
      return;
    }

    setLoading(true);
    const response = await acceptConsultation(consultation.id);

    if (response.success) {
      alert('상담이 수락되었습니다.');
      loadConsultations();
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleShowMemoModal = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setMemoText(consultation.memo || '');
    setShowMemoModal(true);
  };

  const handleSaveMemo = async () => {
    if (!selectedConsultation) return;

    setLoading(true);
    const response = await updateConsultationMemo(selectedConsultation.id, memoText);

    if (response.success) {
      alert('메모가 저장되었습니다.');
      setShowMemoModal(false);
      setSelectedConsultation(null);
      setMemoText('');
      loadConsultations();
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleCreateBlock = async () => {
    if (!blockDate || !blockTime) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }

    if (!confirm(`${blockDate} ${blockTime} 시간대를 차단하시겠습니까?`)) {
      return;
    }

    setLoading(true);
    const response = await createConsultationBlock({
      date: blockDate,
      time: blockTime,
    });

    if (response.success) {
      alert('상담 슬롯이 차단되었습니다.');
      setShowBlockModal(false);
      setBlockDate('');
      setBlockTime('09:00');
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleDeleteBlock = async () => {
    if (!blockDate || !blockTime) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }

    if (!confirm(`${blockDate} ${blockTime} 시간대의 차단을 해제하시겠습니까?`)) {
      return;
    }

    setLoading(true);
    const response = await deleteConsultationBlock({
      date: blockDate,
      time: blockTime,
    });

    if (response.success) {
      alert('상담 슬롯 차단이 해제되었습니다.');
      setShowBlockModal(false);
      setBlockDate('');
      setBlockTime('09:00');
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {loading && (
          <div className="bg-white rounded-lg p-6 mb-4">
            <p className="text-lg font-medium">로딩 중...</p>
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">상담 일시 관리</h1>
            <p className="text-gray-600 mt-2">상담 신청을 확인하고 슬롯을 관리할 수 있습니다.</p>
          </div>
          <CustomButton variant="primary" onClick={() => setShowBlockModal(true)}>
            슬롯 차단 관리
          </CustomButton>
        </div>

        {/* 필터 */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilterProcessed('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterProcessed === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilterProcessed('FALSE')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterProcessed === 'FALSE'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            미처리
          </button>
          <button
            onClick={() => setFilterProcessed('TRUE')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterProcessed === 'TRUE'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            처리완료
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    신청자
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    전화번호
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상담 날짜
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상담 시간
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    신청일시
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    처리 상태
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    메모
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      등록된 상담 신청이 없습니다.
                    </td>
                  </tr>
                ) : (
                  consultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {consultation.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {consultation.customerPhoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(consultation.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatTimeString(consultation.time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDateTime(consultation.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            consultation.isProcessed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {consultation.isProcessed ? '처리완료' : '미처리'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="max-w-xs truncate">{consultation.memo || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleShowMemoModal(consultation)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          메모
                        </button>
                        {!consultation.isProcessed && (
                          <button
                            onClick={() => handleAcceptConsultation(consultation)}
                            className="text-green-600 hover:text-green-800 font-medium transition-colors"
                          >
                            수락
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 메모 모달 */}
      {showMemoModal && selectedConsultation && (
        <CustomModal title="상담 메모" onClose={() => setShowMemoModal(false)}>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">상담 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">신청자</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedConsultation.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">전화번호</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedConsultation.customerPhoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">상담 날짜</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(selectedConsultation.date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">상담 시간</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatTimeString(selectedConsultation.time)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="상담 관련 메모를 입력하세요..."
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <CustomButton variant="secondary" onClick={() => setShowMemoModal(false)}>
                취소
              </CustomButton>
              <CustomButton variant="primary" onClick={handleSaveMemo}>
                저장
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      )}

      {/* 슬롯 차단 관리 모달 */}
      {showBlockModal && (
        <CustomModal title="상담 슬롯 차단 관리" onClose={() => setShowBlockModal(false)}>
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">안내</h3>
              <p className="text-sm text-blue-800">
                특정 날짜와 시간대를 차단하면 고객이 해당 시간에 상담을 신청할 수 없습니다.
                <br />
                차단을 해제하면 다시 예약이 가능해집니다.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={blockTime}
                  onChange={(e) => setBlockTime(e.target.value)}
                >
                  {AVAILABLE_TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  사용 가능한 상담 시간대
                </h4>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TIME_SLOTS.map((time) => (
                    <span
                      key={time}
                      className="inline-flex px-3 py-1 text-xs font-medium bg-white border border-gray-300 rounded-full"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <CustomButton variant="secondary" onClick={() => setShowBlockModal(false)}>
                취소
              </CustomButton>
              <CustomButton
                variant="secondary"
                onClick={handleDeleteBlock}
                disabled={!blockDate || !blockTime}
              >
                차단 해제
              </CustomButton>
              <CustomButton
                variant="primary"
                onClick={handleCreateBlock}
                disabled={!blockDate || !blockTime}
              >
                차단 생성
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
