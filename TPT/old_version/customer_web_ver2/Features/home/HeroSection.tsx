"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-white rounded-lg shadow-sm p-8 md:p-12 mb-8">
      <div className="flex items-center justify-between">
        {/* 좌측 아이콘 */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded flex items-end justify-center gap-1 p-2">
            {/* 첫 번째 캔들바 */}
            <div
              className="w-2 bg-white rounded-sm animate-candlestick-1"
              style={{
                animation: 'candlestick1 2s ease-in-out infinite',
              }}
            />
            {/* 두 번째 캔들바 */}
            <div
              className="w-2 bg-white rounded-sm animate-candlestick-2"
              style={{
                animation: 'candlestick2 2.3s ease-in-out infinite',
              }}
            />
            {/* 세 번째 캔들바 */}
            <div
              className="w-2 bg-white rounded-sm animate-candlestick-3"
              style={{
                animation: 'candlestick3 1.8s ease-in-out infinite',
              }}
            />
          </div>

          <style jsx>{`
            @keyframes candlestick1 {
              0%, 100% { height: 20px; }
              50% { height: 32px; }
            }
            @keyframes candlestick2 {
              0%, 100% { height: 28px; }
              50% { height: 16px; }
            }
            @keyframes candlestick3 {
              0%, 100% { height: 24px; }
              50% { height: 36px; }
            }
          `}</style>

          {/* 메인 문구 */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            TPT, 트레이딩의 본질을 담다
          </h1>
        </div>

        {/* 우측 링크 */}
        <Link
          href="/menu/about"
          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          About TPT →
        </Link>
      </div>
    </section>
  );
}
