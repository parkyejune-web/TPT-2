'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import CustomButton from '../../components/CustomButton';
import {
  getAdminFeedbackRequests,
  updateBestFeedbacks,
  getInvestmentTypeLabel,
  getCourseStatusLabel,
  type AdminFeedbackCard,
  type AdminFeedbackResponse,
} from '../../api/feedback';

export default function BestFeedbackPage() {
  const [loading, setLoading] = useState(false);
  const [bestFeedbacks, setBestFeedbacks] = useState<AdminFeedbackCard[]>([]);
  const [allFeedbacks, setAllFeedbacks] = useState<AdminFeedbackCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setLoading(true);
    const response = await getAdminFeedbackRequests({ page: 0, size: 100 });

    if (response.success && response.data) {
      const data: AdminFeedbackResponse = response.data;
      setBestFeedbacks(
        data.selectedBestFeedbackListResponseDTO.adminFeedbackCardResponseDTOS || []
      );
      setAllFeedbacks(
        data.totalFeedbackListResponseDTO.adminFeedbackCardResponseDTOS || []
      );
      // 현재 베스트로 선정된 피드백 ID들을 선택 상태로 설정
      setSelectedIds(
        data.selectedBestFeedbackListResponseDTO.adminFeedbackCardResponseDTOS.map(
          (f) => f.id
        ) || []
      );
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      } else {
        if (prev.length >= 3) {
          alert('베스트 피드백은 최대 3개까지 선택할 수 있습니다.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleSave = async () => {
    if (selectedIds.length === 0) {
      alert('최소 1개 이상의 피드백을 선택해주세요.');
      return;
    }

    if (
      !confirm(
        `선택한 ${selectedIds.length}개의 피드백을 베스트 피드백으로 설정하시겠습니까?`
      )
    ) {
      return;
    }

    setLoading(true);
    const response = await updateBestFeedbacks(selectedIds);

    if (response.success) {
      alert('베스트 피드백이 업데이트되었습니다.');
      loadFeedbacks();
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-900">베스트 피드백 관리</h1>
            <p className="text-gray-600 mt-2">
              홈페이지에 노출할 베스트 피드백을 선택하세요 (최대 3개)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              선택됨: <span className="font-bold text-blue-600">{selectedIds.length}</span> / 3
            </span>
            <CustomButton variant="primary" onClick={handleSave} disabled={loading}>
              저장
            </CustomButton>
          </div>
        </div>

        {/* 현재 베스트 피드백 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            현재 베스트 피드백 ({bestFeedbacks.length}개)
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {bestFeedbacks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                현재 베스트 피드백으로 선정된 항목이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                {bestFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border-2 border-yellow-400 bg-yellow-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex px-3 py-1 text-xs font-bold bg-yellow-400 text-yellow-900 rounded-full">
                        ⭐ BEST
                      </span>
                      <span className="text-xs text-gray-500">ID: {feedback.id}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">고객명</p>
                        <p className="text-sm font-bold text-gray-900">{feedback.username}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">담당 트레이너</p>
                        <p className="text-sm text-gray-700">{feedback.trainerName}</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">투자 유형</p>
                          <p className="text-sm text-gray-700">
                            {getInvestmentTypeLabel(feedback.investmentType)}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">완강 여부</p>
                          <p className="text-sm text-gray-700">
                            {getCourseStatusLabel(feedback.courseStatus)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">제공 일자</p>
                        <p className="text-sm text-gray-700">
                          {formatDateTime(feedback.submittedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 전체 피드백 목록 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            전체 피드백 목록 ({allFeedbacks.length}개)
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      선택
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      피드백 ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      고객명
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      담당 트레이너
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      투자 유형
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      완강 여부
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      요청 일자
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      제공 일자
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      베스트
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allFeedbacks.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                        등록된 피드백이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    allFeedbacks.map((feedback) => {
                      const isSelected = selectedIds.includes(feedback.id);
                      return (
                        <tr
                          key={feedback.id}
                          className={`hover:bg-gray-50 transition-colors ${
                            isSelected ? 'bg-blue-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(feedback.id)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {feedback.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {feedback.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {feedback.trainerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {getInvestmentTypeLabel(feedback.investmentType)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {getCourseStatusLabel(feedback.courseStatus)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDateTime(feedback.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDateTime(feedback.submittedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {feedback.isBestFeedback && (
                              <span className="inline-flex px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-full">
                                ⭐ BEST
                              </span>
                            )}
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
      </main>
    </div>
  );
}
