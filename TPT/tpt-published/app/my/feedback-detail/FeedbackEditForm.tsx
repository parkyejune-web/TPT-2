'use client';

import { useState } from 'react';
import { feedbackService } from '../../../Shared/api/services';
import type { UpdateFeedbackRequestDTO, FeedbackScreenShotAttachmentDTO } from '../../../Shared/api/apiTypes';
import CustomModal from '../../../Shared/ui/CustomModal';
import BasicOrBeforeForm from '../../../Features/feedback-request/BasicOrBeforeForm';
import SwingAfterForm from '../../../Features/feedback-request/SwingAfterForm';
import DayAfterForm from '../../../Features/feedback-request/DayAfterForm';
import type { User } from '../../../Shared/store/authStore';

/** 수정 폼에서 사용하는 이미지 정보 타입 */
export interface EditableImageInfo {
  id: number | null; // 기존 이미지의 경우 ID, 새 이미지는 null
  url: string; // 이미지 URL 또는 preview URL
  file?: File; // 새로 추가된 이미지의 경우 File 객체
  isNew: boolean; // 새로 추가된 이미지 여부
}

interface FeedbackEditFormProps {
  feedbackDetail: any;
  feedbackId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * 매매일지 수정 폼 컴포넌트
 * 사용자의 투자 유형, 유/무료 여부, 완강 여부에 따라
 * 작성 당시와 동일한 폼 컴포넌트를 렌더링
 */
export default function FeedbackEditForm({
  feedbackDetail,
  feedbackId,
  onSuccess,
  onCancel,
}: FeedbackEditFormProps) {
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // feedbackDetail에서 사용자 정보 추출하여 가상의 User 객체 구성
  const currentUser: User = {
    id: 0,
    name: '',
    username: '',
    email: '',
    isPremium: feedbackDetail.membershipLevel === 'PREMIUM',
    isCourseCompleted: feedbackDetail.courseStatus === 'AFTER_COMPLETION',
    investmentType: feedbackDetail.investmentType,
    signedAt: '',
    membershipLevel: feedbackDetail.membershipLevel === 'PREMIUM' ? 'PREMIUM' : 'BASIC',
  };

  // 기존 이미지 ID 목록 추출
  const getOriginalImageIds = (): number[] => {
    if (feedbackDetail.screenshotImages) {
      return feedbackDetail.screenshotImages.map((img: FeedbackScreenShotAttachmentDTO) => img.imageId);
    }
    return [];
  };

  // 폼 제출 처리
  const handleSubmit = async (formData: any) => {
    console.log('[FeedbackEditForm] 수정 요청 formData:', formData);

    try {
      // 이미지 변경 사항 계산
      const originalImageIds = getOriginalImageIds();
      const remainingImageIds: number[] = formData.remainingImageIds || []; // 유지할 기존 이미지 ID 목록
      const newScreenshotFiles: File[] = formData.screenshotFiles || []; // 새로 추가할 이미지 파일

      // 삭제할 이미지 ID: 원래 이미지 ID 중 유지 목록에 없는 것들
      const deleteAttachmentIds = originalImageIds.filter(
        (id: number) => !remainingImageIds.includes(id)
      );

      console.log('[FeedbackEditForm] 이미지 변경 사항:', {
        originalImageIds,
        remainingImageIds,
        deleteAttachmentIds,
        newFilesCount: newScreenshotFiles.length,
      });

      // API 요청 데이터 구성
      const updateData: UpdateFeedbackRequestDTO = {
        category: formData.category,
        position: formData.position,
        pnl: formData.pnl,
        totalAssetPnl: formData.totalAssetPnl,
        rnr: formData.rnr ?? formData.rr ?? 0,
        riskTaking: formData.riskTaking,
        leverage: formData.leverage,
        operatingFundsRatio: formData.operatingFundsRatio,
        entryPrice: formData.entryPrice,
        exitPrice: formData.exitPrice,
        settingStopLoss: formData.settingStopLoss,
        settingTakeProfit: formData.settingTakeProfit,
        positionHoldingTime: formData.positionHoldingTime,
        positionStartReason: formData.positionStartReason,
        positionEndReason: formData.positionEndReason,
        tradingReview: formData.tradingReview,
        directionFrameExists: formData.directionFrameExists,
        directionFrame: formData.directionFrame,
        mainFrame: formData.mainFrame,
        subFrame: formData.subFrame,
        trendAnalysis: formData.trendAnalysis,
        trainerFeedbackRequestContent: formData.trainerFeedbackRequestContent ?? formData.trainerFeedback,
        entryPoint: formData.entryPoint ?? formData.entryPoint1,
        grade: formData.grade ?? formData.grade1,
        additionalBuyCount: formData.additionalBuyCount,
        splitSellCount: formData.splitSellCount,
        positionStartDate: formData.positionStartDate ?? formData.entryDate,
        positionEndDate: formData.positionEndDate ?? formData.exitDate,
        // 이미지 관련 필드
        deleteAttachmentIds: deleteAttachmentIds.length > 0 ? deleteAttachmentIds : undefined,
        screenshotFiles: newScreenshotFiles.length > 0 ? newScreenshotFiles : undefined,
      };

      console.log('[FeedbackEditForm] API 요청 데이터:', updateData);

      const response = await feedbackService.updateFeedback(feedbackId, updateData);

      if (response.success) {
        console.log('[FeedbackEditForm] 수정 성공');
        setSuccessModalOpen(true);
      } else {
        // 피드백 완료된 경우 특별 처리
        const errorCode = (response as any).data?.code;
        if (errorCode === 'FEEDBACK_REQ_400_25' ||
            response.error?.includes('피드백 답변이 완료된')) {
          setErrorMessage('이미 피드백을 받은 매매일지는 수정하실 수 없습니다.');
        } else {
          setErrorMessage(response.error || '수정에 실패했습니다.');
        }
        setErrorModalOpen(true);
      }
    } catch (err) {
      console.error('[FeedbackEditForm] 수정 중 오류:', err);
      setErrorMessage('수정 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    }
  };

  // 투자 유형, 완강 여부, 멤버십 레벨에 따라 폼 결정
  const investmentType = feedbackDetail.investmentType;
  const isCourseCompleted = feedbackDetail.courseStatus === 'AFTER_COMPLETION';
  const isPremium = feedbackDetail.membershipLevel === 'PREMIUM';

  // 폼 렌더링 결정 로직
  const renderForm = () => {
    // 무료 회원 또는 완강 전인 경우 -> BasicOrBeforeForm
    if (!isPremium || !isCourseCompleted) {
      return (
        <BasicOrBeforeForm
          onSubmit={handleSubmit}
          currentUser={currentUser}
          isEditMode={true}
          initialData={feedbackDetail}
          onCancel={onCancel}
        />
      );
    }

    // 완강 후 프리미엄 회원
    if (investmentType === 'SWING') {
      return (
        <SwingAfterForm
          onSubmit={handleSubmit}
          currentUser={currentUser}
          isEditMode={true}
          initialData={feedbackDetail}
          onCancel={onCancel}
        />
      );
    }

    if (investmentType === 'DAY') {
      return (
        <DayAfterForm
          onSubmit={handleSubmit}
          currentUser={currentUser}
          isEditMode={true}
          initialData={feedbackDetail}
          onCancel={onCancel}
        />
      );
    }

    // 기본값: BasicOrBeforeForm
    return (
      <BasicOrBeforeForm
        onSubmit={handleSubmit}
        currentUser={currentUser}
        isEditMode={true}
        initialData={feedbackDetail}
        onCancel={onCancel}
      />
    );
  };

  const investmentTypeLabel =
    investmentType === 'DAY' ? '데이' : investmentType === 'SWING' ? '스윙' : '스켈핑';

  return (
    <>
      {/* 성공 Modal */}
      <CustomModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          onSuccess();
        }}
        variant={2}
        width="w-96"
      >
        <div className="text-center">
          <p className="text-gray-900 font-semibold mb-2">수정 완료</p>
          <p className="text-gray-600 text-sm">매매일지가 성공적으로 수정되었습니다.</p>
        </div>
      </CustomModal>

      {/* 에러 Modal */}
      <CustomModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        variant={2}
        width="w-96"
      >
        <div className="text-center">
          <p className="text-gray-900 font-semibold mb-2">수정 실패</p>
          <p className="text-gray-600 text-sm">{errorMessage}</p>
        </div>
      </CustomModal>

      <div className="w-full p-4 md:p-6 mt-20 max-w-4xl mx-auto mb-20">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          {/* 헤더 */}
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              {investmentTypeLabel} 매매일지 수정 #{feedbackId}
            </h1>
            <p className="text-sm text-gray-500">
              수정하고자 하는 항목을 변경한 후 수정 완료 버튼을 클릭해주세요.
            </p>
          </div>

          {/* 폼 렌더링 */}
          {renderForm()}
        </div>
      </div>
    </>
  );
}
