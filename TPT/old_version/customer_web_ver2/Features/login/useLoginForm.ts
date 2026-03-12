'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../Shared/hooks/useAuth';

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

    const result = await login({
      username: userId,
      password,
      rememberMe: checked,
    });

    if (result.success) {
      // 로그인 성공 시 사용자 정보는 useAuth의 login 함수에서 store에 저장됨
      console.log('[useLoginForm] 로그인 성공, 홈으로 이동');
      router.push('/home');
    } else {
      setError(result.error || '로그인에 실패했습니다.');
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
