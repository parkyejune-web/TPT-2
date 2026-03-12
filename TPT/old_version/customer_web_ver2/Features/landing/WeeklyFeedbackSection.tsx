"use client";

import Image from "next/image";

export function WeeklyFeedbackSection() {
  return (
    <section className="min-h-screen flex items-center bg-gray-50 px-4 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        {/* 상단 텍스트 */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-2">
            그 한 번의 기록이 쌓여 자동으로 주간 분석 피드백으로 변환됩니다.
          </p>
          <p className="text-base md:text-lg text-gray-600">
            번거로운 엑셀 정리, 수동 계산은 더 이상 필요 없습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* 좌측 - 이미지 영역 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 max-w-md mx-auto lg:max-w-none">
            <Image
              src="/images/landing_img_5.png"
              alt="주간 트레이딩 피드백 UI"
              width={600}
              height={900}
              className="w-full h-auto"
            />
          </div>

          {/* 우측 - 설명 영역 */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              주간 결과를 한눈에 확인하세요!
            </h3>
            <p className="text-base md:text-lg text-gray-700">
              매일 쌓인 데이터를 자동 시스템으로 주간 PnL, 승률, 손익비 모두 정리해드립니다.
            </p>

            <div className="h-px bg-gray-300" />

            <p className="text-base md:text-lg text-gray-700">
              손실 본 매매와 수익 본 매매, 나에게 최적화된 개인 맞춤형 피드백을 받고
              정확한 개선 방향을 바로 잡아가세요.
            </p>

            <p className="text-lg md:text-xl font-semibold text-gray-900">
              더 이상 '감'으로 매매하면 안됩니다.
            </p>

            <div className="h-px bg-gray-300" />

            <p className="text-base md:text-lg text-gray-700">
              매매횟수가 늘어날수록 기술적 분석뿐만 아니라 심리적 요인에 대한 부분도 사고해야 합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
