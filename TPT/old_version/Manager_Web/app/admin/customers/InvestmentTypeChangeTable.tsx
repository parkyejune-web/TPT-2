'use client';

import { useState } from 'react';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import type { ChangeRequest, InvestmentType } from '../../api/investmentTypeChange';

interface InvestmentTypeChangeTableProps {
  changeRequests: ChangeRequest[];
  onProcess: (requestId: number, approved: boolean, rejectionReason?: string) => Promise<void>;
}

export default function InvestmentTypeChangeTable({
  changeRequests,
  onProcess,
}: InvestmentTypeChangeTableProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const getInvestmentTypeLabel = (type: InvestmentType) => {
    const labels: Record<InvestmentType, string> = {
      SWING: '스윙',
      DAY: '데이',
      SCALPING: '스켈핑',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      PENDING: '대기중',
      APPROVED: '승인됨',
      REJECTED: '거부됨',
      CANCELLED: '취소됨',
    };
    return {
      className: badges[status as keyof typeof badges] || badges.PENDING,
      label: labels[status as keyof typeof labels] || status,
    };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
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

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
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

  const handleShowDetail = (request: ChangeRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleApprove = async (request: ChangeRequest) => {
    if (!confirm(`${request.customerName}님의 투자 유형 변경 신청을 승인하시겠습니까?`)) {
      return;
    }

    await onProcess(request.id, true);
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  const handleRejectClick = (request: ChangeRequest) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setShowDetailModal(false);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedRequest) return;
    if (!rejectionReason.trim()) {
      alert('거부 사유를 입력해주세요.');
      return;
    }

    await onProcess(selectedRequest.id, false, rejectionReason);
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  // 대기 중인 신청만 필터링
  const pendingRequests = changeRequests.filter((req) => req.status === 'PENDING');

  return (
    <>
      <div className="mb-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">투자 유형 변경 승인 처리</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    고객명
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    현재 유형
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    변경 요청 유형
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    신청일
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    변경 예정일
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      대기 중인 투자 유형 변경 신청이 없습니다.
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((request) => {
                  const statusBadge = getStatusBadge(request.status);
                  return (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {getInvestmentTypeLabel(request.currentType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="font-medium text-blue-600">
                          {getInvestmentTypeLabel(request.requestedType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(request.requestedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(request.targetChangeDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusBadge.className}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleShowDetail(request)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  );
                })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 상세보기 모달 */}
      {showDetailModal && selectedRequest && (
        <CustomModal title="투자 유형 변경 신청 상세" onClose={() => setShowDetailModal(false)} size="lg">
            <div className="space-y-6">
              {/* 고객 정보 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">신청 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">고객명</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedRequest.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">신청일</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(selectedRequest.requestedDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">변경 예정일</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(selectedRequest.targetChangeDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">상태</p>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        getStatusBadge(selectedRequest.status).className
                      }`}
                    >
                      {getStatusBadge(selectedRequest.status).label}
                    </span>
                  </div>
                </div>
              </div>

              {/* 투자 유형 변경 정보 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">투자 유형 변경</h3>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">현재 유형</p>
                    <p className="text-lg font-bold text-gray-900">
                      {getInvestmentTypeLabel(selectedRequest.currentType)}
                    </p>
                  </div>
                  <div className="text-2xl text-gray-400">→</div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">변경 요청 유형</p>
                    <p className="text-lg font-bold text-blue-600">
                      {getInvestmentTypeLabel(selectedRequest.requestedType)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 변경 사유 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">변경 사유</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedRequest.reason}
                  </p>
                </div>
              </div>

              {/* 처리 정보 (승인/거부된 경우) */}
              {selectedRequest.status !== 'PENDING' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">처리 정보</h3>
                  <div className="space-y-2">
                    {selectedRequest.processedAt && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">처리일시</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDateTime(selectedRequest.processedAt)}
                        </p>
                      </div>
                    )}
                    {selectedRequest.approvedByName && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">처리자</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedRequest.approvedByName}
                        </p>
                      </div>
                    )}
                    {selectedRequest.rejectionReason && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">거부 사유</p>
                        <p className="text-sm font-medium text-red-600">
                          {selectedRequest.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <CustomButton variant="secondary" onClick={() => setShowDetailModal(false)}>
                닫기
              </CustomButton>
              {selectedRequest.status === 'PENDING' && (
                <>
                  <CustomButton
                    variant="secondary"
                    onClick={() => handleRejectClick(selectedRequest)}
                  >
                    거부
                  </CustomButton>
                  <CustomButton variant="primary" onClick={() => handleApprove(selectedRequest)}>
                    승인
                  </CustomButton>
                </>
              )}
            </div>
        </CustomModal>
      )}

      {/* 거부 사유 입력 모달 */}
      {showRejectModal && selectedRequest && (
        <CustomModal title="신청 거부" onClose={() => setShowRejectModal(false)} size="md">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{selectedRequest.customerName}</span>님의 투자 유형
                변경 신청을 거부하시겠습니까?
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  거부 사유 (필수)
                </label>
                <textarea
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="거부 사유를 입력해주세요. 고객에게 표시됩니다."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <CustomButton variant="secondary" onClick={() => setShowRejectModal(false)}>
                취소
              </CustomButton>
              <CustomButton variant="primary" onClick={handleRejectSubmit}>
                거부 확정
              </CustomButton>
            </div>
        </CustomModal>
      )}
    </>
  );
}
