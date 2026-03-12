'use client';

import React from 'react';
import CustomInputField from '@/Shared/ui/CustomInputField';
import CustomButton from '@/Shared/ui/CustomButton';
import CustomCheckBox from '@/Shared/ui/CustomCheckBox';

interface LoginFormProps {
  userId: string;
  setUserId: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  checked: boolean;
  setChecked: (v: boolean) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

/**
 * 로그인 폼 컴포넌트
 */
export default function LoginForm({
  userId,
  setUserId,
  password,
  setPassword,
  checked,
  setChecked,
  isLoading,
  onSubmit,
}: LoginFormProps) {
  const isLoginEnabled = !!(userId && password) && !isLoading;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-6 w-full"
    >
      <CustomInputField
        id="userId"
        label="아이디"
        placeholder="아이디를 입력하세요"
        value={userId}
        onChange={setUserId}
        variant={2}
        required
      />
      <CustomInputField
        id="password"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={setPassword}
        variant={2}
        type="password"
        required
      />

      <CustomButton
        type="submit"
        width="w-full"
        variant="prettyFull"
        disabled={!isLoginEnabled}
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </CustomButton>

      <CustomCheckBox
        checked={checked}
        onChange={setChecked}
        label="자동 로그인"
        size="sm"
      />
    </form>
  );
}
