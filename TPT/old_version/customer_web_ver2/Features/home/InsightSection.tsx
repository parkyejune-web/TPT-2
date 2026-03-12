"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Insight = {
  id: number;
  title: string;
  image?: string;
};

const insights: Insight[] = [
  {
    id: 1,
    title: "현 시점, 금 투자 핵심 조언",
  },
  {
    id: 2,
    title: "비트코인 사이클, 정부 역할 알아보기",
  },
  {
    id: 3,
    title: "트레이더 실전 심리와 구체적 방법",
  },
  {
    id: 4,
    title: "트럼프가 계획하는 25년 연말 시장 흐름",
  },
];

export function InsightSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < insights.length - 4) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCardClick = (id: number) => {
    router.push(`/menu/columns/${id}`);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">10억 인사이트</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= insights.length - 4}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight) => (
          <div
            key={insight.id}
            onClick={() => handleCardClick(insight.id)}
            className="bg-white rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all overflow-hidden cursor-pointer"
          >
            {/* 이미지 영역 */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 h-48 flex items-center justify-center">
              <svg className="w-20 h-20 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>

            {/* 제목 */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                {insight.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
