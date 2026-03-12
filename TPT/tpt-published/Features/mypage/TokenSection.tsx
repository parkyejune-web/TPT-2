'use client';

import { Coins, Infinity } from 'lucide-react';

interface TokenSectionProps {
  remainingToken?: number;
  isPremium: boolean;
}

/**
 * 마이페이지 사이드바의 토큰 섹션
 * BASIC: 은색으로 토큰 개수 표시
 * PREMIUM: 금색으로 무한 기호 표시
 */
export default function TokenSection({ remainingToken, isPremium }: TokenSectionProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="text-sm font-semibold text-gray-700">My TOKEN</h3>
      <div className="flex items-center gap-2">
        <Coins
          size={20}
          className={isPremium ? 'text-[#D2C693]' : 'text-gray-400'}
        />
        {isPremium ? (
          <div className="flex items-center gap-1">
            <Infinity
              size={24}
              className="bg-gradient-to-r from-[#D2C693] to-[#928346] bg-clip-text text-transparent"
              style={{ strokeWidth: 2.5 }}
            />
            <span className="text-base font-bold bg-gradient-to-r from-[#D2C693] to-[#928346] bg-clip-text text-transparent">
              무한
            </span>
          </div>
        ) : (
          <span className="text-base font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
            {remainingToken ?? 0}개
          </span>
        )}
      </div>
    </div>
  );
}
