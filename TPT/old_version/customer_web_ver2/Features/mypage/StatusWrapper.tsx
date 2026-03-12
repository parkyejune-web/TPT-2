'use client';

import { ReactNode } from 'react';

type StatusWrapperProps = {
  type: 'basic' | 'premium' | 'all'; // 어떤 기능 레벨인지
  basic_available: boolean;
  premium_available: boolean;
  message?: string;
  children: ReactNode;
};

/**
 * 사용자 상태에 따라 콘텐츠를 blur 처리하거나 표시하는 래퍼 컴포넌트
 */
export default function StatusWrapper({
  type,
  basic_available,
  premium_available,
  message,
  children,
}: StatusWrapperProps) {
  let available = false;

  // 타입에 따른 사용 가능 여부 계산
  if (type === 'basic') {
    available = basic_available;
  } else if (type === 'premium') {
    available = premium_available;
  } else if (type === 'all') {
    available = basic_available && premium_available; // 둘 다 true여야 함
  }

  if (available) return <>{children}</>;

  return (
    <div className="relative w-full">
      {/* blur 처리된 실제 콘텐츠 */}
      <div className="blur-sm select-none pointer-events-none">{children}</div>

      {/* 안내 문구 */}
      {message && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-semibold text-[#0F182B]">{message}</span>
        </div>
      )}
    </div>
  );
}
