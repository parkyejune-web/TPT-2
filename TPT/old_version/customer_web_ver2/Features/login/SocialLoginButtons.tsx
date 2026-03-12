'use client';

import React from 'react';
import Image from 'next/image';

interface SocialLoginButtonsProps {
  onKakao: () => void;
  onNaver: () => void;
  disabled?: boolean;
}

/**
 * 소셜 로그인 버튼 컴포넌트
 */
export default function SocialLoginButtons({
  onKakao,
  onNaver,
  disabled = false,
}: SocialLoginButtonsProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="text-center text-sm text-gray-500">또는 소셜 로그인</div>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          type="button"
          onClick={onKakao}
          disabled={disabled}
          className="flex-1 relative overflow-hidden rounded-md h-12 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          <Image
            src="/images/kakao_login_img_small.png"
            alt="카카오 로그인"
            fill
            className="object-cover"
          />
        </button>
        <button
          type="button"
          onClick={onNaver}
          disabled={disabled}
          className="flex-1 relative overflow-hidden rounded-md h-12 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          <Image
            src="/images/naver_login_img.png"
            alt="네이버 로그인"
            fill
            className="object-cover"
          />
        </button>
      </div>
    </div>
  );
}
