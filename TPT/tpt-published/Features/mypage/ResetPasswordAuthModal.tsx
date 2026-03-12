'use client';

import React, { useState } from 'react';
import CustomModal from '../../Shared/ui/CustomModal';
import CustomInputField from '../../Shared/ui/CustomInputField';
import CustomButton from '../../Shared/ui/CustomButton';
import { authService } from '../../Shared/api/services';

interface ResetPasswordAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 비밀번호 변경 모달 (로그인 후)
 * 현재 비밀번호 확인 후 새 비밀번호로 변경
 */
export default function ResetPasswordAuthModal({ isOpen, onClose }: ResetPasswordAuthModalProps) {
  // 입력 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 비밀번호 유효성 검사 (숫자+특수문자 포함 6~11자)
  const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,11}$/;
    return passwordRegex.test(password);
  };

  // 비밀번호 변경 요청
  const handleResetPassword = async () => {
    if (!currentPassword || !newPassword || !newPasswordCheck) {
      setErrorMsg('모든 항목을 입력해주세요.');
      return;
    }

    if (!isValidPassword(newPassword)) {
      setErrorMsg('비밀번호는 숫자와 특수문자를 포함하여 6~11자로 입력해주세요.');
      return;
    }

    if (newPassword !== newPasswordCheck) {
      setErrorMsg('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      // API 명세에 따라 currentPassword, newPassword만 전송
      const res = await authService.changePassword({
        currentPassword,
        newPassword,
      });

      console.log('[ResetPasswordAuthModal] API 응답:', res);

      if (res.success) {
        setSuccessMsg('비밀번호가 성공적으로 변경되었습니다.');
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setErrorMsg(res.error || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      setErrorMsg('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordCheck('');
    setErrorMsg(null);
    setSuccessMsg(null);
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} variant={1} width='max-w-xl'>
      <div className="p-3 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">비밀번호 변경</h2>

        {/* 현재 비밀번호 입력 */}
        <CustomInputField
          placeholder="현재 비밀번호 입력"
          value={currentPassword}
          onChange={setCurrentPassword}
          variant={2}
          type="password"
          autoComplete="off"
        />

        {/* 새 비밀번호 입력 */}
        <CustomInputField
          placeholder="새 비밀번호 입력"
          value={newPassword}
          onChange={setNewPassword}
          variant={2}
          type="password"
          autoComplete="new-password"
        />

        {/* 새 비밀번호 확인 */}
        <CustomInputField
          placeholder="새 비밀번호 재입력"
          value={newPasswordCheck}
          onChange={setNewPasswordCheck}
          variant={2}
          type="password"
          autoComplete="new-password"
        />

        {/* 메시지 영역 */}
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

        {/* 완료 버튼 */}
        <div className="w-full mt-2 flex items-center justify-center">
          <CustomButton variant="prettyFull" onClick={handleResetPassword} disabled={loading}>
            {loading ? '처리 중...' : '완료'}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
