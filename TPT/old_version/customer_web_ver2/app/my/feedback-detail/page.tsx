'use client';

export const dynamic = 'force-dynamic';



import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { feedbackService } from '../../../Shared/api/services';

/**
 * 피드백 상세 보기 페이지
 */
export default function FeedbackDetailPage() {
  const searchParams = useSearchParams();
  const feedbackId = searchParams.get('id');

  const [feedbackDetail, setFeedbackDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!feedbackId) {
      setError('피드백 ID가 없습니다.');
      setLoading(false);
      return;
    }

    const loadFeedbackDetail = async () => {
      try {
        setLoading(true);
        const response = await feedbackService.getFeedbackDetail(Number(feedbackId));

        if (response.success && response.data) {
          setFeedbackDetail(response.data);
        } else {
          setError(response.error || '피드백 상세 정보를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('피드백 상세 조회 오류:', err);
        setError('네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadFeedbackDetail();
  }, [feedbackId]);

  if (loading) {
    return (
      <div className="w-full p-6 mt-20 flex flex-col items-center">
        <div className="text-center py-10">로딩 중...</div>
      </div>
    );
  }

  if (error || !feedbackDetail) {
    return (
      <div className="w-full p-6 mt-20 flex flex-col items-center">
        <div className="text-center text-red-500">
          {error || '피드백 정보를 찾을 수 없습니다.'}
        </div>
      </div>
    );
  }

  const detail =
    feedbackDetail.swingDetail || feedbackDetail.dayDetail || feedbackDetail.scalpingDetail;

  if (!detail) {
    return (
      <div className="w-full p-6 mt-20 flex flex-col items-center">
        <div className="text-center text-red-500">피드백 상세 데이터가 없습니다.</div>
      </div>
    );
  }

  const investmentType = feedbackDetail.investmentType;
  const investmentTypeLabel =
    investmentType === 'DAY' ? '데이' : investmentType === 'SWING' ? '스윙' : '스켈핑';

  return (
    <div className="w-full p-6 mt-20 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          {investmentTypeLabel} 피드백 상세 #{feedbackId}
        </h1>

        {/* 기본 정보 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">종목</p>
              <p className="font-medium">{detail.category || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">포지션</p>
              <p className="font-medium">{detail.position || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">레버리지</p>
              <p className="font-medium">{detail.leverage || '-'}x</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">손익</p>
              <p
                className={`font-medium ${Number(detail.pl) > 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {detail.pl || '-'}%
              </p>
            </div>
          </div>
        </div>

        {/* 스크린샷 */}
        {detail.screenshotUrl && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">스크린샷</h2>
            <img
              src={detail.screenshotUrl}
              alt="피드백 스크린샷"
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* 매매 복기 */}
        {detail.tradingReview && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">매매 복기</h2>
            <p className="bg-gray-50 p-4 rounded whitespace-pre-wrap">{detail.tradingReview}</p>
          </div>
        )}

        {/* 트레이너 피드백 */}
        {detail.trainerFeedback && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">트레이너 피드백</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="whitespace-pre-wrap">{detail.trainerFeedback}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
