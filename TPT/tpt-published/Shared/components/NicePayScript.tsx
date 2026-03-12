'use client';

import { useEffect } from 'react';

/**
 * NicePay SDK를 로드하는 Client Component
 * Next.js Script 컴포넌트 대신 직접 script 태그를 동적으로 추가
 */
export function NicePayScript() {
  useEffect(() => {
    // 이미 로드된 경우 중복 로드 방지
    if (document.querySelector('script[src*="nicepay-pgweb.js"]')) {
      console.log('[NicePay SDK] 이미 스크립트 태그 존재');
      return;
    }

    console.log('[NicePay SDK] 스크립트 로드 시작');

    const script = document.createElement('script');
    script.src = 'https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js';
    script.type = 'text/javascript';
    // async 제거 - 동기 로드로 변경하여 확실히 로드되도록 함

    script.onload = () => {
      console.log('[NicePay SDK] 로드 완료');
      console.log('[NicePay SDK] goPay:', typeof (window as any).goPay);
    };

    script.onerror = (e) => {
      console.error('[NicePay SDK] 로드 실패:', e);
    };

    // head에 추가 (body 대신)
    document.head.appendChild(script);

    return () => {
      // Cleanup: 컴포넌트 언마운트 시 스크립트 제거 (선택사항)
      // document.body.removeChild(script);
    };
  }, []);

  return null;
}
