"use client";

import { useRouter } from "next/navigation";

type JournalCard = {
  id: number;
  title: string;
  description: string;
  profit: number;
  chartImage?: string;
};

// 임시 데이터
const journalData: JournalCard[] = [
  {
    id: 1,
    title: "엘론코인 알아보고 접근하자",
    description: "도지코인의 급등 원인과 향후 전망 분석",
    profit: 12.5,
  },
  {
    id: 2,
    title: "BTC 상승 추세 분석",
    description: "비트코인 68,000달러 돌파 가능성",
    profit: 8.3,
  },
  {
    id: 3,
    title: "ETH 롱 전략 리뷰",
    description: "이더리움 지지선 확인 후 진입",
    profit: -3.2,
  },
  {
    id: 4,
    title: "알트코인 스윙 전략",
    description: "중장기 관점의 포트폴리오 구성",
    profit: 15.7,
  },
  {
    id: 5,
    title: "숏 포지션 타이밍",
    description: "과매수 구간에서의 숏 진입 사례",
    profit: 6.1,
  },
  {
    id: 6,
    title: "변동성 돌파 전략",
    description: "고변동성 구간에서의 진입 타이밍",
    profit: 11.3,
  },
];

export function TraderJournalSection() {
  const router = useRouter();

  const handleCardClick = (id: number) => {
    router.push(`/menu/columns/${id}`);
  };

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">TPT 트레이더 매매일지</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {journalData.map((journal) => (
          <div
            key={journal.id}
            onClick={() => handleCardClick(journal.id)}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
          >
            {/* 차트 이미지 영역 */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-48 flex items-center justify-center">
              <svg className="w-32 h-32 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>

            {/* 내용 */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2">{journal.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{journal.description}</p>
              <div
                className={`text-lg font-bold ${
                  journal.profit > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {journal.profit > 0 ? "+" : ""}
                {journal.profit}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
