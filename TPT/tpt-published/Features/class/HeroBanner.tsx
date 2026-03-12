'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useWindowWidth } from '../../Shared/hooks/useWindowWidth';

interface HeroBannerProps {
  imageSrc: string;
  imageSrcMobile?: string;
  title: string;
  description: string;
  className?: string;
  showOverlay?: boolean;
}

/**
 * 프리미엄 히어로 배너
 * 반응형 이미지 지원 (모바일/데스크톱)
 */
export default function HeroBanner({
  imageSrc,
  imageSrcMobile,
  title,
  description,
  className = '',
  showOverlay = true
}: HeroBannerProps) {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 860;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 모바일 이미지가 제공되면 사용, 아니면 기본 이미지 사용
  const currentImageSrc = isMobile && imageSrcMobile ? imageSrcMobile : imageSrc;

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* 배경 이미지 - 반응형 */}
      <div className="relative w-full" style={{ minHeight: isMobile ? '200px' : '400px' }}>
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="text-gray-600 font-medium">로딩 중...</p>
            </div>
          </div>
        )}
        <Image
          src={currentImageSrc}
          alt={title}
          width={1920}
          height={1080}
          className={`w-full h-auto object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
          priority
        />

        {/* 그라데이션 오버레이 - 선택적으로 표시 */}
        {showOverlay && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />

            {/* 텍스트 콘텐츠 - 중앙 정렬 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 md:mb-5 text-center tracking-tight leading-[1.1]"
                  style={{
                    textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    letterSpacing: '-0.02em'
                  }}>
                {title}
              </h1>
              <p className="text-sm md:text-lg lg:text-xl xl:text-2xl text-white/90 text-center max-w-3xl leading-relaxed font-light"
                 style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                {description.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < description.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
