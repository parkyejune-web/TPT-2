'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useWindowWidth } from '../../../../Shared/hooks/useWindowWidth';

/**
 * 토큰 제도 가이드라인 페이지
 * 무료 피드백 요청 방법 및 토큰 시스템 안내
 */
export default function TokenGuidePage() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 860;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <main className="pb-16">
        <div className="w-full max-w-full">
          {/* 토큰 가이드라인 이미지 - 반응형 */}
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
              src={isMobile ? '/images/banners/final_token_banner_5_mobile.png' : '/images/banners/final_token_banner_5_desk.png'}
              alt="토큰 제도 가이드라인"
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
