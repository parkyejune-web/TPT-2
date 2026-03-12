/**
 * 결제수단 관리 훅
 * 결제수단 조회, 삭제 등의 기능을 제공합니다.
 */

import { useState, useEffect } from 'react';
import {
  getPrimaryPaymentMethod,
  deletePaymentMethod as deletePaymentMethodAPI,
} from '../../../../Shared/api/services/paymentMethodService';
import type { PaymentMethodResponseDTO, ApiResponse } from '../../../../Shared/api/apiTypes';

interface UsePaymentMethodReturn {
  paymentMethod: PaymentMethodResponseDTO | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deletePaymentMethod: (paymentMethodId: number) => Promise<ApiResponse<void>>;
}

export const usePaymentMethod = (): UsePaymentMethodReturn => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 주 결제수단 조회
   */
  const fetchPaymentMethod = async () => {
    console.log('[usePaymentMethod] 주 결제수단 조회 시작');
    setLoading(true);
    setError(null);

    try {
      const result = await getPrimaryPaymentMethod();
      console.log('[usePaymentMethod] 주 결제수단 조회 결과:', result);

      if (result.success && result.data) {
        setPaymentMethod(result.data);
      } else {
        // 등록된 결제수단이 없는 경우 (정상 상태)
        setPaymentMethod(null);
        if (result.error) {
          console.log('[usePaymentMethod] 결제수단 없음 또는 오류:', result.error);
        }
      }
    } catch (err) {
      console.error('[usePaymentMethod] 주 결제수단 조회 실패:', err);
      setError('결제수단 정보를 불러오는 중 오류가 발생했습니다.');
      setPaymentMethod(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 결제수단 삭제
   */
  const deletePaymentMethod = async (paymentMethodId: number): Promise<ApiResponse<void>> => {
    console.log('[usePaymentMethod] 결제수단 삭제 시작:', paymentMethodId);

    try {
      const result = await deletePaymentMethodAPI(paymentMethodId);
      console.log('[usePaymentMethod] 결제수단 삭제 결과:', result);

      if (result.success) {
        // 삭제 성공 시 상태 업데이트
        setPaymentMethod(null);
      }

      return result;
    } catch (err) {
      console.error('[usePaymentMethod] 결제수단 삭제 실패:', err);
      return {
        success: false,
        error: '결제수단 삭제 중 오류가 발생했습니다.',
      };
    }
  };

  // 컴포넌트 마운트 시 결제수단 조회
  useEffect(() => {
    fetchPaymentMethod();
  }, []);

  return {
    paymentMethod,
    loading,
    error,
    refetch: fetchPaymentMethod,
    deletePaymentMethod,
  };
};
