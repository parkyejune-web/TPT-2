'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '../../components/AdminHeader';
import CustomButton from '../../components/CustomButton';
import { adminLogout } from '../../api/auth';
import {
  getMyCustomerNewFeedbackRequests,
  type MyCustomerNewFeedbackListItem,
  getInvestmentTypeLabel,
  getCourseStatusLabel,
} from '../../api/feedback';

export default function MyPage() {
  const router = useRouter();
  const [feedbackRequests, setFeedbackRequests] = useState<MyCustomerNewFeedbackListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    loadFeedbackRequests();
  }, [currentPage]);

  const loadFeedbackRequests = async () => {
    setLoading(true);
    try {
      const response = await getMyCustomerNewFeedbackRequests({
        page: currentPage,
        size: 12,
      });

      if (response.success && response.data) {
        setFeedbackRequests(response.data.feedbacks);
        setHasNext(response.data.sliceInfo.hasNext);
      } else {
        console.error('피드백 요청 목록 로드 실패:', response.error);
      }
    } catch (error) {
      console.error('피드백 요청 목록 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('로그아웃 하시겠습니까?')) return;

    const response = await adminLogout();
    if (response.success) {
      alert('로그아웃되었습니다.');
      router.push('/login');
    } else {
      alert(`로그아웃 실패: ${response.error}`);
    }
  };

  const handleFeedbackClick = (feedbackId: number) => {
    router.push(`/admin/feedback/${feedbackId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-[1920px] mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          <CustomButton variant="secondary" onClick={handleLogout}>
            로그아웃
          </CustomButton>
        </div>

        {/* 내 담당 고객의 새로운 피드백 요청 리스트 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            담당 고객의 새로운 피드백 요청
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : feedbackRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              새로운 피드백 요청이 없습니다.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feedbackRequests.map((feedback) => (
                  <div
                    key={feedback.id}
                    onClick={() => handleFeedbackClick(feedback.id)}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{feedback.customerName}</h3>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        신규
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{feedback.title}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {getInvestmentTypeLabel(feedback.investmentType)}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {getCourseStatusLabel(feedback.courseStatus)}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              {(currentPage > 0 || hasNext) && (
                <div className="flex justify-center gap-2 mt-6">
                  <CustomButton
                    variant="secondary"
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                  >
                    이전
                  </CustomButton>
                  <CustomButton
                    variant="secondary"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={!hasNext}
                  >
                    다음
                  </CustomButton>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
