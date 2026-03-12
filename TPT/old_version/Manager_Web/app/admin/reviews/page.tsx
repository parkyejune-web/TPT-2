'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import {
  getPublicReviews,
  createReviewReply,
  updateReviewVisibility,
  type Review,
} from '../../api/reviews';
import ReviewCreateModal from './ReviewCreateModal';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  // 모달 상태
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 답변 관련
  const [replyText, setReplyText] = useState('');
  const [isEditingReply, setIsEditingReply] = useState(false);

  useEffect(() => {
    loadReviews(0);
  }, []);

  const loadReviews = async (page: number) => {
    setLoading(true);
    const response = await getPublicReviews({ page, size: 12 });

    if (response.success && response.data) {
      if (page === 0) {
        setReviews(response.data.reviews || []);
      } else {
        setReviews((prev) => [...prev, ...(response.data?.reviews || [])]);
      }
      setHasNext(response.data.sliceInfo?.hasNext || false);
      setCurrentPage(page);
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (hasNext && !loading) {
      loadReviews(currentPage + 1);
    }
  };

  const handleShowDetail = (review: Review) => {
    setSelectedReview(review);
    setReplyText(review.trainerReply?.replyContent || '');
    setIsEditingReply(!review.trainerReply);
    setShowDetailModal(true);
  };

  const handleSaveReply = async () => {
    if (!selectedReview || !replyText.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    const response = await createReviewReply(selectedReview.id, replyText);

    if (response.success) {
      alert('답변이 저장되었습니다.');
      setShowDetailModal(false);
      setSelectedReview(null);
      setReplyText('');
      setIsEditingReply(false);
      loadReviews(0);
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleToggleVisibility = async (review: Review) => {
    const newVisibility = !review.isPublic;
    const confirmMessage = newVisibility
      ? '이 리뷰를 공개하시겠습니까?'
      : '이 리뷰를 비공개로 전환하시겠습니까?';

    if (!confirm(confirmMessage)) return;

    setLoading(true);
    const response = await updateReviewVisibility(review.id, newVisibility);

    if (response.success) {
      alert(`리뷰가 ${newVisibility ? '공개' : '비공개'}로 변경되었습니다.`);
      loadReviews(0);
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedReview(null);
    setReplyText('');
    setIsEditingReply(false);
  };

  const handleCreateModalClose = (reload?: boolean) => {
    setShowCreateModal(false);
    if (reload) {
      loadReviews(0);
    }
  };

  const formatDate = (dateString: string) => {
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {loading && currentPage === 0 && (
          <div className="bg-white rounded-lg p-6 mb-4">
            <p className="text-lg font-medium">로딩 중...</p>
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">후기 관리</h1>
              <p className="text-gray-600 mt-2">고객 리뷰를 확인하고 답변을 작성할 수 있습니다.</p>
            </div>
            <CustomButton variant="primary" onClick={() => setShowCreateModal(true)}>
              리뷰 데이터 생성
            </CustomButton>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    리뷰 내용
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    작성일시
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    답변 상태
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    공개 여부
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      등록된 리뷰가 없습니다.
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {review.customerName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="max-w-md">{truncateText(review.content, 100)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(review.submittedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            review.trainerReply
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {review.trainerReply ? '답변완료' : '미답변'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleVisibility(review)}
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                            review.isPublic
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {review.isPublic ? '공개' : '비공개'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleShowDetail(review)}
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

          {/* 더보기 버튼 */}
          {hasNext && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
              <CustomButton variant="secondary" onClick={handleLoadMore} disabled={loading}>
                {loading ? '로딩 중...' : '더보기'}
              </CustomButton>
            </div>
          )}
        </div>
      </main>

      {/* 리뷰 생성 모달 */}
      {showCreateModal && <ReviewCreateModal onClose={handleCreateModalClose} />}

      {/* 리뷰 상세 모달 */}
      {showDetailModal && selectedReview && (
        <CustomModal title="리뷰 상세" onClose={handleCloseModal}>
          <div className="flex justify-end gap-2 mb-4">
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                selectedReview.trainerReply
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {selectedReview.trainerReply ? '답변완료' : '미답변'}
            </span>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                selectedReview.isPublic
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {selectedReview.isPublic ? '공개' : '비공개'}
            </span>
          </div>

          <div className="space-y-6">
            {/* 고객 정보 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">작성자 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">작성자</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedReview.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">작성일시</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(selectedReview.submittedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* 리뷰 내용 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">리뷰 내용</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedReview.content}
                </p>
              </div>
            </div>

            {/* 답변 섹션 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700">트레이너 답변</h3>
                {selectedReview.trainerReply && !isEditingReply && (
                  <button
                    onClick={() => setIsEditingReply(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    수정
                  </button>
                )}
              </div>

              {selectedReview.trainerReply && !isEditingReply ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedReview.trainerReply.replyContent}
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    <span>
                      답변일시: {formatDate(selectedReview.trainerReply.repliedAt)}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <textarea
                    className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="답변을 작성해주세요..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <CustomButton
                variant="secondary"
                onClick={() => handleToggleVisibility(selectedReview)}
              >
                {selectedReview.isPublic ? '비공개로 전환' : '공개로 전환'}
              </CustomButton>
              <div className="flex gap-3">
                <CustomButton variant="secondary" onClick={handleCloseModal}>
                  닫기
                </CustomButton>
                {(!selectedReview.trainerReply || isEditingReply) && (
                  <CustomButton variant="primary" onClick={handleSaveReply}>
                    답변 저장
                  </CustomButton>
                )}
              </div>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
