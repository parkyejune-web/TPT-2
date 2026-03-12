"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-transparent mb-2 md:mb-5">
      {/* 메인 문구 */}
      <h1 className="text-base sm:text-xl md:text-3xl font-bold text-gray-900 mt-2 md:mt-5">
        TPT, 트레이딩의 본질을 담았습니다.
      </h1>

      <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-2 md:mt-5 mb-2 md:mb-5">
        올바른 트레이딩, 장기적 성장.
      </p>

      {/* 우측 링크 */}
      <Link
        href="/menu/about"
        className="text-xs sm:text-sm md:text-base text-gray-500 rounded-md border-gray-300 border-1 px-1.5 py-0.5 md:px-2 md:py-1"
      >
        About TPT →
      </Link>
    </section>
  );
}
