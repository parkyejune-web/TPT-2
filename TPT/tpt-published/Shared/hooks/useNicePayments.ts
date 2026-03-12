import { useState, useCallback, useEffect } from 'react';
import { paymentMethodService } from '../api/services';
import { useAuthStore } from '../store/authStore';

/**
 * 나이스페이먼츠 빌링키 등록 및 정기 결제 훅
 *
 * ## PC 결제 플로우
 * 1. openPayment() 실행
 * 2. 백엔드 호출: initBillingKey()
 * 3. 백엔드가 위변조 방지값(SignData), mid, amt, ediDate 반환
 * 4. 프론트가 숨겨진 form 생성
 * 5. goPay() 호출 → 나이스페이 결제창 오픈
 * 6. 사용자 카드 인증 완료 → nicepaySubmit() 전역 함수 호출
 * 7. 빌링키 등록 API 호출 (프론트에서 직접)
 * 8. 성공 → alert 후 새로고침
 *
 * ## 모바일 결제 플로우
 * 1. openPayment() 실행
 * 2. 백엔드 호출: initBillingKey() → mobileReturnUrl 포함 반환
 * 3. 프론트가 숨겨진 form 생성 (ReturnURL에 mobileReturnUrl 사용)
 * 4. goPay() 호출 → 나이스페이 결제창 오픈 (새 페이지로 이동)
 * 5. 사용자 카드 인증 완료 → NicePay가 백엔드 mobileReturnUrl로 POST
 * 6. 백엔드가 빌링키 발급 처리 후 프론트로 리다이렉트
 *    - 성공: /my/payment?paymentMethodId={id}
 *    - 실패: /my/payment?errorCode={code}&errorMessage={message}
 */

