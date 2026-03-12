"use client";

import { useRouter } from "next/navigation";

type BestJournal = {
  id: number;
  title: string;
  description: string;
  profit: number;
  badge?: string;
};

const bestJournals: BestJournal[] = [
  {
    id: 1,
    title: "완벽한 추세 매매 전략",
    description: "3개월간 안정적인 수익 실현",
    profit: 45.2,
    badge: "BEST",
  },
  {
    id: 2,
    title: "손절의 중요성 실전 사례",
    description: "손실 최소화로 자산 보호",
    profit: 28.7,
  },
  {
    id: 3,
    title: "패턴 인식 마스터 과정",
    description: "차트 패턴을 통한 고승률 매매",
    profit: 32.1,
  },
  {
    id: 4,
    title: "리스크 관리의 정석",
    description: "1R 리스크로 3R 수익 달성",
    profit: 21.5,
  },
  {
    id: 5,
    title: "심리 관리 노하우",
    description: "감정을 배제한 객관적 매매",
    profit: 38.9,
  },
  {
    id: 6,
    title: "자금 관리의 핵심",
    description: "분산 투자로 안정성 확보",
    profit: 26.3,
  },
];

export function BestJournalSection() {
  const router = useRouter();

  const handleCardClick = (id: number) => {
    router.push(`/menu/columns/${id}`);
  };

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
          TPT BEST 매매일지
          <span className="text-xs md:text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            BEST
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bestJournals.map((journal) => (
          <div
            key={journal.id}
            onClick={() => handleCardClick(journal.id)}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border-2 border-yellow-200 cursor-pointer"
          >
            {/* 차트 이미지 영역 */}
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 h-48 flex items-center justify-center relative">
              {journal.badge && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {journal.badge}
                </div>
              )}
              <svg className="w-32 h-32 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>

            {/* 내용 */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2">{journal.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{journal.description}</p>
              <div className="text-lg font-bold text-blue-600">
                +{journal.profit}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
