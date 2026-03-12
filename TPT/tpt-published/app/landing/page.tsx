"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../Shared/store/authStore";
import { useWindowWidth } from "../../Shared/hooks/useWindowWidth";
import { IntroSection } from "../../Features/landing/IntroSection";
import TopBannerSection from "../../Features/landing/TopBannerSection";
import dynamic from "next/dynamic";

// Lottie를 동적으로 불러오기 (SSR 비활성화)
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 860;
  const [isMainBannerLoaded, setIsMainBannerLoaded] = useState(false);
  const [splashAnimation, setSplashAnimation] = useState<any>(null);

  // 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, router]);

  // Lottie 애니메이션 데이터 로드
  useEffect(() => {
    fetch('/splash_animation.json')
      .then(res => res.json())
      .then(data => setSplashAnimation(data))
      .catch(err => console.error('Failed to load splash animation:', err));
  }, []);

  // 로그인된 사용자는 리다이렉트되므로 렌더링하지 않음
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="pb-24">
        <IntroSection />

        {/* Top Banner + Splash Animation (Column 배치) */}
        <div className="w-full flex flex-col items-center gap-8 mb-8">
          {/* Top Banner */}
          <div className="w-full flex justify-center">
            <div className="flex justify-center">
              <TopBannerSection isMobile={isMobile} />
            </div>
          </div>

          {/* Splash Animation */}
          {splashAnimation && (
            <div className="w-full flex justify-center">
              <div className="w-[20%]">
                <Lottie animationData={splashAnimation} loop={true} />
              </div>
            </div>
          )}
        </div>

        {/* Main Banner (반응형) */}
        <div className="w-full flex justify-center">
          <div className="relative w-[80%]" style={{ minHeight: isMobile ? '400px' : '600px' }}>
            {!isMainBannerLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                  <p className="text-gray-500 text-sm">로딩 중...</p>
                </div>
              </div>
            )}
            <Image
              src={isMobile ? '/images/banners/final_home_banner_mobile_3_2.svg' : '/images/banners/final_home_banner_desk_3.svg'}
              alt="banner"
              width={1000}
              height={800}
              className={`w-full h-auto object-contain transition-opacity duration-300 ${isMainBannerLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsMainBannerLoaded(true)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