export const useNicepayPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  /**
   * 모바일 여부 감지
   */
  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  /**
   * 전역 함수 등록 (PC 환경에서만 사용 - 나이스페이 SDK가 결제창에서 호출)
   */
  useEffect(() => {
    console.log('[NicePay] 전역 함수 등록 시작');

    // nicepaySubmit: 결제 성공 시 SDK가 호출 (PC 환경)
    (window as any).nicepaySubmit = async () => {
      console.log('[NicePay] nicepaySubmit 호출됨 (PC 환경)');

      const form = (document as any).payForm;
      if (!form) {
        console.error('[NicePay] payForm을 찾을 수 없습니다.');
        return;
      }

      const authResultCode = form.AuthResultCode?.value || '';
      const authResultMsg = form.AuthResultMsg?.value || '';
      const txTid = form.TxTid?.value || '';
      const authToken = form.AuthToken?.value || '';
      const signature = form.Signature?.value || '';
      const mid = form.MID?.value || '';
      const amt = form.Amt?.value || '';

      console.log('[NicePay] 결제 결과:', {
        authResultCode,
        authResultMsg,
        txTid,
        authToken: authToken ? authToken.substring(0, 10) + '...' : '',
      });

      // 인증 실패 처리
      if (authResultCode !== '0000') {
        const errorMsg = `결제 인증 실패: ${authResultMsg}`;
        console.error('[NicePay]', errorMsg);
        setError(errorMsg);
        alert(errorMsg);
        setIsLoading(false);
        return;
      }

      // 빌링키 등록 완료 API 호출 (PC 환경에서는 프론트에서 직접 호출)
      try {
        setIsLoading(true);
        setError(null);

        // 세션 스토리지에서 moid 가져오기
        const moid = sessionStorage.getItem('nicepay_moid');
        if (!moid) {
          throw new Error('주문번호(moid)를 찾을 수 없습니다.');
        }

        const response = await paymentMethodService.registerBillingKey({
          txTid,
          authToken,
          moid,
          signature,
          mid,
          amt,
        });

        if (response.success && response.data) {
          console.log('[NicePay] 빌링키 등록 성공:', response.data);
          alert('결제수단이 성공적으로 등록되었습니다.');
          sessionStorage.removeItem('nicepay_moid');
          window.location.reload();
        } else {
          throw new Error(response.message || '빌링키 등록에 실패했습니다.');
        }
      } catch (err: any) {
        const errorMsg = err.message || '빌링키 등록 중 오류가 발생했습니다.';
        console.error('[NicePay] 빌링키 등록 실패:', err);
        setError(errorMsg);
        alert(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    // nicepayClose: 사용자가 결제창을 닫았을 때 SDK가 호출
    (window as any).nicepayClose = () => {
      console.log('[NicePay] 사용자가 결제창을 닫았습니다.');
      alert('카드 등록을 취소하셨습니다.');
      setIsLoading(false);
    };

    console.log('[NicePay] 전역 함수 등록 완료');

    return () => {
      // Cleanup
      delete (window as any).nicepaySubmit;
      delete (window as any).nicepayClose;
      console.log('[NicePay] 전역 함수 제거');
    };
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  /**
   * NicePay SDK가 로드될 때까지 대기하는 함수
   */
  const waitForNicePaySDK = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // 이미 로드되어 있는 경우 (goPay 함수만 확인)
      if (typeof window !== 'undefined' &&
          typeof (window as any).goPay === 'function') {
        console.log('[useNicepayPayment] NicePay SDK 이미 로드됨');
        resolve(true);
        return;
      }

      console.log('[useNicepayPayment] NicePay SDK 로드 대기 중...');

      // SDK 로드 대기 (최대 10초)
      let attempts = 0;
      const maxAttempts = 50; // 10초 (200ms * 50)

      const checkSDK = setInterval(() => {
        attempts++;

        // goPay 함수가 로드되었는지 확인
        if (typeof window !== 'undefined' &&
            typeof (window as any).goPay === 'function') {
          console.log(`[useNicepayPayment] NicePay SDK 로드 완료 (${attempts * 200}ms 소요)`);
          clearInterval(checkSDK);
          resolve(true);
          return;
        }

        if (attempts >= maxAttempts) {
          console.error('[useNicepayPayment] NicePay SDK 로드 타임아웃 (10초 초과)');
          console.error('[useNicepayPayment] goPay:', typeof (window as any).goPay);
          clearInterval(checkSDK);
          resolve(false);
        }
      }, 200);
    });
  }, []);

  /**
   * 나이스페이 결제창 열기 (빌링키 등록 인증 방식)
   */
  const openPayment = useCallback(async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // SDK 로드 대기
      console.log('[useNicepayPayment] NicePay SDK 로드 확인 중...');
      const sdkLoaded = await waitForNicePaySDK();

      if (!sdkLoaded) {
        throw new Error('나이스페이 SDK 로드에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요.');
      }

      // 1. 백엔드에서 빌키 등록 초기화 정보 가져오기
      console.log('[useNicepayPayment] 빌키 등록 초기화 요청');
      const initResponse = await paymentMethodService.initBillingKey();

      if (!initResponse.success || !initResponse.data) {
        throw new Error(initResponse.message || '빌키 초기화에 실패했습니다.');
      }

      const { moid, ediDate, signData, nicePayConfig, mobileReturnUrl } = initResponse.data;

      // moid를 세션 스토리지에 저장 (PC 환경 콜백에서 사용)
      sessionStorage.setItem('nicepay_moid', moid);

      // 디바이스 타입 확인
      const isMobileDevice = isMobile();

      console.log('[useNicepayPayment] 빌키 초기화 성공:', {
        moid,
        ediDate,
        config: nicePayConfig,
        mobileReturnUrl,
        isMobile: isMobileDevice,
      });

      // 2. 나이스페이 결제창 호출
      const form = document.createElement('form');
      form.name = 'payForm';

      // ReturnURL 설정
      // - PC: 프론트 콜백 URL (사용되지 않음, JS 콜백 사용)
      // - 모바일: 백엔드가 제공한 mobileReturnUrl 사용
      const returnUrl = isMobileDevice
        ? mobileReturnUrl
        : `${window.location.origin}/nicepay/callback`;

      const fields: Record<string, string> = {
        PayMethod: nicePayConfig.payMethod || 'CARD',
        GoodsName: nicePayConfig.goodsName || 'TPT 정기구독',
        Amt: nicePayConfig.amt,
        MID: nicePayConfig.mid,
        Moid: moid,
        EdiDate: ediDate,
        SignData: signData,
        BuyerName: user.name || '고객',
        BuyerEmail: user.email || '',
        BuyerTel: user.phoneNumber || '',
        CharSet: 'utf-8',
        ReturnURL: returnUrl,
      };

      // 빌링키 등록 관련 파라미터 추가
      // 백엔드에서 billAuthYn (소문자 n)으로 전달됨
      console.log('[useNicepayPayment] nicePayConfig 원본:', nicePayConfig);
      console.log('[useNicepayPayment] nicePayConfig keys:', Object.keys(nicePayConfig));

      const configAny = nicePayConfig as any;
      const billAuthValue = configAny.billAuthYN || configAny.billAuthYn;
      console.log('[useNicepayPayment] billAuthYN:', configAny.billAuthYN);
      console.log('[useNicepayPayment] billAuthYn:', configAny.billAuthYn);
      console.log('[useNicepayPayment] billAuthValue:', billAuthValue);

      if (billAuthValue) {
        fields.BillAuthYN = billAuthValue;
      }

      console.log('[useNicepayPayment] 디바이스 타입:', isMobileDevice ? '모바일' : 'PC');
      console.log('[useNicepayPayment] ReturnURL:', returnUrl);
      console.log('[useNicepayPayment] 나이스페이 결제 파라미터:', fields);

      for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);

      // NICEPAY 결제창 호출 (SDK 로드 확인 완료됨)
      console.log('[useNicepayPayment] 나이스페이 결제창 호출');

      // goPay 함수 호출 (전역 함수)
      if (typeof (window as any).goPay === 'function') {
        (window as any).goPay(form);
      } else {
        throw new Error('NicePay SDK의 goPay 함수를 찾을 수 없습니다.');
      }
    } catch (err: any) {
      const errorMsg = err.message || '결제 시스템 초기화 중 오류가 발생했습니다.';
      console.error('[useNicepayPayment] 결제창 열기 실패:', err);
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [user, waitForNicePaySDK, isMobile]);

  return {
    openPayment,
    isLoading,
    error,
  };
};
