"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type GuideCard = {
  title: string;
  subtitle: string;
  href: string;
  iconImage: string;
  bgImage?: string;
};

type Review = {
  id: number;
  author: string;
  content: string;
};

const guides: GuideCard[] = [
  {
    title: "TPT 가이드라인",
    subtitle: "TPT 120% 활용 방법",
    href: "/menu/guide/tpt",
    iconImage: "/images/home_grid_button_icon_1.png",
    bgImage: "/images/home_grid_button_img_1.jpg",
  },
  {
    title: "TPT 후기",
    subtitle: "",
    href: "/menu/community/review",
    iconImage: "/images/home_grid_button_icon_2.png",
  },
  {
    title: "토큰 제도 가이드라인",
    subtitle: "무료 피드백 요청 방법",
    href: "/menu/guide/token",
    iconImage: "/images/home_grid_button_icon_3.png",
    bgImage: "/images/home_grid_button_img_1.jpg",
  },
  {
    title: "TPT PLAN",
    subtitle: "트레이딩에 진심이라면?",
    // href: "/menu/tpt-plan",
    href: "",
    iconImage: "/images/home_grid_button_icon_4.png",
  },
];

// Mock 후기 데이터
const mockReviews: Review[] = [
  {
    id: 1,
    author: "김트레이더",
    content: "매매일지를 꾸준히 작성하니 손실이 줄어들었어요!",
  },
  {
    id: 2,
    author: "박투자",
    content: "전담 트레이너의 피드백이 정말 도움됩니다.",
  },
  {
    id: 3,
    author: "이성장",
    content: "감정적인 매매에서 벗어날 수 있었습니다.",
  },
  {
    id: 4,
    author: "최수익",
    content: "데이터 기반 트레이딩으로 안정적인 수익!",
  },
  {
    id: 5,
    author: "정시스템",
    content: "시스템 트레이딩의 중요성을 깨달았어요.",
  },
];

