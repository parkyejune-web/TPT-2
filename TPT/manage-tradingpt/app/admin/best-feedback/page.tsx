'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import CustomButton from '../../components/CustomButton';
import {
  getAdminFeedbackRequests,
  updateBestFeedbacks,
  updateTrainerWrittenFeedbacks,
  getTrainerWrittenFeedbacks,
  getInvestmentTypeLabel,
  getCourseStatusLabel,
  type AdminFeedbackCard,
  type AdminFeedbackResponse,
  type TrainerWrittenFeedbackItem,
} from '../../api/feedback';
import type { SliceInfo } from '../../api/reviews';

const PAGE_SIZE = 100;

export default function BestFeedbackPage() {
  const [loading, setLoading] = useState(false);
  const [bestFeedbacks, setBestFeedbacks] = useState<AdminFeedbackCard[]>([]);
  const [trainerWrittenFeedbacks, setTrainerWrittenFeedbacks] = useState<TrainerWrittenFeedbackItem[]>([]);
  const [allFeedbacks, setAllFeedbacks] = useState<AdminFeedbackCard[]>([]);
  const [selectedBestIds, setSelectedBestIds] = useState<number[]>([]);
  const [selectedTrainerIds, setSelectedTrainerIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [sliceInfo, setSliceInfo] = useState<SliceInfo | null>(null);

  useEffect(() => {
    loadFeedbacks(currentPage);
    loadTrainerWrittenFeedbacks();
  }, [currentPage]);

  const loadFeedbacks = async (page: number) => {
    setLoading(true);
    const response = await getAdminFeedbackRequests({ page, size: PAGE_SIZE });

    if (response.success && response.data) {
      const data: AdminFeedbackResponse = response.data;
      setBestFeedbacks(
        data.selectedBestFeedbackListResponseDTO.adminFeedbackCardResponseDTOS || []
      );
      const allFeedbacksData = data.totalFeedbackListResponseDTO.adminFeedbackCardResponseDTOS || [];
      setAllFeedbacks(allFeedbacksData);
      setSliceInfo(data.totalFeedbackListResponseDTO.sliceInfo);
      // 현재 베스트로 선정된 피드백 ID들을 선택 상태로 설정
      setSelectedBestIds(
        data.selectedBestFeedbackListResponseDTO.adminFeedbackCardResponseDTOS.map(
          (f) => f.id
        ) || []
      );
      // 현재 트레이더 매매일지로 선정된 피드백 ID들을 선택 상태로 설정
      setSelectedTrainerIds(
        allFeedbacksData.filter((f) => f.isTrainerWritten).map((f) => f.id)
      );
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const loadTrainerWrittenFeedbacks = async () => {
    const response = await getTrainerWrittenFeedbacks({ page: 0, size: 4 });
    if (response.success && response.data) {
      setTrainerWrittenFeedbacks(response.data.feedbacks || []);
    }
  };

  const handleToggleBestSelect = (id: number) => {
    setSelectedBestIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      } else {
        if (prev.length >= 4) {
          alert('베스트 매매일지는 최대 4개까지 선택할 수 있습니다.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleToggleTrainerSelect = (id: number) => {
    setSelectedTrainerIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      } else {
        if (prev.length >= 4) {
          alert('트레이더 매매일지는 최대 4개까지 선택할 수 있습니다.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleSaveBest = async () => {
    if (selectedBestIds.length === 0) {
      alert('최소 1개 이상의 피드백을 선택해주세요.');
      return;
    }

    if (
      !confirm(
        `선택한 ${selectedBestIds.length}개의 피드백을 베스트 매매일지로 설정하시겠습니까?`
      )
    ) {
      return;
    }

    setLoading(true);
    const response = await updateBestFeedbacks(selectedBestIds);

    if (response.success) {
      alert('베스트 매매일지가 업데이트되었습니다.');
      loadFeedbacks(currentPage);
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleSaveTrainer = async () => {
    if (selectedTrainerIds.length === 0) {
      alert('최소 1개 이상의 피드백을 선택해주세요.');
      return;
    }

    if (
      !confirm(
        `선택한 ${selectedTrainerIds.length}개의 피드백을 트레이더 매매일지로 설정하시겠습니까?`
      )
    ) {
      return;
    }

    setLoading(true);
    const response = await updateTrainerWrittenFeedbacks(selectedTrainerIds);

    if (response.success) {
      alert('트레이더 매매일지가 업데이트되었습니다.');
      loadTrainerWrittenFeedbacks();
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">일지 관리</h1>
          <p className="text-gray-600 mt-2">
            홈페이지에 노출할 베스트 매매일지와 트레이더 매매일지를 선택하세요 (각 최대 4개)
          </p>
        </div>

        {/* 현재 베스트 매매일지 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              현재 베스트 매매일지 ({bestFeedbacks.length}개)
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {bestFeedbacks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                현재 베스트 매매일지로 선정된 항목이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                {bestFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border-2 border-yellow-400 bg-yellow-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex px-3 py-1 text-xs font-bold bg-yellow-400 text-yellow-900 rounded-full">
                        BEST
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

        {/* 현재 트레이더 매매일지 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              현재 트레이더 매매일지 ({trainerWrittenFeedbacks.length}개)
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {trainerWrittenFeedbacks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                현재 트레이더 매매일지로 선정된 항목이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                {trainerWrittenFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border-2 border-blue-400 bg-blue-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex px-3 py-1 text-xs font-bold bg-blue-400 text-blue-900 rounded-full">
                        TRADER
                      </span>
                      <span className="text-xs text-gray-500">ID: {feedback.id}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">제목</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{feedback.title}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">트레이너</p>
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
                          <p className="text-xs text-gray-500">P&L</p>
                          <p className={`text-sm font-medium ${feedback.totalAssetPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {feedback.totalAssetPnl >= 0 ? '+' : ''}{feedback.totalAssetPnl?.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">작성일</p>
                        <p className="text-sm text-gray-700">
                          {formatDateTime(feedback.createdAt)}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              전체 피드백 목록 ({allFeedbacks.length}개{sliceInfo && !sliceInfo.isLast && ' +'})
              {sliceInfo && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  - {currentPage + 1}페이지
                </span>
              )}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  베스트: <span className="font-bold text-yellow-600">{selectedBestIds.length}</span> / 4
                </span>
                <CustomButton variant="primary" onClick={handleSaveBest} disabled={loading}>
                  베스트 저장
                </CustomButton>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  트레이더: <span className="font-bold text-blue-600">{selectedTrainerIds.length}</span> / 4
                </span>
                <CustomButton variant="secondary" onClick={handleSaveTrainer} disabled={loading}>
                  트레이더 저장
                </CustomButton>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex flex-col items-center">
                        <span className="text-yellow-600 mb-1">베스트</span>
                        <span className="text-xs text-gray-400">매매일지 지정</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex flex-col items-center">
                        <span className="text-blue-600 mb-1">트레이더</span>
                        <span className="text-xs text-gray-400">매매일지 지정</span>
                      </div>
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
                      UID
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
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allFeedbacks.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                        등록된 피드백이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    allFeedbacks.map((feedback) => {
                      const isBestSelected = selectedBestIds.includes(feedback.id);
                      const isTrainerSelected = selectedTrainerIds.includes(feedback.id);
                      return (
                        <tr
                          key={feedback.id}
                          className={`hover:bg-gray-50 transition-colors ${
                            isBestSelected ? 'bg-yellow-50' : isTrainerSelected ? 'bg-blue-50' : ''
                          }`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <input
                              type="checkbox"
                              checked={isBestSelected}
                              onChange={() => handleToggleBestSelect(feedback.id)}
                              className="w-5 h-5 text-yellow-500 border-yellow-300 rounded focus:ring-yellow-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <input
                              type="checkbox"
                              checked={isTrainerSelected}
                              onChange={() => handleToggleTrainerSelect(feedback.id)}
                              className="w-5 h-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {feedback.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {feedback.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {feedback.uid || '-'}
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
                            <div className="flex gap-1">
                              {feedback.isBestFeedback && (
                                <span className="inline-flex px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-full">
                                  BEST
                                </span>
                              )}
                              {isTrainerSelected && (
                                <span className="inline-flex px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">
                                  TRADER
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {/* 페이지네이션 */}
            {sliceInfo && (
              <div className="flex justify-center items-center gap-2 py-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage(0)}
                  disabled={sliceInfo.isFirst || loading}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  처음
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={sliceInfo.isFirst || loading}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-gray-900 bg-gray-100 rounded-md">
                  {currentPage + 1} 페이지
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={sliceInfo.isLast || loading}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
