/**
 * 결제수단 관련 API 서비스
 * 나이스페이먼츠를 활용한 빌링키 등록 및 결제수단 관리
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  BillingKeyInitResponseDTO,
  BillingKeyCompleteRequestDTO,
  BillingKeyRegisterResponseDTO,
  CardInfoRequestDTO,
  PaymentMethodResponseDTO,
} from '../apiTypes';

/**
 * 빌키 등록 초기화
 * 나이스페이 인증창을 띄우는데 필요한 정보를 생성합니다.
 */
export const initBillingKey = async (): Promise<ApiResponse<BillingKeyInitResponseDTO>> => {
  console.log('[paymentMethodService] 빌키 등록 초기화 요청');
  const result = await fetcher<BillingKeyInitResponseDTO>(
    API_ENDPOINTS.PAYMENT_METHOD.BILLING_KEY_INIT,
    {
      method: 'POST',
    }
  );
  console.log('[paymentMethodService] 빌키 등록 초기화 결과:', result);
  return result;
};

/**
 * 빌키 등록 완료 (인증 방식)
 * 나이스페이 인증 완료 후 빌링키를 발급받고 결제수단을 등록합니다.
 */
export const registerBillingKey = async (
  data: BillingKeyCompleteRequestDTO
): Promise<ApiResponse<BillingKeyRegisterResponseDTO>> => {
  console.log('[paymentMethodService] 빌키 등록 완료 요청:', data);
  const result = await fetcher<BillingKeyRegisterResponseDTO>(
    API_ENDPOINTS.PAYMENT_METHOD.BILLING_KEY_REGISTER,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  console.log('[paymentMethodService] 빌키 등록 완료 결과:', result);
  return result;
};

/**
 * 빌키 등록 (비인증 방식)
 * 카드 정보를 직접 전달하여 빌링키를 발급받고 결제수단을 등록합니다.
 * ⚠️ 보안 주의: 프론트엔드에서도 HTTPS 사용 필수
 */
export const registerBillingKeyDirect = async (
  data: CardInfoRequestDTO
): Promise<ApiResponse<BillingKeyRegisterResponseDTO>> => {
  console.log('[paymentMethodService] 빌키 직접 등록 요청 (카드번호 마스킹)');
  const result = await fetcher<BillingKeyRegisterResponseDTO>(
    API_ENDPOINTS.PAYMENT_METHOD.BILLING_KEY_DIRECT,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  console.log('[paymentMethodService] 빌키 직접 등록 결과:', result);
  return result;
};

/**
 * 주 결제수단 조회
 */
export const getPrimaryPaymentMethod = async (): Promise<
  ApiResponse<PaymentMethodResponseDTO>
> => {
  console.log('[paymentMethodService] 주 결제수단 조회 요청');
  const result = await fetcher<PaymentMethodResponseDTO>(API_ENDPOINTS.PAYMENT_METHOD.LIST, {
    method: 'GET',
  });
  console.log('[paymentMethodService] 주 결제수단 조회 결과:', result);
  return result;
};

/**
 * 결제수단 상세 조회
 */
export const getPaymentMethodDetail = async (
  paymentMethodId: number
): Promise<ApiResponse<PaymentMethodResponseDTO>> => {
  console.log('[paymentMethodService] 결제수단 상세 조회 요청:', paymentMethodId);
  const result = await fetcher<PaymentMethodResponseDTO>(
    API_ENDPOINTS.PAYMENT_METHOD.DETAIL(paymentMethodId),
    {
      method: 'GET',
    }
  );
  console.log('[paymentMethodService] 결제수단 상세 조회 결과:', result);
  return result;
};

/**
 * 결제수단 삭제
 */
export const deletePaymentMethod = async (
  paymentMethodId: number
): Promise<ApiResponse<void>> => {
  console.log('[paymentMethodService] 결제수단 삭제 요청:', paymentMethodId);
  const result = await fetcher<void>(API_ENDPOINTS.PAYMENT_METHOD.DELETE(paymentMethodId), {
    method: 'DELETE',
  });
  console.log('[paymentMethodService] 결제수단 삭제 결과:', result);
  return result;
};
