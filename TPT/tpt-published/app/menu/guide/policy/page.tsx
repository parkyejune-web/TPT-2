'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useWindowWidth } from '../../../../Shared/hooks/useWindowWidth';

/**
 * TPT 이용정책 페이지
 */
export default function TPTPolicyPage() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 860;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <main className="pb-16">
        <div className="w-full">
          {/* 이용정책 배너 이미지 - 반응형 */}
          <div className="relative w-full" style={{ minHeight: isMobile ? '500px' : '800px' }}>
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  <p className="text-gray-600 font-medium">로딩 중...</p>
                </div>
              </div>
            )}
            <Image
              src={isMobile ? '/images/banners/final_guide-policy_banner_mobile_6.svg' : '/images/banners/final_guide-policy_banner_desk_6.svg'}
              alt="TPT 이용정책"
              width={1920}
              height={1080}
              className={`w-full h-auto object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}
