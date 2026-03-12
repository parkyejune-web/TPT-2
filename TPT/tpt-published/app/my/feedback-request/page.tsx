'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../Shared/store/authStore';
import { useAuth } from '../../../Shared/hooks/useAuth';
import { mapUnifiedFormData, mapUnifiedBeforeFormData } from '../../../Shared/utils/feedbackFormMapper';
import BasicOrBeforeForm from '../../../Features/feedback-request/BasicOrBeforeForm';
import SwingAfterForm from '../../../Features/feedback-request/SwingAfterForm';
import DayAfterForm from '../../../Features/feedback-request/DayAfterForm';
import SaveSuccess from '../../../Features/feedback-request/SaveSuccess';
import CustomModal from '../../../Shared/ui/CustomModal';

/**
 * 피드백 요청 페이지
 * 사용자의 투자 유형, 회원 등급, 완강 상태에 따라 다른 폼을 표시
 *
 * 2025-11-28 변경사항:
 * - 스켈핑 투자 유형 삭제
 * - 스윙/데이 완강 후 매매일지 작성 시 동일한 통합 API 사용
 */
export default function RequestFeedbackPage() {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { requestFeedback } = useAuth();
  const [open, setOpen] = useState(false);
  const [isTokenSubmit, setIsTokenSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [uidRequiredModalOpen, setUidRequiredModalOpen] = useState(false);

  // URL 쿼리 파라미터에서 useToken 값 확인 (토큰 사용 여부)
  const useTokenFromUrl = searchParams.get('useToken') === 'true';

  if (!user) {
    return <div className="text-center mt-20">로그인이 필요합니다.</div>;
  }

  // 투자 유형: SWING 또는 DAY만 유효 (스켈핑 삭제됨)
  const investmentType = (user.investmentType === 'SWING' || user.investmentType === 'DAY')
    ? user.investmentType
    : 'DAY'; // 기본값 DAY
  const userLevel = user.isPremium ? 'PREMIUM' : 'BASIC';
  const completion = user.isCourseCompleted ? 'AFTER_COMPLETION' : 'BEFORE_COMPLETION';

  const handleSubmit = async (formData: any) => {
    // UID가 null인 경우 저장 불가 모달 표시
    if (!user.uid) {
      setUidRequiredModalOpen(true);
      return;
    }

    // formData에 useToken이 포함되어 있으면 그 값을 사용, 없으면 URL 파라미터 사용
    const useToken = formData.useToken === true || useTokenFromUrl;

    console.log('[feedback-request] 서버로 전송할 데이터:', formData);
    console.log('[feedback-request] 토큰 사용 여부:', useToken);
    console.log('[feedback-request] 투자 유형:', investmentType);
    console.log('[feedback-request] 회원 등급:', userLevel);
    console.log('[feedback-request] 완강 상태:', completion);

    // useToken 값을 formData에 추가
    const enrichedFormData = {
      ...formData,
      useToken,
    };

    setIsLoading(true);

    try {
      let fd: FormData;

      // 통합 API 사용: 무료 고객 또는 완강 전 → mapUnifiedBeforeFormData
      // PREMIUM + 완강 후 → mapUnifiedFormData
      if (userLevel === 'BASIC' || completion === 'BEFORE_COMPLETION') {
        fd = mapUnifiedBeforeFormData(enrichedFormData, investmentType);
      } else {
        fd = mapUnifiedFormData(enrichedFormData, investmentType);
      }

      // 통합 API 호출
      const res = await requestFeedback(fd);

      console.log('[feedback-request] 서버 응답:', res);

      setIsLoading(false);

      if (res && res.success) {
        setIsTokenSubmit(useToken);
        setOpen(true);
      } else {
        // 에러 메시지 구성
        let mainMessage = res?.message || res?.error || '피드백 저장에 실패했습니다.';

        // 서버 에러 코드에 따른 사용자 친화적 메시지 변환
        const errorCode = (res?.data as any)?.code || (res as any)?.code;
        if (errorCode === 'GLOBAL_400_5') {
          mainMessage = '매매일지 데이터가 올바르지 않습니다.';
        } else if (mainMessage === '입력값 검증에 실패하였습니다.') {
          mainMessage = '매매일지 데이터를 다시 확인해주세요.';
        }

        setErrorMessage(mainMessage);

        // result 객체에 상세 에러가 있으면 추가
        // res.data가 서버 응답 전체이고, res.data.result에 상세 에러 필드가 있음
        const resultData = res?.data?.result;
        if (resultData && typeof resultData === 'object') {
          const resultErrors = Object.values(resultData).filter(Boolean) as string[];
          setErrorDetails(resultErrors);
        } else {
          setErrorDetails([]);
        }

        setErrorModalOpen(true);
        console.error('[feedback-request] 서버 응답 오류:', res);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('[feedback-request] 피드백 요청 예외 발생:', error);
      setErrorMessage('피드백 저장 중 오류가 발생했습니다.');
      setErrorDetails(['입력하신 내용을 확인해주세요.']);
      setErrorModalOpen(true);
    }
  };

  const renderForm = () => {
    // 무료 고객, 완강 전 고객 → BasicOrBeforeForm
    if (userLevel === 'BASIC' || completion === 'BEFORE_COMPLETION') {
      return <BasicOrBeforeForm onSubmit={handleSubmit} currentUser={user} />;
    }

    // 완강 후 스윙/데이 고객
    if (completion === 'AFTER_COMPLETION') {
      if (investmentType === 'SWING')
        return <SwingAfterForm currentUser={user} onSubmit={handleSubmit} />;
      if (investmentType === 'DAY')
        return <DayAfterForm currentUser={user} onSubmit={handleSubmit} />;
    }

    return <div>조건에 맞는 Form이 없습니다.</div>;
  };

  return (
    <div className="flex min-h-screen bg-white flex-col items-center gap-6 p-6 mt-20">
      <div className="w-full max-w-3xl p-6">{renderForm()}</div>
      <SaveSuccess
        isOpen={open}
        onClose={() => setOpen(false)}
        message={isTokenSubmit ? '매매일지에 대한 피드백 신청이 완료되었습니다.' : undefined}
      />

      {/* 로딩 Modal */}
      <CustomModal
        isOpen={isLoading}
        onClose={() => {}}
        variant={0}
        width="max-w-sm"
      >
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-700 text-center">매매일지를 안전하게 저장 중입니다...</p>
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
          <p className="text-gray-900 font-semibold mb-4">{errorMessage}</p>
          {errorDetails.length > 0 && (
            <ul className="text-left text-sm text-gray-700 space-y-1">
              {errorDetails.map((detail, index) => (
                <li key={index}>• {detail}</li>
              ))}
            </ul>
          )}
        </div>
      </CustomModal>

      {/* UID 미등록 경고 Modal */}
      <CustomModal
        isOpen={uidRequiredModalOpen}
        onClose={() => setUidRequiredModalOpen(false)}
        variant={2}
        width="w-lg"
      >
        <div className="text-center">
          <p className="text-gray-900 font-semibold">
            올바른 계정 확인 절차가 필요합니다.
            <br />
            상담톡으로 문의주세요.
          </p>
        </div>
      </CustomModal>
    </div>
  );
}
