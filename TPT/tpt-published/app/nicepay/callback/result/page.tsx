'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { paymentMethodService } from '../../../../Shared/api/services';

/**
 * 나이스페이먼츠 모바일 콜백 결과 페이지
 *
 * 모바일 환경에서 나이스페이 인증 완료 후 route.ts를 통해 리다이렉트됨.
 * URL query string으로 전달된 인증 결과 데이터를 파싱하여 빌링키 등록 API를 호출합니다.
 *
 * 흐름:
 * 1. 모바일에서 결제 인증 완료
 * 2. NICEPAY 서버가 /nicepay/callback으로 POST form 데이터 전달
 * 3. route.ts에서 form data를 파싱하여 이 페이지로 GET 리다이렉트
 * 4. 이 페이지에서 query string 파싱 후 빌링키 등록 API 호출
 * 5. 성공/실패 처리 후 마이페이지로 이동
 */
function NicepayCallbackResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('결제 정보를 처리하고 있습니다...');
  const processedRef = useRef(false);

  useEffect(() => {
    // 중복 실행 방지
    if (processedRef.current) return;
    processedRef.current = true;

    const processPaymentCallback = async () => {
      console.log('[NicePay Callback Result] 결과 페이지 로드됨');

      try {
        // 에러 파라미터 확인
        const error = searchParams.get('error');
        if (error) {
          throw new Error('결제 데이터 파싱에 실패했습니다. 다시 시도해주세요.');
        }

        // URL 파라미터에서 인증 결과 데이터 추출
        const authResultCode = searchParams.get('AuthResultCode') || '';
        const authResultMsg = searchParams.get('AuthResultMsg') || '';
        const txTid = searchParams.get('TxTid') || '';
        const authToken = searchParams.get('AuthToken') || '';
        const signature = searchParams.get('Signature') || '';
        const mid = searchParams.get('MID') || '';
        const amt = searchParams.get('Amt') || '';

        console.log('[NicePay Callback Result] 인증 결과 데이터:', {
          authResultCode,
          authResultMsg,
          txTid: txTid ? txTid.substring(0, 10) + '...' : '',
          authToken: authToken ? authToken.substring(0, 10) + '...' : '',
          signature: signature ? signature.substring(0, 10) + '...' : '',
          mid,
          amt,
        });

        // 필수 데이터 검증
        if (!authResultCode) {
          throw new Error(
            '결제 인증 데이터를 찾을 수 없습니다. 다시 시도해주세요.'
          );
        }

        // 인증 실패 처리
        if (authResultCode !== '0000') {
          const decodedMsg = decodeURIComponent(authResultMsg);
          const errorMsg = `결제 인증 실패: ${decodedMsg}`;
          console.error('[NicePay Callback Result]', errorMsg);
          setStatus('error');
          setMessage(errorMsg);
          return;
        }

        // 세션 스토리지에서 moid 가져오기
        const moid = sessionStorage.getItem('nicepay_moid');
        if (!moid) {
          throw new Error('주문번호(moid)를 찾을 수 없습니다. 결제를 다시 시도해주세요.');
        }

        console.log('[NicePay Callback Result] 빌링키 등록 API 호출 시작');

        // 빌링키 등록 API 호출
        const response = await paymentMethodService.registerBillingKey({
          txTid,
          authToken,
          moid,
          signature,
          mid,
          amt,
        });

        if (response.success && response.data) {
          console.log('[NicePay Callback Result] 빌링키 등록 성공:', response.data);
          sessionStorage.removeItem('nicepay_moid');
          setStatus('success');
          setMessage('결제수단이 성공적으로 등록되었습니다.');

          // 2초 후 마이페이지로 이동
          setTimeout(() => {
            router.push('/my/payment');
          }, 2000);
        } else {
          throw new Error(response.message || '빌링키 등록에 실패했습니다.');
        }
      } catch (error: any) {
        console.error('[NicePay Callback Result] 처리 실패:', error);
        setStatus('error');
        setMessage(error.message || '결제 처리 중 오류가 발생했습니다.');
      }
    };

    processPaymentCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          {/* 상태별 아이콘 */}
          <div className="mb-4">
            {status === 'loading' && (
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-10 h-10 text-blue-600 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* 상태별 타이틀 */}
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {status === 'loading' && '결제 처리 중'}
            {status === 'success' && '등록 완료'}
            {status === 'error' && '등록 실패'}
          </h2>

          {/* 메시지 */}
          <p className="text-gray-600 mb-4">{message}</p>

          {/* 상태별 추가 안내 */}
          {status === 'loading' && (
            <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
          )}
          {status === 'success' && (
            <p className="text-sm text-gray-500">
              잠시 후 마이페이지로 이동합니다...
            </p>
          )}
          {status === 'error' && (
            <button
              onClick={() => router.push('/my/payment')}
              className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
            >
              마이페이지로 이동
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Suspense wrapper for useSearchParams
 */
export default function NicepayCallbackResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-blue-600 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">결제 처리 중</h2>
              <p className="text-gray-600 mb-4">결제 정보를 처리하고 있습니다...</p>
              <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
            </div>
          </div>
        </div>
      }
    >
      <NicepayCallbackResultContent />
    </Suspense>
  );
}
