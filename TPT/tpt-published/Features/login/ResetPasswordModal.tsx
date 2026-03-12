'use client';

import React, { useState } from 'react';
import CustomModal from '../../Shared/ui/CustomModal';
import CustomInputField from '../../Shared/ui/CustomInputField';
import CustomButton from '../../Shared/ui/CustomButton';
import { authService } from '../../Shared/api/services';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 비밀번호 재설정 모달 (로그인 전)
 * 이메일 인증을 통해 비밀번호를 재설정
 */
export default function ResetPasswordModal({ isOpen, onClose }: ResetPasswordModalProps) {
  // 입력 상태
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false); // 인증코드 검증 중
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 완료 여부
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [passwordWarning, setPasswordWarning] = useState<string | null>(null); // 예전 비밀번호 경고
  const [emailError, setEmailError] = useState<string | null>(null); // 이메일 형식 오류
  const [codeError, setCodeError] = useState<string | null>(null); // 인증코드 오류

  // 이메일 형식 검사
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사 (숫자+특수문자 포함 6~11자)
  const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,11}$/;
    return passwordRegex.test(password);
  };

  // 이메일 인증코드 발송
  const handleSendEmailCode = async () => {
    if (!email) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('이메일 형식이 맞지 않습니다.');
      return;
    }

    setEmailError(null);
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await authService.sendEmailCode({ email });
      if (res.success) {
        setSuccessMsg('인증코드가 이메일로 전송되었습니다.');
      } else {
        setErrorMsg(res.error || '인증코드 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 인증코드 발송 실패:', error);
      setErrorMsg('인증코드 전송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이메일 인증코드 검증
  const handleVerifyEmailCode = async () => {
    if (!email) {
      setCodeError('먼저 이메일을 입력해주세요.');
      return;
    }

    if (!code) {
      setCodeError('인증코드를 입력해주세요.');
      return;
    }

    if (code.length !== 6) {
      setCodeError('인증코드는 6자리입니다.');
      return;
    }

    setCodeError(null);
    setVerifyingCode(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await authService.verifyEmailCode({ email, code });
      console.log('[ResetPasswordModal] 이메일 인증코드 검증 결과:', res);

      if (res.success) {
        setIsEmailVerified(true);
        setSuccessMsg('이메일 인증이 완료되었습니다.');
      } else {
        // API에서 반환하는 에러 메시지가 부적절할 수 있으므로 명확한 메시지로 대체
        console.log('[ResetPasswordModal] 인증코드 검증 실패 원본 메시지:', res.error);
        setCodeError('인증코드가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('이메일 인증코드 검증 실패:', error);
      setCodeError('인증코드 검증 중 오류가 발생했습니다.');
    } finally {
      setVerifyingCode(false);
    }
  };

  // 비밀번호 재설정 요청
  const handleResetPassword = async () => {
    if (!username || !email || !code || !newPassword || !newPasswordCheck) {
      setErrorMsg('모든 항목을 입력해주세요.');
      return;
    }

    if (!isValidPassword(newPassword)) {
      setErrorMsg('비밀번호는 숫자와 특수문자를 포함하여 6~11자로 입력해주세요.');
      return;
    }

    if (newPassword !== newPasswordCheck) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setPasswordWarning(null);
    setLoading(true);

    try {
      const res = await authService.updatePassword({
        username,
        email,
        code,
        newPassword,
        newPasswordCheck,
      });

      console.log('[ResetPasswordModal] API 응답:', res);

      if (res.success) {
        setSuccessMsg('비밀번호가 성공적으로 재설정되었습니다.');
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        // 에러 코드 또는 메시지로 분기 처리
        const errorCode = (res as any).code || '';
        const errorMessage = res.error || res.message || '';

        // PASSWORD_RECENT_REUSED 에러 코드 처리
        if (errorCode === 'PASSWORD_RECENT_REUSED') {
          setPasswordWarning('이전에 사용하신 비밀번호는 사용하실 수 없습니다.');
        } else if (
          errorMessage.includes('예전 비밀번호') ||
          errorMessage.includes('이전 비밀번호') ||
          errorMessage.includes('같은 비밀번호') ||
          errorMessage.includes('previously used') ||
          errorMessage.includes('same password')
        ) {
          setPasswordWarning('이전에 사용하신 비밀번호는 사용하실 수 없습니다.');
        } else {
          setErrorMsg(errorMessage || '비밀번호 재설정에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      setErrorMsg('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    setEmail('');
    setCode('');
    setNewPassword('');
    setNewPasswordCheck('');
    setErrorMsg(null);
    setSuccessMsg(null);
    setPasswordWarning(null);
    setEmailError(null);
    setCodeError(null);
    setIsEmailVerified(false);
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} variant={1} width="w-lg">
      <div className="p-3 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">비밀번호 재설정</h2>

        {/* 아이디 입력 */}
        <CustomInputField
          placeholder="아이디 입력"
          value={username}
          onChange={setUsername}
          variant={2}
          autoComplete="username"
        />

        {/* 이메일 입력 + 인증코드 발송 버튼 */}
        <div className="w-full">
          <CustomInputField
            placeholder="이메일 입력"
            value={email}
            onChange={(val) => {
              setEmail(val);
              if (emailError) setEmailError(null);
            }}
            variant={3}
            buttonLabel="인증하기"
            onButtonClick={handleSendEmailCode}
            disabled={loading}
            type="email"
            autoComplete="off"
          />
          {emailError && (
            <p className="text-red-500 text-xs mt-1 text-right">{emailError}</p>
          )}
        </div>

        {/* 인증코드 입력 + 인증하기 버튼 */}
        <div className="w-full">
          <CustomInputField
            placeholder="이메일로 받은 인증코드 입력"
            value={code}
            onChange={(val) => {
              setCode(val);
              if (codeError) setCodeError(null);
              // 인증코드가 변경되면 인증 상태 초기화
              if (isEmailVerified) setIsEmailVerified(false);
            }}
            variant={3}
            buttonLabel={isEmailVerified ? '인증완료' : (verifyingCode ? '검증중...' : '인증하기')}
            onButtonClick={isEmailVerified ? undefined : handleVerifyEmailCode}
            disabled={verifyingCode || isEmailVerified}
            autoComplete="off"
          />
          {codeError && (
            <p className="text-red-500 text-xs mt-1 text-right">{codeError}</p>
          )}
          {isEmailVerified && (
            <p className="text-green-600 text-xs mt-1 text-right">인증이 완료되었습니다.</p>
          )}
        </div>

        {/* 새 비밀번호 입력 */}
        <CustomInputField
          placeholder="새 비밀번호 입력"
          value={newPassword}
          onChange={setNewPassword}
          variant={2}
          type="password"
          autoComplete="new-password"
        />

        {/* 새 비밀번호 재입력 */}
        <div className="w-full">
          <CustomInputField
            placeholder="새 비밀번호 재입력"
            value={newPasswordCheck}
            onChange={setNewPasswordCheck}
            variant={2}
            type="password"
            autoComplete="new-password"
          />
          {/* 예전 비밀번호 경고 (입력 필드 우측 하단) */}
          {passwordWarning && (
            <p className="text-red-500 text-xs mt-1 text-right">{passwordWarning}</p>
          )}
        </div>

        {/* 메시지 영역 */}
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

        {/* 완료 버튼 - 이메일 인증이 완료되어야 활성화 */}
        <div className="w-full mt-2 flex flex-col items-center justify-center gap-2">
          {!isEmailVerified && (
            <p className="text-gray-500 text-xs">이메일 인증을 완료해주세요.</p>
          )}
          <CustomButton
            variant="prettyFull"
            onClick={handleResetPassword}
            disabled={loading || !isEmailVerified}
          >
            {loading ? '처리 중...' : '완료'}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
