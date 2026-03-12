'use client';

import Image from 'next/image';

interface MembershipSectionProps {
  isPremium: boolean;
  isCourseCompleted: boolean;
}

/**
 * 마이페이지 사이드바의 멤버십 타입 섹션
 * BASIC: Regular (은색 아이콘)
 * PREMIUM: Pro (금색 아이콘)
 * 완강 상태 표시
 */
export default function MembershipSection({ isPremium, isCourseCompleted }: MembershipSectionProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="text-sm font-semibold text-gray-700">TPT Type</h3>
      <div className="flex items-center gap-3">
        {/* 멤버십 아이콘 */}
        <Image
          src={isPremium ? '/images/membershipLevel_icon_Pro.svg' : '/images/membershipLevel_icon_Regular.svg'}
          alt={isPremium ? 'Pro' : 'Regular'}
          width={24}
          height={24}
          className="w-6 h-6"
        />
        {/* 멤버십 텍스트 */}
        <span
          className={`text-lg font-bold ${
            isPremium
              ? 'bg-gradient-to-r from-[#D2C693] to-[#928346] bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent'
          }`}
        >
          {isPremium ? 'Pro' : 'Regular'}
        </span>
        {/* 완강 상태 */}
        <span className="text-sm text-gray-500 px-2 py-0.5 border border-gray-300 rounded">
          {isCourseCompleted ? '완강 후' : '완강 전'}
        </span>
      </div>
    </div>
  );
}
