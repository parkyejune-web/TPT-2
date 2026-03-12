"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import { useAuthStore } from "../Shared/store/authStore";

export function Splash() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    // Lottie 애니메이션 JSON 로드
    fetch("/splash_animation.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load splash animation:", err));
  }, []);

  useEffect(() => {
    // 2.5초 후 페이드 아웃 시작
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2500);

    // 3초 후 (페이드 아웃 완료 후) 리다이렉트
    const redirectTimer = setTimeout(() => {
      setIsVisible(false);
      // 로그인된 사용자는 홈으로, 비로그인 사용자는 랜딩 페이지로
      router.push(isAuthenticated ? "/home" : "/landing");
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [router, isAuthenticated]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-white flex items-center justify-center z-50 transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-2/5 max-w-md">
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop={false}
            autoplay={true}
          />
        ) : (
          <div className="animate-pulse w-full h-48 bg-gray-100 rounded" />
        )}
      </div>
    </div>
  );
}
