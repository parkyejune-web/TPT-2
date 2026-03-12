'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useWindowWidth } from '../../../Shared/hooks/useWindowWidth';

const YOUTUBE_LINK = 'https://youtube.com/channel/UCJNM-fjJuSRKfNWgAswVyFA?si=cdQ243WFMZXupVV1';

/**
 * About TPT 페이지
 * TPT 서비스 소개 페이지
 */
export default function AboutPage() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 860;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleYoutubeClick = () => {
    if (YOUTUBE_LINK) {
      window.open(YOUTUBE_LINK, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="pb-16">
        <div className="w-full">
          {/* About 배너 이미지 - 반응형 */}
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
              src={isMobile ? '/images/banners/final_brand_banner_mobile_4.svg' : '/images/banners/final_brand_banner_desk_4.svg'}
              alt="About TPT"
              width={1920}
              height={1080}
              className={`w-full h-auto object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
              priority
            />
            {/* 유튜브 버튼 - 이미지 하단에 겹쳐서 배치 */}
            <button
              onClick={handleYoutubeClick}
              className="absolute bottom-30 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10 cursor-pointer hover:scale-105 transition-transform"
            >
              <Image
                src="/images/brand_youtube_button_img.svg"
                alt="YouTube"
                width={200}
                height={60}
                className="w-auto h-auto"
              />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
