'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useWindowWidth } from '../../../Shared/hooks/useWindowWidth';
import AccessGuard from '../../../Shared/ui/AccessGuard';

/**
 * 트레이딩 룸 안내 페이지
 */
export default function AnalysisPage() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 860;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 카카오 채널 링크
  const kakaoChannelLink = 'http://pf.kakao.com/_eTxkNn/chat';

  const handleKakaoClick = () => {
    window.open(kakaoChannelLink, '_blank');
  };

  return (
    <AccessGuard level="UID_APPROVED_REQUIRED">
    <div className="min-h-screen bg-white flex flex-col">
      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        {/* 배너 이미지 - 반응형 */}
        <div className="w-full relative" style={{ minHeight: isMobile ? '500px' : '800px' }}>
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="text-gray-600 font-medium">로딩 중...</p>
              </div>
            </div>
          )}
          <Image
            src={isMobile ? '/images/banners/final_analysis_banner_mobile_2.png' : '/images/banners/final_analysis_banner_desk_2.png'}
            alt="TPT 트레이딩 룸 배너"
            width={1920}
            height={1080}
            className={`w-full h-auto object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
            priority
          />
        </div>

        {/* 카카오 채널 버튼 - 화면의 50% width */}
        <div className="w-1/2 my-8 mx-auto">
          <button
            onClick={handleKakaoClick}
            className="cursor-pointer w-full"
          >
            <Image
              src="/images/banners/analysis_kakao-button.svg"
              alt="카카오 채널 상담"
              width={1920}
              height={80}
              className="w-full h-auto"
            />
          </button>
        </div>
      </main>
    </div>
    </AccessGuard>
  );
}
