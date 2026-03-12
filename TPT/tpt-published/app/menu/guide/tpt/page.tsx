'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWindowWidth } from '../../../../Shared/hooks/useWindowWidth';

const BOTTOM_BANNERS = [
  {
    desktopSrc: '/images/banners/final_guide-tpt_banner_bottom_1_desk.svg',
    mobileSrc: '/images/banners/final_guide-tpt_banner_bottom_1_mobile.svg',
    alt: 'TPT 가이드라인 - 강의 목록',
    link: 'https://www.tradingpt.kr/menu/class-list',
  },
  {
    desktopSrc: '/images/banners/final_guide-tpt_banner_bottom_2_desk.svg',
    mobileSrc: '/images/banners/final_guide-tpt_banner_bottom_2_mobile.svg',
    alt: 'TPT 가이드라인 - 분석',
    link: 'https://www.tradingpt.kr/menu/analysis',
  },
  {
    desktopSrc: '/images/banners/final_guide-tpt_banner_bottom_3_desk.svg',
    mobileSrc: '/images/banners/final_guide-tpt_banner_bottom_3_mobile.svg',
    alt: 'TPT 가이드라인 - 피드백 목록',
    link: 'https://www.tradingpt.kr/menu/feedback-list',
  },
  {
    desktopSrc: '/images/banners/final_guide-tpt_banner_bottom_4_desk.svg',
    mobileSrc: '/images/banners/final_guide-tpt_banner_bottom_4_mobile.svg',
    alt: 'TPT 가이드라인 - 인사이트',
    link: 'https://www.tradingpt.kr/menu/insight',
  },
];

/**
 * TPT 가이드라인 페이지
 * TPT 서비스를 120% 활용하는 방법을 안내
 */
export default function TPTGuidePage() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 860;
  const [topImageLoaded, setTopImageLoaded] = useState(false);
  const [bottomImagesLoaded, setBottomImagesLoaded] = useState<boolean[]>([false, false, false, false]);

  const handleBottomImageLoad = (index: number) => {
    setBottomImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: isMobile ? '#FCFDFF' : '#FFFFFF' }}>
      <main className="pb-16">
        <div className="w-full flex flex-col">
          {/* 상단 배너 이미지 */}
          <div className="relative w-full">
            {!topImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 min-h-[200px]">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  <p className="text-gray-600 font-medium">로딩 중...</p>
                </div>
              </div>
            )}
            <Image
              src={isMobile ? '/images/banners/final_guide-tpt_banner_top_mobile.svg' : '/images/banners/final_guide-tpt_banner_top_desk.svg'}
              alt="TPT 이용 가이드라인 상단"
              width={1920}
              height={1080}
              className={`w-full h-auto object-contain transition-opacity duration-300 ${topImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setTopImageLoaded(true)}
              priority
            />
          </div>

          {/* 하단 배너 이미지들 - 버튼 포함 */}
          <div className={`flex flex-col gap-10 ${isMobile ? 'w-full' : 'w-1/2 mx-auto'}`}>
            {BOTTOM_BANNERS.map((banner, index) => (
              <div key={index} className={`w-full ${isMobile ? 'flex flex-col items-center' : 'relative'}`}>
                <div className="relative w-full">
                  {!bottomImagesLoaded[index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 min-h-[200px]">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        <p className="text-gray-600 font-medium">로딩 중...</p>
                      </div>
                    </div>
                  )}
                  <Image
                    src={isMobile ? banner.mobileSrc : banner.desktopSrc}
                    alt={banner.alt}
                    width={1920}
                    height={1080}
                    className={`w-full h-auto object-contain transition-opacity duration-300 ${bottomImagesLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => handleBottomImageLoad(index)}
                  />
                  {/* 데스크톱: 이미지 위에 버튼 */}
                  {!isMobile && (
                    <Link
                      href={banner.link}
                      className="absolute left-1/2 -translate-x-1/2 bottom-10 z-10 px-6 py-3 text-base text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#0F3570' }}
                    >
                      구경하러 가기
                    </Link>
                  )}
                </div>
                {/* 모바일: 이미지 아래에 버튼 */}
                {isMobile && (
                  <Link
                    href={banner.link}
                    className="mt-3 px-4 py-2 text-sm text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#0F3570' }}
                  >
                    구경하러 가기
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
