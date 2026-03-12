'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { adminLogin } from '../api/auth';
import { getXsrfToken, setXsrfToken } from '../utils/xsrfToken';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await adminLogin({ username, password });

      if (response.success && response.data) {
        // 토큰이 있으면 저장 (추후 인증에 사용)
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
        }
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        // 로그인 성공 후 약간의 지연을 두고 쿠키에서 XSRF-TOKEN 읽기
        // (브라우저가 set-cookie 헤더를 처리할 시간을 줌)
        setTimeout(() => {
          const xsrfToken = getXsrfToken();
          if (xsrfToken) {
            setXsrfToken(xsrfToken);
            console.log('XSRF-TOKEN saved from cookie:', xsrfToken);
          } else {
            console.warn('XSRF-TOKEN not found in cookies');
          }
        }, 100);

        // 로그인 성공 시 관리자 페이지로 이동
        router.push('/admin');
      } else {
        setError(response.error || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6 p-8">
        {/* 데스크톱 안내 문구 */}
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
          <p className="text-red-700 text-sm text-center font-medium">
            관리자 사이트는 데스크톱 화면에 최적화되어있습니다.<br />
            모바일이 아닌 데스크톱으로 접속하시길 바랍니다.
          </p>
        </div>

        {/* 로그인 섹션 */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              TPT 운영 관리자
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              관리자 계정으로 로그인하세요
            </p>
          </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <CustomInput
              type="text"
              label="아이디"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <CustomInput
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <CustomButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </CustomButton>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
