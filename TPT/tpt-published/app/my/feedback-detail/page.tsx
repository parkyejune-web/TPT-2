'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { feedbackService } from '../../../Shared/api/services';
import ImageViewerModal from '../../../Shared/ui/ImageViewerModal';
import CustomModal from '../../../Shared/ui/CustomModal';
import FeedbackEditForm from './FeedbackEditForm';
import { useAuthStore } from '../../../Shared/store/authStore';

/**
 * 피드백 상세 보기 페이지
 * - 수정/삭제 버튼 추가
 * - 삭제 확인 Modal
 * - 수정 불가 안내 Modal (피드백 완료된 경우)
 * - 수정 모드 UI
 */
export default function FeedbackDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const feedbackId = searchParams.get('id');
  const { user } = useAuthStore();

  const [feedbackDetail, setFeedbackDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Modal 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditNotAllowedModalOpen, setIsEditNotAllowedModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 수정 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);

  const loadFeedbackDetail = async () => {
    if (!feedbackId) {
      setError('피드백 ID가 없습니다.');
      setLoading(false);
      return;
    }

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

  useEffect(() => {
    loadFeedbackDetail();
  }, [feedbackId]);

  // 삭제 처리
  const handleDelete = async () => {
    if (!feedbackId) return;

    setIsDeleting(true);
    try {
      const response = await feedbackService.deleteFeedback(Number(feedbackId));
      if (response.success) {
        console.log('[FeedbackDetail] 삭제 성공');
        router.push('/my');
      } else {
        console.error('[FeedbackDetail] 삭제 실패:', response.error);
        alert(response.error || '삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('[FeedbackDetail] 삭제 중 오류:', err);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // 수정 버튼 클릭 처리
  const handleEditClick = () => {
    // 피드백 응답이 있으면 수정 불가
    if (feedbackDetail?.feedbackResponse) {
      setIsEditNotAllowedModalOpen(true);
      return;
    }
    setIsEditMode(true);
  };

  // 수정 완료 후 처리
  const handleEditSuccess = () => {
    setIsEditMode(false);
    loadFeedbackDetail(); // 데이터 새로고침
  };

  // 수정 취소 처리
  const handleEditCancel = () => {
    setIsEditMode(false);
  };

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

  // 수정 모드일 경우 수정 폼 렌더링
  if (isEditMode) {
    return (
      <FeedbackEditForm
        feedbackDetail={feedbackDetail}
        feedbackId={Number(feedbackId)}
        onSuccess={handleEditSuccess}
        onCancel={handleEditCancel}
      />
    );
  }

  // 서버 응답이 직접 상세 데이터를 반환하므로 feedbackDetail 자체가 detail
  const detail = feedbackDetail;

  // 이미지 URL 목록 추출 (screenshotImages가 있으면 사용, 없으면 screenshotImageUrls 사용)
  const screenshotImageUrls: string[] = detail.screenshotImages
    ? detail.screenshotImages.map((img: { imageId: number; imageUrl: string }) => img.imageUrl)
    : detail.screenshotImageUrls || [];

  // 디버깅: userId와 customerId 비교 로그
  console.log('[FeedbackDetail] 권한 체크:', {
    'user?.id': user?.id,
    'typeof user?.id': typeof user?.id,
    'feedbackDetail?.customerId': feedbackDetail?.customerId,
    'typeof feedbackDetail?.customerId': typeof feedbackDetail?.customerId,
    'user?.id === feedbackDetail?.customerId': user?.id === feedbackDetail?.customerId,
  });

  const investmentType = feedbackDetail.investmentType;
  const investmentTypeLabel =
    investmentType === 'DAY' ? '데이' : investmentType === 'SWING' ? '스윙' : '스켈핑';

  // 완강 여부 라벨
  const courseStatusLabel =
    detail.courseStatus === 'BEFORE_COMPLETION' ? '완강 전' : '완강 후';

  // 멤버십 라벨
  const membershipLabel = feedbackDetail.membershipLevel === 'PREMIUM' ? 'Pro' : 'Regular';

  // 진입 타점 - 서버 값 그대로 반환
  const getEntryPointLabel = (value: string) => {
    if (!value) return '-';
    return value;
  };

  // 등급 라벨 변환
  const getGradeLabel = (value: string) => {
    if (!value) return '-';
    const labels: Record<string, string> = {
      S_PLUS: 'S+',
      S: 'S',
      A: 'A',
      B: 'B',
      NONE: '-',
    };
    return labels[value] || value;
  };

  // 포지션 라벨
  const positionLabel = detail.position === 'LONG' ? 'Long' : detail.position === 'SHORT' ? 'Short' : '-';

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageViewerOpen(true);
  };

  return (
    <>
      {/* 이미지 뷰어 Modal */}
      <ImageViewerModal
        images={screenshotImageUrls}
        initialIndex={selectedImageIndex}
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
      />

      {/* 삭제 확인 Modal */}
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        variant={3}
        width="w-96"
        onConfirm={handleDelete}
      >
        <div className="text-center">
          <p className="text-gray-900 font-semibold mb-2">매매일지 삭제</p>
          <p className="text-gray-600 text-sm">
            매매일지를 삭제하시면 월/주 통계에서도 해당 값이 반영되지 않습니다.
            <br />
            정말 삭제하시겠습니까?
          </p>
          {isDeleting && (
            <p className="text-blue-500 text-sm mt-2">삭제 중...</p>
          )}
        </div>
      </CustomModal>

      {/* 수정 불가 안내 Modal */}
      <CustomModal
        isOpen={isEditNotAllowedModalOpen}
        onClose={() => setIsEditNotAllowedModalOpen(false)}
        variant={2}
        width="w-96"
      >
        <div className="text-center">
          <p className="text-gray-900 font-semibold mb-2">수정 불가</p>
          <p className="text-gray-600 text-sm">
            이미 피드백을 받은 매매일지는 수정하실 수 없습니다.
          </p>
        </div>
      </CustomModal>

      <div className="w-full p-4 md:p-6 mt-20 max-w-4xl mx-auto mb-20">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-xl md:text-2xl font-bold">
              {/* 투자유형 라벨 주석처리 - 현재 데이 유형만 사용 */}
              {/* {investmentTypeLabel} */}매매일지 상세 #{feedbackId}
            </h1>
            {/* 수정/삭제 버튼 - 내가 작성한 매매일지인 경우에만 표시 */}
            {user?.id && feedbackDetail?.customerId && Number(user.id) === Number(feedbackDetail.customerId) && (
              <div className="flex gap-2">
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  매매일지 수정
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  매매일지 삭제
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* 투자유형 뱃지 - 현재 데이 유형만 사용하므로 주석처리 */}
            {/* <span
              className={`px-3 py-1 text-white rounded text-sm ${
                investmentType === 'SWING'
                  ? 'bg-orange-400'
                  : investmentType === 'DAY'
                    ? 'bg-[#2AC287]'
                    : 'bg-sky-400'
              }`}
            >
              {investmentTypeLabel}
            </span> */}
            <span className="px-3 py-1 border rounded text-sm">{courseStatusLabel}</span>
            <span
              className={`px-3 py-1 text-white rounded text-sm ${
                feedbackDetail.membershipLevel === 'PREMIUM'
                  ? 'bg-gradient-to-r from-[#D2C693] to-[#928346]'
                  : 'bg-gray-500'
              }`}
            >
              {membershipLabel}
            </span>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            <div>
              <p className="text-gray-500 text-sm mb-1">매매 날짜</p>
              <p className="font-medium text-gray-800">{detail.feedbackRequestDate || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">종목</p>
              <p className="font-medium text-gray-800">{detail.category || '-'}</p>
            </div>
            {detail.positionHoldingTime && (
              <div>
                <p className="text-gray-500 text-sm mb-1">포지션 홀딩 시간</p>
                <p className="font-medium text-gray-800">{detail.positionHoldingTime}</p>
              </div>
            )}
            {detail.positionStartDate && (
              <div>
                <p className="text-gray-500 text-sm mb-1">포지션 진입 날짜</p>
                <p className="font-medium text-gray-800">{detail.positionStartDate}</p>
              </div>
            )}
            {detail.positionEndDate && (
              <div>
                <p className="text-gray-500 text-sm mb-1">포지션 종료 날짜</p>
                <p className="font-medium text-gray-800">{detail.positionEndDate}</p>
              </div>
            )}
          </div>
        </div>

        {/* 차트 이미지 */}
        {screenshotImageUrls.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              차트 이미지 {screenshotImageUrls.length > 1 && `(${screenshotImageUrls.length}장)`}
            </h2>
            <div className="space-y-4">
              {screenshotImageUrls.map((url: string, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`차트 이미지 ${index + 1}`}
                    className="w-full rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(index)}
                  />
                  {screenshotImageUrls.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      {index + 1} / {screenshotImageUrls.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 프레임 정보 (스윙/데이) */}
        {(detail.directionFrame || detail.mainFrame || detail.subFrame) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">프레임 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded">
              {detail.directionFrame && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">디렉션 프레임</p>
                  <p className="font-medium text-gray-800">{detail.directionFrame}</p>
                </div>
              )}
              {detail.mainFrame && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">메인 프레임</p>
                  <p className="font-medium text-gray-800">{detail.mainFrame}</p>
                </div>
              )}
              {detail.subFrame && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">서브 프레임</p>
                  <p className="font-medium text-gray-800">{detail.subFrame}</p>
                </div>
              )}
            </div>
            {detail.directionFrameExists !== undefined && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  디렉션 프레임 방향성: {detail.directionFrameExists ? 'O' : 'X'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 추세 분석 (스윙/데이) */}
        {detail.trendAnalysis && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">추세 분석</h2>
            <p className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-gray-800">
              {detail.trendAnalysis}
            </p>
          </div>
        )}

        {/* 진입 타점 (entryPoint, grade) */}
        {(detail.entryPoint || detail.grade) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">진입 타점</h2>
            <p className="bg-gray-50 p-4 rounded text-gray-800">
              {getEntryPointLabel(detail.entryPoint)}, {getGradeLabel(detail.grade)}
            </p>
          </div>
        )}

        {/* 추가 매수 / 분할 매도 횟수 (스윙/데이) */}
        {(detail.additionalBuyCount !== undefined && detail.additionalBuyCount !== null) ||
        (detail.splitSellCount !== undefined && detail.splitSellCount !== null) ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">매수/매도 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
              {detail.additionalBuyCount !== undefined && detail.additionalBuyCount !== null && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">추가 매수 횟수</p>
                  <p className="font-medium text-gray-800">{detail.additionalBuyCount}회</p>
                </div>
              )}
              {detail.splitSellCount !== undefined && detail.splitSellCount !== null && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">분할 매도 횟수</p>
                  <p className="font-medium text-gray-800">{detail.splitSellCount}회</p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* 리스크 및 레버리지 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">리스크 및 레버리지</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            {detail.riskTaking !== undefined && (
              <div>
                <p className="text-gray-500 text-sm mb-1">리스크 테이킹</p>
                <p className="font-medium text-gray-800">{detail.riskTaking}%</p>
              </div>
            )}
            {detail.leverage !== undefined && (
              <div>
                <p className="text-gray-500 text-sm mb-1">레버리지</p>
                <p className="font-medium text-gray-800">{detail.leverage}배</p>
              </div>
            )}
          </div>
        </div>

        {/* 포지션 및 손익 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">포지션 및 손익</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            <div>
              <p className="text-gray-500 text-sm mb-1">포지션</p>
              <p className={`font-medium ${detail.position === 'LONG' ? 'text-[#2AC287]' : 'text-[#F74C5F]'}`}>
                {positionLabel}
              </p>
            </div>
            {detail.pnl !== undefined && (
              <div>
                <p className="text-gray-500 text-sm mb-1">P&L</p>
                <p className={`font-medium ${Number(detail.pnl) >= 0 ? 'text-[#2AC287]' : 'text-[#F74C5F]'}`}>
                  {Number(detail.pnl) >= 0 ? '+' : ''}{detail.pnl}%
                </p>
              </div>
            )}
            {detail.totalAssetPnl !== undefined && (
              <div>
                <p className="text-gray-500 text-sm mb-1">전체 자산 기준 P&L</p>
                <p className={`font-medium ${Number(detail.totalAssetPnl) >= 0 ? 'text-[#2AC287]' : 'text-[#F74C5F]'}`}>
                  {Number(detail.totalAssetPnl) >= 0 ? '+' : ''}{detail.totalAssetPnl}%
                </p>
              </div>
            )}
            {detail.rnr !== undefined && (
              <div>
                <p className="text-gray-500 text-sm mb-1">R&R</p>
                <p className="font-medium text-gray-800">{detail.rnr}</p>
              </div>
            )}
            {detail.operatingFundsRatio !== undefined && (
              <div>
                <p className="text-gray-500 text-sm mb-1">비중 (운용 자금 대비)</p>
                <p className="font-medium text-gray-800">{detail.operatingFundsRatio}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Entry/Exit 가격 정보 (무료/완강전) */}
        {(detail.entryPrice !== undefined || detail.exitPrice !== undefined ||
          detail.settingStopLoss !== undefined || detail.settingTakeProfit !== undefined) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">진입/탈출 가격 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
              {detail.entryPrice !== undefined && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">Entry Price</p>
                  <p className="font-medium text-gray-800">{detail.entryPrice}</p>
                </div>
              )}
              {detail.exitPrice !== undefined && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">Exit Price</p>
                  <p className="font-medium text-gray-800">{detail.exitPrice}</p>
                </div>
              )}
              {detail.settingStopLoss !== undefined && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">스탑로스</p>
                  <p className="font-medium text-gray-800">{detail.settingStopLoss}</p>
                </div>
              )}
              {detail.settingTakeProfit !== undefined && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">설정 익절가</p>
                  <p className="font-medium text-gray-800">{detail.settingTakeProfit}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 포지션 진입/탈출 근거 (무료/완강전) */}
        {(detail.positionStartReason || detail.positionEndReason) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">진입/탈출 근거</h2>
            {detail.positionStartReason && (
              <div className="mb-4">
                <p className="text-gray-500 text-sm mb-2">포지션 진입 근거</p>
                <p className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-gray-800">
                  {detail.positionStartReason}
                </p>
              </div>
            )}
            {detail.positionEndReason && (
              <div>
                <p className="text-gray-500 text-sm mb-2">포지션 탈출 근거</p>
                <p className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-gray-800">
                  {detail.positionEndReason}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 매매 복기 */}
        {detail.tradingReview && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">매매 복기</h2>
            <p className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-gray-800">
              {detail.tradingReview}
            </p>
          </div>
        )}

        {/* 트레이너 피드백 요청 사항 */}
        {detail.trainerFeedbackRequestContent && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">TPT 분석가 피드백 요청 사항</h2>
            <p className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-gray-800">
              {detail.trainerFeedbackRequestContent}
            </p>
          </div>
        )}

        {/* 트레이너 피드백 답변 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">트레이너 피드백</h2>
          {feedbackDetail.feedbackResponse ? (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              {/* HTML 렌더링 지원 */}
              <div
                className="prose prose-sm max-w-none text-gray-800
                  prose-headings:text-gray-900 prose-headings:font-semibold
                  prose-p:text-gray-800 prose-p:leading-relaxed prose-p:my-2
                  prose-strong:text-gray-900
                  prose-ul:text-gray-800 prose-ol:text-gray-800
                  prose-li:my-1
                  prose-a:text-blue-600 prose-a:underline
                  prose-blockquote:border-blue-300 prose-blockquote:bg-white/50 prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:rounded prose-blockquote:not-italic
                  prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:text-gray-800 prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-gray-800 prose-pre:text-gray-100"
                dangerouslySetInnerHTML={{ __html: feedbackDetail.feedbackResponse.content || '피드백 답변이 없습니다.' }}
              />
            </div>
          ) : (
            <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded">
              <p className="text-gray-500">
                {feedbackDetail.isTokenUsed === true
                  ? '아직 트레이너의 피드백이 없습니다.'
                  : '피드백을 요청하지 않은 매매일지입니다.'}
              </p>
            </div>
          )}
        </div>

        {/* 기타 정보 */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500">
            <p>생성일: {detail.createdAt ? new Date(detail.createdAt).toLocaleString('ko-KR') : '-'}</p>
            <p>수정일: {detail.updatedAt ? new Date(detail.updatedAt).toLocaleString('ko-KR') : '-'}</p>
            {detail.isBestFeedback && (
              <p className="text-yellow-600 font-semibold">베스트 피드백</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
