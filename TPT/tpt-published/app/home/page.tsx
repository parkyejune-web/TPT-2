"use client";

import { useState } from "react";
import { HeroSection } from "../../Features/home/HeroSection";
import { GuideSection } from "../../Features/home/GuideSection";
import { TraderJournalSection } from "../../Features/home/TraderJournalSection";
import { BestJournalSection } from "../../Features/home/BestJournalSection";
import { InsightSection } from "../../Features/home/InsightSection";
import { MemberReviewSection } from "../../Features/home/MemberReviewSection";
import { useHomeColumns } from "../../Features/home/hooks/useHomeColumns";

export default function HomePage() {
  // 칼럼 데이터 한 번만 조회 후 필터링하여 각 섹션에 전달
  const { billionJournalColumns, growthDiaryColumns, loading, error } = useHomeColumns();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <main className="pb-32 px-4 max-w-7xl mx-auto">
        {/* 캔들 비디오 + HeroSection 영역 */}
        <section className="w-full mb-10">
          {/* 모바일: 세로 배치, md 이상: 겹침 배치 */}
          <div className="flex flex-col gap-2 md:gap-0 md:relative">
            {/* HeroSection - 모바일에서는 위에, md 이상에서는 비디오 위에 겹침 */}
            <div className="md:absolute md:top-0 md:left-0 md:z-10 md:p-8">
              <HeroSection />
            </div>
            {/* 비디오 스켈레톤 */}
            {!isVideoLoaded && (
              <div className="w-full aspect-video rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                  <span className="text-gray-400 text-sm">로딩 중...</span>
                </div>
              </div>
            )}
            {/* 비디오 배경 */}
            <video
              src="/home_candle_video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className={`w-full h-auto object-cover rounded-lg transition-opacity duration-300 ${isVideoLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
              onLoadedData={() => setIsVideoLoaded(true)}
            />
          </div>
        </section>

        <GuideSection />
        <TraderJournalSection />
        <BestJournalSection />
        <InsightSection columns={billionJournalColumns} loading={loading} error={error} />
        <MemberReviewSection columns={growthDiaryColumns} loading={loading} error={error} />
      </main>
    </div>
  );
}
