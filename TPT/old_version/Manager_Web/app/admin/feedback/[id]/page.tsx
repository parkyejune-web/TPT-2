'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminHeader from '../../../components/AdminHeader';
import CustomButton from '../../../components/CustomButton';
import RichTextEditor from '../../../components/RichTextEditor';
import BasicDetailView from '../../../components/feedback/BasicDetailView';
import SwingDetailView from '../../../components/feedback/SwingDetailView';
import DayDetailView from '../../../components/feedback/DayDetailView';
import {
  getAdminFeedbackRequestDetail,
  createFeedbackResponse,
  updateFeedbackResponse,
  type FeedbackRequestDetail,
  getInvestmentTypeLabel,
  getFeedbackStatusLabel,
  getFeedbackStatusColor,
} from '../../../api/feedback';

export default function FeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const feedbackId = Number(params.id);

  const [feedbackDetail, setFeedbackDetail] = useState<FeedbackRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [responseTitle, setResponseTitle] = useState('');
  const [responseContent, setResponseContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadFeedbackDetail();
  }, [feedbackId]);

  const loadFeedbackDetail = async () => {
    setLoading(true);
    try {
      const response = await getAdminFeedbackRequestDetail(feedbackId);
      if (response.success && response.data) {
        setFeedbackDetail(response.data);

        // 이미 답변이 있는 경우
        if (response.data.feedbackResponse) {
          setResponseTitle(response.data.feedbackResponse.title);
          setResponseContent(response.data.feedbackResponse.content);
        }
      } else {
        alert('피드백 상세 정보를 불러올 수 없습니다.');
        router.push('/admin/mypage');
      }
    } catch (error) {
      console.error('피드백 상세 조회 오류:', error);
      alert('피드백 상세 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!responseTitle.trim()) {
      alert('피드백 제목을 입력해주세요.');
      return;
    }
    if (!responseContent.trim() || responseContent === '<p><br></p>') {
      alert('피드백 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        title: responseTitle,
        content: responseContent,
      };

      let response;
      if (feedbackDetail?.feedbackResponse) {
        // 수정
        response = await updateFeedbackResponse(feedbackId, data);
      } else {
        // 생성
        response = await createFeedbackResponse(feedbackId, data);
      }

      if (response.success) {
        alert(
          feedbackDetail?.feedbackResponse
            ? '피드백이 수정되었습니다.'
            : '피드백이 작성되었습니다.'
        );
        setIsEditMode(false);
        loadFeedbackDetail();
      } else {
        alert(`피드백 저장 실패: ${response.error}`);
      }
    } catch (error) {
      console.error('피드백 저장 오류:', error);
      alert('피드백 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    if (feedbackDetail?.feedbackResponse) {
      setResponseTitle(feedbackDetail.feedbackResponse.title);
      setResponseContent(feedbackDetail.feedbackResponse.content);
    } else {
      setResponseTitle('');
      setResponseContent('');
    }
    setIsEditMode(false);
  };

  // 투자 유형 및 멤버십에 따른 상세 뷰 렌더링
  const renderDetailView = () => {
    if (!feedbackDetail) return null;

    const { investmentType, membershipLevel } = feedbackDetail;
    const isBasicMember = membershipLevel === 'BASIC';

    // 무료(BASIC) 회원
    if (isBasicMember && feedbackDetail.dayDetail) {
      return <BasicDetailView data={feedbackDetail.dayDetail} />;
    }

    // 프리미엄 완강 후 회원 - 투자 유형별
    if (investmentType === 'SWING' && feedbackDetail.swingDetail) {
      return <SwingDetailView data={feedbackDetail.swingDetail} />;
    }

    if (investmentType === 'DAY' && feedbackDetail.dayDetail) {
      return <DayDetailView data={feedbackDetail.dayDetail} />;
    }

    if (investmentType === 'SCALPING' && feedbackDetail.scalpingDetail) {
      // 스캘핑은 스윙과 동일한 폼 사용
      return <SwingDetailView data={feedbackDetail.scalpingDetail} />;
    }

    // 데이터가 없는 경우
    return (
      <div className="text-center py-8 text-gray-500">
        매매일지 데이터를 불러올 수 없습니다.
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="max-w-[1920px] mx-auto px-6 py-8">
          <div className="text-center py-12 text-gray-500">로딩 중...</div>
        </main>
      </div>
    );
  }

  if (!feedbackDetail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="max-w-[1920px] mx-auto px-6 py-8">
          <div className="text-center py-12 text-gray-500">
            피드백 정보를 찾을 수 없습니다.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-[1920px] mx-auto px-6 py-8">
        <div className="mb-6">
          <CustomButton variant="secondary" onClick={() => router.back()}>
            ← 돌아가기
          </CustomButton>
        </div>

        {/* 피드백 요청 정보 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">매매일지 상세</h1>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded text-sm ${getFeedbackStatusColor(
                  feedbackDetail.status
                )}`}
              >
                {getFeedbackStatusLabel(feedbackDetail.status)}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                {getInvestmentTypeLabel(feedbackDetail.investmentType)}
              </span>
            </div>
          </div>

          {/* 투자 유형별 상세 정보 표시 */}
          <div className="border-t pt-4">
            <h2 className="font-semibold text-lg mb-4">매매일지 내용</h2>
            {renderDetailView()}
          </div>
        </div>

        {/* 피드백 답변 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">트레이너 피드백</h2>
            {feedbackDetail.feedbackResponse && !isEditMode && (
              <CustomButton variant="secondary" onClick={handleEdit}>
                수정
              </CustomButton>
            )}
          </div>

          {isEditMode || !feedbackDetail.feedbackResponse ? (
            // 피드백 작성/수정 폼
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  피드백 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={responseTitle}
                  onChange={(e) => setResponseTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="피드백 제목을 입력하세요"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  피드백 내용 <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={responseContent}
                  onChange={setResponseContent}
                  placeholder="피드백 내용을 작성하세요..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <CustomButton
                  variant="secondary"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  취소
                </CustomButton>
                <CustomButton
                  variant="primary"
                  onClick={handleSubmitResponse}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? '저장 중...'
                    : feedbackDetail.feedbackResponse
                    ? '수정 완료'
                    : '작성 완료'}
                </CustomButton>
              </div>
            </div>
          ) : (
            // 피드백 보기 모드
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {feedbackDetail.feedbackResponse.title}
                </h3>
                <div className="text-sm text-gray-500 mb-4">
                  작성자: {feedbackDetail.feedbackResponse.trainer.trainerName} |{' '}
                  {new Date(feedbackDetail.feedbackResponse.submittedAt).toLocaleDateString(
                    'ko-KR'
                  )}
                </div>
              </div>
              <div className="border-t pt-4">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: feedbackDetail.feedbackResponse.content,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
