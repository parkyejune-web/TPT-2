'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../Shared/hooks/useAuth';

/**
 * 로그인 에러 코드 상수
 */
const LOGIN_ERROR_CODES = {
  USER_NOT_FOUND: 'AUTH_401_07', // 존재하지 않는 사용자
  INVALID_CREDENTIALS: 'AUTH_401_06', // 아이디/비밀번호 불일치
} as const;

/**
 * 로그인 API 응답에서 에러 메시지 반환
 * @param status - HTTP 상태 코드
 * @param errorCode - 서버에서 반환한 에러 코드 (예: AUTH_401_07)
 * @param serverMessage - 서버에서 반환한 에러 메시지 (선택)
 * @returns 사용자에게 표시할 에러 메시지
 */
const getLoginErrorMessage = (status?: number, errorCode?: string, serverMessage?: string): string => {
  // 서버 에러 코드 기반 처리 (우선순위 높음)
  if (errorCode === LOGIN_ERROR_CODES.USER_NOT_FOUND) {
    return '알 수 없는 계정입니다. 회원가입 후 로그인 해주세요.';
  }

  if (errorCode === LOGIN_ERROR_CODES.INVALID_CREDENTIALS) {
    return '비밀번호가 잘못되었습니다.';
  }

  // 서버 오류 (500번대)
  if (status && status >= 500) {
    return '서버 오류입니다. 나중에 다시 시도해주세요.';
  }

  // 네트워크 오류 (status가 0인 경우)
  if (status === 0) {
    return '네트워크 오류입니다. 인터넷 연결을 확인해주세요.';
  }

  // 기타 에러 - 서버 메시지 또는 기본 메시지
  return serverMessage || '로그인에 실패했습니다.';
};

/**
 * 로그인 폼 로직을 관리하는 커스텀 훅
 */
export const useLoginForm = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleLogin = async () => {
    if (!userId || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      setShowErrorModal(true);
      return;
    }

    // 아이디와 비밀번호에서 모든 공백 제거
    const trimmedUserId = userId.replace(/\s/g, '');
    const trimmedPassword = password.replace(/\s/g, '');

    const result = await login({
      username: trimmedUserId,
      password: trimmedPassword,
      rememberMe: checked,
    });

    if (result.success) {
      // 로그인 성공 시 사용자 정보는 useAuth의 login 함수에서 store에 저장됨
      console.log('[useLoginForm] 로그인 성공, 홈으로 이동');
      router.push('/home');
    } else {
      // 서버 에러 코드 추출 (에러 시 data에 서버 응답 전체가 포함됨)
      const errorCode = (result.data as { code?: string })?.code;
      console.log('[useLoginForm] 로그인 실패 - status:', result.status, 'code:', errorCode, 'message:', result.error);

      // 에러 코드와 상태 코드에 따른 에러 메시지 분기 처리
      const errorMessage = getLoginErrorMessage(result.status, errorCode, result.error);
      setError(errorMessage);
      setShowErrorModal(true);
    }
  };

  return {
    userId,
    setUserId,
    password,
    setPassword,
    checked,
    setChecked,
    error,
    showErrorModal,
    setShowErrorModal,
    isLoading,
    handleLogin,
  };
};
