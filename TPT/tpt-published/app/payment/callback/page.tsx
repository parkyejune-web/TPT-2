'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 나이스페이먼츠 결제 콜백 페이지
 *
 * ⚠️ 참고: 현재는 전역 함수 방식(nicepaySubmit, nicepayClose)을 사용하므로
 * 이 페이지로 리다이렉트되지 않습니다.
 *
 * 만약 ReturnURL 방식으로 변경하려면 useNicePayments.ts에서
 * ReturnURL을 다시 추가하고, 이 페이지의 로직을 활성화하세요.
 */
export default function PaymentCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    console.log('[PaymentCallback] 이 페이지는 현재 사용되지 않습니다. (전역 함수 방식 사용 중)');

    // 3초 후 마이페이지로 리다이렉트
    setTimeout(() => {
      router.push('/my');
    }, 3000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">안내</h2>
          <p className="text-gray-600 mb-4">
            이 페이지는 현재 사용되지 않습니다.
          </p>
          <p className="text-sm text-gray-500">잠시 후 마이페이지로 이동합니다...</p>
          <button
            onClick={() => router.push('/my')}
            className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
          >
            바로 이동하기
          </button>
        </div>
      </div>
    </div>
  );
}
