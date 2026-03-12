"use client";

import Link from "next/link";

type GuideCard = {
  title: string;
  subtitle: string;
  href: string;
};

const guides: GuideCard[] = [
  {
    title: "TPT 가이드라인",
    subtitle: "TPT 120% 활용 방법",
    href: "/menu/guide/tpt",
  },
  {
    title: "TPT 후기",
    subtitle: "올바른 트레이딩, 장기적 성장",
    href: "/menu/community/review",
  },
  {
    title: "토큰 제도 가이드라인",
    subtitle: "무료 피드백 요청 방법",
    href: "/menu/guide/token",
  },
  {
    title: "ETCC 회원권 알아보기",
    subtitle: "트레이딩에 진심이라면?",
    href: "/menu/etcc",
  },
];

export function GuideSection() {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {guides.map((guide) => (
          <Link
            key={guide.title}
            href={guide.href}
            className="bg-white rounded-lg shadow-sm p-4 md:p-6 hover:shadow-md hover:scale-105 transition-all duration-300 group"
          >
            <div className="flex flex-col items-start">
              <div className="flex-1 mb-2">
                <h3 className="text-sm md:text-lg lg:text-xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-blue-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">{guide.subtitle}</p>
              </div>

              {/* TPT 로고 */}
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs md:text-sm mt-auto">
                TPT
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