export function GuideSection() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % mockReviews.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mb-12 w-full">
      {/* 모바일: 2x2 정사각형 그리드, 데스크톱: 기존 2:1 비율 레이아웃 */}
      <div className="w-full flex flex-col gap-3 md:gap-6">
        {/* 모바일에서는 2x2 그리드, 데스크톱에서는 숨김 */}
        <div className="grid grid-cols-2 gap-3 md:hidden auto-rows-fr">
          {/* TPT 가이드라인 */}
          <Link
            href={guides[0].href}
            className="aspect-square rounded-lg shadow-sm p-4 hover:shadow-md hover:scale-105 transition-all duration-300 group relative overflow-hidden"
            style={{
              backgroundImage: `url(${guides[0].bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-white/40 group-hover:bg-white/30 transition-colors" />
            <div className="relative flex flex-col h-full">
              <div className="flex justify-end mb-2">
                <Image
                  src={guides[0].iconImage}
                  alt="icon"
                  width={32}
                  height={32}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col justify-end">
                <h3 className="text-sm font-bold text-black mb-1">
                  {guides[0].title}
                </h3>
                <p className="text-xs text-black">{guides[0].subtitle}</p>
              </div>
            </div>
          </Link>

          {/* 토큰 제도 가이드라인 */}
          <Link
            href={guides[2].href}
            className="aspect-square rounded-lg shadow-sm p-4 hover:shadow-md hover:scale-105 transition-all duration-300 group relative overflow-hidden"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${guides[2].bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: 'scaleX(-1)',
              }}
            />
            <div className="absolute inset-0 bg-white/40 group-hover:bg-white/30 transition-colors" />
            <div className="relative flex flex-col h-full">
              <div className="flex justify-end mb-2">
                <Image
                  src={guides[2].iconImage}
                  alt="icon"
                  width={32}
                  height={32}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col justify-end">
                <h3 className="text-sm font-bold text-black mb-1">
                  {guides[2].title}
                </h3>
                <p className="text-xs text-black">{guides[2].subtitle}</p>
              </div>
            </div>
          </Link>

          {/* TPT 후기 */}
          <Link
            href={guides[1].href}
            className="aspect-square bg-[#FCFCFC] rounded-lg shadow-sm p-4 hover:shadow-md hover:scale-105 transition-all duration-300 group relative overflow-hidden min-h-0"
          >
            <div className="flex flex-col h-full relative z-10">
              <div className="flex justify-end mb-2">
                <Image
                  src={guides[1].iconImage}
                  alt="icon"
                  width={32}
                  height={32}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-black mb-1">
                    {guides[1].title}
                  </h3>
                  {guides[1].subtitle && <p className="text-xs text-black">{guides[1].subtitle}</p>}
                </div>

                {/* 슬라이딩 후기 */}
                <div className="relative h-12 overflow-hidden mt-2">
                  <div
                    className="absolute inset-0 transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateY(-${currentReviewIndex * 100}%)`,
                    }}
                  >
                    {mockReviews.map((review) => (
                      <div
                        key={review.id}
                        className="h-12 flex flex-col justify-center px-1"
                      >
                        <p className="text-[10px] text-gray-600 font-medium line-clamp-2 leading-tight">
                          "{review.content}"
                        </p>
                        <p className="text-[9px] text-gray-400 mt-0.5 truncate">
                          - {review.author}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* TPT PLAN */}
          <Link
            href={guides[3].href}
            className="aspect-square bg-[#FCFCFC] rounded-lg shadow-sm p-4 hover:shadow-md hover:scale-105 transition-all duration-300 group overflow-hidden min-h-0"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-end mb-2">
                <Image
                  src={guides[3].iconImage}
                  alt="icon"
                  width={32}
                  height={32}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col justify-end">
                <h3 className="text-sm font-bold text-black mb-1">
                  {guides[3].title}
                </h3>
                <p className="text-xs text-black">{guides[3].subtitle}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* 데스크톱: 기존 레이아웃 (상단:하단 = 4:3 비율) */}
        <div className="hidden md:flex md:flex-col md:gap-6">
          {/* 첫 번째 행: 2:1 비율, 높이 4 */}
          <div className="w-full grid grid-cols-3 gap-6" style={{ height: '200px' }}>
            {/* TPT 가이드라인 (2칸) */}
            <Link
              href={guides[0].href}
              className="col-span-2 rounded-lg shadow-sm p-6 hover:shadow-md hover:scale-105 transition-all duration-300 group relative overflow-hidden h-full"
              style={{
                backgroundImage: `url(${guides[0].bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-white/40 group-hover:bg-white/30 transition-colors" />
              <div className="relative flex flex-col h-full">
                <div className="flex justify-end mb-2">
                  <Image
                    src={guides[0].iconImage}
                    alt="icon"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <h3 className="text-lg lg:text-xl font-bold text-black mb-2">
                    {guides[0].title}
                  </h3>
                  <p className="text-sm lg:text-base text-black">{guides[0].subtitle}</p>
                </div>
              </div>
            </Link>

            {/* TPT 후기 (1칸) */}
            <Link
              href={guides[1].href}
              className="col-span-1 bg-[#FCFCFC] rounded-lg shadow-sm p-6 hover:shadow-md hover:scale-105 transition-all duration-300 group relative overflow-hidden h-full"
            >
              <div className="flex flex-col h-full relative z-10">
                <div className="flex justify-end mb-2">
                  <Image
                    src={guides[1].iconImage}
                    alt="icon"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-black mb-2">
                      {guides[1].title}
                    </h3>
                    {guides[1].subtitle && <p className="text-sm lg:text-base text-black">{guides[1].subtitle}</p>}
                  </div>

                  {/* 슬라이딩 후기 */}
                  <div className="relative h-16 overflow-hidden mt-2">
                    <div
                      className="absolute inset-0 transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateY(-${currentReviewIndex * 100}%)`,
                      }}
                    >
                      {mockReviews.map((review) => (
                        <div
                          key={review.id}
                          className="h-16 flex flex-col justify-center px-1"
                        >
                          <p className="text-xs text-gray-600 font-medium line-clamp-2 leading-tight">
                            "{review.content}"
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1 truncate">
                            - {review.author}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* 두 번째 행: 2:1 비율, 높이 3 */}
          <div className="w-full grid grid-cols-3 gap-6" style={{ height: '150px' }}>
            {/* 토큰 제도 가이드라인 (2칸) */}
            <Link
              href={guides[2].href}
              className="col-span-2 rounded-lg shadow-sm p-6 hover:shadow-md hover:scale-105 transition-all duration-300 group relative overflow-hidden h-full"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${guides[2].bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: 'scaleX(-1)',
                }}
              />
              <div className="absolute inset-0 bg-white/40 group-hover:bg-white/30 transition-colors" />
              <div className="relative flex flex-col h-full">
                <div className="flex justify-end mb-2">
                  <Image
                    src={guides[2].iconImage}
                    alt="icon"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <h3 className="text-lg lg:text-xl font-bold text-black mb-2">
                    {guides[2].title}
                  </h3>
                  <p className="text-sm lg:text-base text-black">{guides[2].subtitle}</p>
                </div>
              </div>
            </Link>

            {/* TPT PLAN (1칸) */}
            <Link
              href={guides[3].href}
              className="col-span-1 bg-[#FCFCFC] rounded-lg shadow-sm p-6 hover:shadow-md hover:scale-105 transition-all duration-300 group h-full"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-end mb-2">
                  <Image
                    src={guides[3].iconImage}
                    alt="icon"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <h3 className="text-lg lg:text-xl font-bold text-black mb-2">
                    {guides[3].title}
                  </h3>
                  <p className="text-sm lg:text-base text-black">{guides[3].subtitle}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
