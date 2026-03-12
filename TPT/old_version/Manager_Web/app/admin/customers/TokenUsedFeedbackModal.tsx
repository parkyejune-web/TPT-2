'use client';

import { useState, useEffect } from 'react';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import {
  getTokenUsedFeedbackRequests,
  getInvestmentTypeLabel,
  getCourseStatusLabel,
  getFeedbackStatusLabel,
  getFeedbackStatusColor,
  type TokenUsedFeedbackListItem,
} from '../../api/feedback';

interface TokenUsedFeedbackModalProps {
  onClose: () => void;
}

export default function TokenUsedFeedbackModal({ onClose }: TokenUsedFeedbackModalProps) {
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<TokenUsedFeedbackListItem[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    loadFeedbacks(0);
  }, []);

  const loadFeedbacks = async (page: number) => {
    setLoading(true);
    const response = await getTokenUsedFeedbackRequests({ page, size: pageSize });

    if (response.success && response.data) {
      if (page === 0) {
        setFeedbacks(response.data.feedbacks || []);
      } else {
        setFeedbacks((prev) => [...prev, ...(response.data?.feedbacks || [])]);
      }
      setHasNext(response.data.sliceInfo.hasNext);
      setCurrentPage(page);
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasNext) {
      loadFeedbacks(currentPage + 1);
    }
  };

  const handleViewDetail = (feedback: TokenUsedFeedbackListItem) => {
    // TODO: 피드백 상세 조회 구현 예정
    alert(
      `피드백 상세 조회 기능은 다음 단계에서 구현됩니다.\n\n` +
        `피드백 ID: ${feedback.id}\n` +
        `투자 유형: ${getInvestmentTypeLabel(feedback.investmentType)}\n` +
        `상태: ${getFeedbackStatusLabel(feedback.status)}`
    );
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
    <CustomModal title="토큰 차감형 피드백 요청 조회" onClose={onClose} size="2xl">
        <p className="text-sm text-gray-600 mb-6">
          고객이 토큰을 사용하여 요청한 피드백 목록입니다.
        </p>

        {loading && feedbacks.length === 0 && (
          <div className="py-12 text-center text-gray-500">로딩 중...</div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    피드백 ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    고객명
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    투자 유형
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    완강 여부
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    토큰 사용
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    응답 트레이너
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    피드백 날짜
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    요청 일시
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbacks.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                      토큰 사용 피드백 요청이 없습니다.
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((feedback) => (
                    <tr key={feedback.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{feedback.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {feedback.customerName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {getInvestmentTypeLabel(feedback.investmentType)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {getCourseStatusLabel(feedback.courseStatus)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getFeedbackStatusColor(
                            feedback.status
                          )}`}
                        >
                          {getFeedbackStatusLabel(feedback.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {feedback.tokenAmount}개
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {feedback.respondedTrainerName || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {feedback.feedbackYear}-
                        {String(feedback.feedbackMonth).padStart(2, '0')}-
                        {String(feedback.feedbackDay).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatDateTime(feedback.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewDetail(feedback)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 더보기 버튼 */}
        {hasNext && (
          <div className="mt-4 text-center">
            <CustomButton variant="secondary" onClick={handleLoadMore} disabled={loading}>
              {loading ? '로딩 중...' : '더보기'}
            </CustomButton>
          </div>
        )}

        {/* 하단 통계 */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>총 {feedbacks.length}개의 피드백 요청</span>
          {hasNext && <span>스크롤하여 더 많은 항목을 확인하세요</span>}
        </div>
    </CustomModal>
  );
}
