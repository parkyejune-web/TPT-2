/**
 * 인증 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  LoginRequest,
  SignupRequest,
} from '../apiTypes';

/**
 * 회원가입
 */
export const signup = async (data: SignupRequest): Promise<ApiResponse<void>> => {
  return fetcher<void>(API_ENDPOINTS.AUTH.SIGNUP, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * 로그인
 */
export const login = async (data: LoginRequest): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<ApiResponse<void>> => {
  return fetcher<void>(API_ENDPOINTS.AUTH.LOGOUT, {
    method: 'POST',
  });
};

/**
 * 내 정보 조회
 */
export const getMyInfo = async (): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.AUTH.ME, {
    method: 'GET',
  });
};

/**
 * 회원 탈퇴
 */
export const deleteUser = async (): Promise<ApiResponse<void>> => {
  return fetcher<void>(API_ENDPOINTS.AUTH.DELETE_USER, {
    method: 'DELETE',
  });
};

/**
 * 소셜 로그인 정보 조회
 */
export const getSocialInfo = async (): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.AUTH.SOCIAL_INFO, {
    method: 'GET',
  });
};

/**
 * 휴대폰 인증코드 발송
 */
export const sendPhoneCode = async (
  data: { phoneNumber: string }
): Promise<ApiResponse<void>> => {
  console.log('[authService] 전화번호 인증코드 발송 요청:', data);
  const result = await fetcher<void>(API_ENDPOINTS.AUTH.PHONE_CODE, {
    method: 'POST',
    body: JSON.stringify({ phone: data.phoneNumber }), // phoneNumber -> phone 변환
  });
  console.log('[authService] 전화번호 인증코드 발송 결과:', result);
  return result;
};

/**
 * 휴대폰 인증코드 검증
 */
export const verifyPhoneCode = async (
  data: { phoneNumber: string; code: string }
): Promise<ApiResponse<void>> => {
  console.log('[authService] 전화번호 인증코드 검증 요청:', data);
  const result = await fetcher<void>(API_ENDPOINTS.AUTH.PHONE_VERIFY, {
    method: 'POST',
    body: JSON.stringify({
      type: 'PHONE',
      value: data.phoneNumber,
      code: data.code,
    }),
  });
  console.log('[authService] 전화번호 인증코드 검증 결과:', result);
  return result;
};

/**
 * 이메일 인증코드 발송
 */
export const sendEmailCode = async (
  data: any
): Promise<ApiResponse<void>> => {
  return fetcher<void>(API_ENDPOINTS.AUTH.EMAIL_CODE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * 이메일 인증코드 검증
 */
export const verifyEmailCode = async (
  data: { email: string; code: string }
): Promise<ApiResponse<void>> => {
  console.log('[authService] 이메일 인증코드 검증 요청:', data);
  const result = await fetcher<void>(API_ENDPOINTS.AUTH.EMAIL_VERIFY, {
    method: 'POST',
    body: JSON.stringify({
      type: 'EMAIL',
      value: data.email,
      code: data.code,
    }),
  });
  console.log('[authService] 이메일 인증코드 검증 결과:', result);
  return result;
};

/**
 * 아이디 찾기 (이메일 기반)
 */
export const findId = async (data: any): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.AUTH.FIND_ID, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * 아이디 중복 확인
 */
export const checkUsernameAvailable = async (username: string): Promise<ApiResponse<boolean>> => {
  return fetcher<boolean>(`${API_ENDPOINTS.AUTH.USERNAME_AVAILABLE}?username=${username}`, {
    method: 'GET',
  });
};

/**
 * 비밀번호 재설정 (비로그인 상태)
 */
export const updatePassword = async (
  data: any
): Promise<ApiResponse<void>> => {
  return fetcher<void>(API_ENDPOINTS.AUTH.PASSWORD_UPDATE, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * 비밀번호 변경 (로그인 상태)
 */
export const changePassword = async (
  data: any
): Promise<ApiResponse<void>> => {
  return fetcher<void>(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * 프로필 이미지 변경 응답 타입
 */
interface UpdateProfileImageResponse {
  myProfileImage: string;
}

/**
 * 프로필 이미지 변경
 */
export const updateProfileImage = async (file: File): Promise<ApiResponse<UpdateProfileImageResponse>> => {
  const formData = new FormData();
  formData.append('file', file);

  console.log('[authService] 프로필 이미지 업로드 요청');
  const result = await fetcher<UpdateProfileImageResponse>(API_ENDPOINTS.USER.PROFILE_IMAGE, {
    method: 'POST',
    body: formData,
    // FormData는 자동으로 Content-Type 설정되므로 headers 생략
  });
  console.log('[authService] 프로필 이미지 업로드 응답:', result);
  return result;
};
