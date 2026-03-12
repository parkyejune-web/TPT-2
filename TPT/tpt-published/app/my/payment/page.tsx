'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CreditCard, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../../Shared/store/authStore';
import { usePaymentMethod } from './hooks/usePaymentMethod';
import CustomModal from '../../../Shared/ui/CustomModal';
// import { useNicepayPayment } from '../../../Shared/hooks/useNicePayments';

/**
 * 결제수단 관리 페이지 내부 컴포넌트
 */
function PaymentManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const { paymentMethod, loading, error, deletePaymentMethod } = usePaymentMethod();
  // const { openPayment } = useNicepayPayment();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mobilePaymentResult, setMobilePaymentResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // 모바일 결제 리다이렉트로 왔는지 여부
  const [isMobileRedirect, setIsMobileRedirect] = useState(false);

  // 이미 처리된 결제 결과인지 체크하는 플래그
  const [isProcessed, setIsProcessed] = useState(false);

  // 모바일 결제 완료 후 백엔드가 리다이렉트한 경우 쿼리 파라미터 처리
  useEffect(() => {
    // 이미 처리했으면 무시
    if (isProcessed) return;

    const paymentMethodId = searchParams.get('paymentMethodId');
    const errorCode = searchParams.get('errorCode');
    const errorMessage = searchParams.get('errorMessage');

    if (paymentMethodId) {
      // 모바일 결제 성공
      console.log('[PaymentManagementPage] 모바일 결제 성공, paymentMethodId:', paymentMethodId);
      setIsProcessed(true);
      setIsMobileRedirect(true);
      setMobilePaymentResult({
        type: 'success',
        message: '결제수단이 성공적으로 등록되었습니다.',
      });
      // URL에서 쿼리 파라미터 제거 (히스토리 교체) - 비동기로 처리
      window.history.replaceState(null, '', '/my/payment');
    } else if (errorCode || errorMessage) {
      // 모바일 결제 실패
      const decodedMessage = errorMessage ? decodeURIComponent(errorMessage) : '결제 처리 중 오류가 발생했습니다.';
      console.error('[PaymentManagementPage] 모바일 결제 실패:', errorCode, decodedMessage);
      setIsProcessed(true);
      setIsMobileRedirect(true);
      setMobilePaymentResult({
        type: 'error',
        message: decodedMessage,
      });
      // URL에서 쿼리 파라미터 제거 (히스토리 교체) - 비동기로 처리
      window.history.replaceState(null, '', '/my/payment');
    }
  }, [searchParams, isProcessed]);

  // 일반 접근 시 접근 권한 체크 (모바일 리다이렉트가 아닌 경우에만)
  useEffect(() => {
    // 모바일 리다이렉트인 경우 접근 제한 없음
    if (isMobileRedirect) return;

    // 비로그인 상태면 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      console.log('[PaymentManagementPage] 비로그인 상태, 로그인 페이지로 이동');
      router.push('/login');
      return;
    }

    // 로딩 중이면 아직 접근 권한 판단하지 않음
    if (loading) {
      return;
    }

    // PREMIUM 사용자이거나 결제수단이 있으면 접근 허용
    // (결제수단 등록만 성공하고 결제에 실패한 무료 회원도 결제수단 관리 가능)
    if (!user?.isPremium && !paymentMethod) {
      console.log('[PaymentManagementPage] PREMIUM 사용자가 아니고 결제수단도 없음, 마이페이지로 이동');
      alert('결제수단 관리는 Pro 회원만 이용 가능합니다.');
      router.push('/my');
      return;
    }
  }, [isAuthenticated, user, router, loading, paymentMethod, isMobileRedirect]);

  // 뒤로가기
  const handleGoBack = () => {
    router.push('/my');
  };

  // 결제수단 삭제 확인 모달 열기
  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  // 결제수단 삭제 실행
  const handleConfirmDelete = async () => {
    if (!paymentMethod) return;

    setIsDeleting(true);
    try {
      const result = await deletePaymentMethod(paymentMethod.id);
      if (result.success) {
        alert('결제수단이 삭제되었습니다.');
        setIsDeleteModalOpen(false);
        // 삭제 후 페이지 새로고침하여 최신 상태 반영
        window.location.reload();
      } else {
        alert(result.error || '결제수단 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('[PaymentManagementPage] 결제수단 삭제 오류:', error);
      alert('결제수단 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  // 카드 타입 한글 변환
  const getCardTypeLabel = (cardType: string) => {
    switch (cardType) {
      case 'CREDIT':
        return '신용카드';
      case 'DEBIT':
        return '체크카드';
      case 'SIMPLE':
        return '간편결제';
      default:
        return cardType;
    }
  };

  // ==========================================
  // 모바일 결제 리다이렉트인 경우: 결과 화면만 표시
  // ==========================================
  if (isMobileRedirect) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* 모바일 결제 결과 메시지 */}
          {mobilePaymentResult && (
            <div
              className={`mt-6 border rounded-lg p-4 flex items-start gap-3 ${
                mobilePaymentResult.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              {mobilePaymentResult.type === 'success' ? (
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              ) : (
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              )}
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    mobilePaymentResult.type === 'success' ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {mobilePaymentResult.type === 'success' ? '결제 완료' : '결제 실패'}
                </p>
                <p
                  className={`text-sm ${
                    mobilePaymentResult.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {mobilePaymentResult.message}
                </p>
              </div>
              <button
                onClick={() => setMobilePaymentResult(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
          )}

          {/* 마이페이지로 돌아가기 버튼 */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => router.push('/my')}
              onTouchEnd={(e) => {
                e.preventDefault();
                router.push('/my');
              }}
              className="px-6 py-4 bg-blue-600 text-white rounded-lg active:bg-blue-700 transition font-medium min-h-[48px] touch-manipulation cursor-pointer"
            >
              마이페이지로 돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // 일반 접근인 경우: 결제수단 관리 기능 전체 표시
  // ==========================================

  // 로딩 중
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="마이페이지로 이동"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">결제수단 관리</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-red-900">오류 발생</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="마이페이지로 이동"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">결제수단 관리</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 결제수단 정보 카드 */}
        {paymentMethod ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{paymentMethod.displayName}</p>
                    <p className="text-sm text-gray-500">
                      {paymentMethod.cardCompanyName} · {getCardTypeLabel(paymentMethod.cardType)}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  활성
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">카드 번호</span>
                  <span className="font-medium">{paymentMethod.maskedCardNo}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">유효기간</span>
                  <span className="font-medium">{paymentMethod.expiresAt}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">등록일</span>
                  <span className="font-medium">
                    {new Date(paymentMethod.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            </div>

            {/* 삭제 버튼 */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleOpenDeleteModal}
                className="w-full py-3 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
              >
                <Trash2 size={18} />
                결제수단 삭제
              </button>
            </div>
          </div>
        ) : (
          // 결제수단이 없는 경우
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">등록된 결제수단이 없습니다.</p>
            <p className="text-sm text-gray-500">
              결제수단을 등록하려면 구독 결제를 진행해주세요.
            </p>
          </div>
        )}

        {/* Info Message */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">안내사항</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>결제수단은 한 번에 하나만 등록할 수 있습니다.</li>
                <li>결제수단 삭제 시 자동 결제가 중단되며, Pro 멤버십이 해지될 수 있습니다.</li>
                <li>새로운 결제수단을 등록하려면 결제하기를 다시 진행해주세요.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* 결제수단 삭제 확인 모달 */}
      <CustomModal
        variant={1}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-3">결제수단 삭제</h3>
          <p className="text-center text-gray-700 mb-6">
            결제수단을 삭제하면 더 이상 Pro 모드가 아니게 됩니다.
            <br />
            정말로 결제수단을 삭제하시겠습니까?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  삭제 중...
                </>
              ) : (
                '확인'
              )}
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}

/**
 * 결제수단 관리 페이지
 * - 모바일 결제 리다이렉트로 접근한 경우: 결제 결과 메시지 + 마이페이지로 돌아가기 버튼만 표시
 * - 일반 접근한 경우: PREMIUM 사용자 또는 결제수단이 등록된 사용자만 접근 가능, 결제수단 조회/삭제 기능 제공
 */
export default function PaymentManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <PaymentManagementContent />
    </Suspense>
  );
}
