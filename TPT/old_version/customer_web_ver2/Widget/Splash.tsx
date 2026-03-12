"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Splash() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 3초 후 스플래쉬 화면 숨기고 랜딩 페이지로 이동
    const timer = setTimeout(() => {
      setIsVisible(false);
      router.push("/landing");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="w-2/5 animate-bounce-subtle animate-diagonal-shine">
        <Image
          src="/images/final_logo_blue.png"
          alt="TPT Logo"
          width={800}
          height={800}
          priority
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}
