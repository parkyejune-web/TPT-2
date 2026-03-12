"use client";

import Image from "next/image";

export function MonthlyFeedbackSection() {
  return (
    <section className="min-h-screen flex items-center bg-white px-4 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        {/* 상단 텍스트 */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-2">
            4주간 누적된 데이터는 자동으로 월간 PnL, 평균 승률 및 손익비를 종합 분석됩니다.
          </p>
          <p className="text-base md:text-lg text-gray-600">
            번거로운 엑셀 정리, 수동 계산은 더 이상 필요 없습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* 좌측 - 월간 리포트 이미지 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 max-w-md mx-auto lg:max-w-none">
            <Image
              src="/images/landing_img_6.png"
              alt="월별 트레이딩 피드백 UI"
              width={600}
              height={1000}
              className="w-full h-auto"
            />
          </div>

          {/* 우측 - 설명 영역 */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              월간 결과를 한눈에 확인하세요!
            </h3>
            <p className="text-base md:text-lg text-gray-700">
              철저한 데이터를 기반으로 내가 잡는 패턴과 못하는 패턴을 정확히 구분하면서
              현명한 전략을 세워야 합니다.
            </p>

            <div className="h-px bg-gray-300" />

            <p className="text-base md:text-lg text-gray-700">
              담당 트레이너로부터 다음 달 타깃별 목표 손익비, 승률이 담긴
              월간 트레이딩 로드맵을 전달 받으세요.
            </p>

            <p className="text-lg md:text-xl font-semibold text-gray-900">
              올바른 지향점은 비효율 매매를 방지해줄 것입니다.
            </p>
          </div>
        </div>

        {/* 하단 결론 블록 */}
        <div className="text-center mt-16 md:mt-20 space-y-3 md:space-y-4">
          <p className="text-lg md:text-xl font-semibold text-gray-900">간편함 속에 담긴 정밀함</p>
          <p className="text-base md:text-lg text-gray-700">복잡한 과정 없이도</p>
          <p className="text-base md:text-lg text-gray-700">'나의 매매 흐름', '수익구조의 약점'</p>
          <p className="text-lg md:text-xl font-semibold text-gray-900">한 번에 쉽게 파악하세요.</p>
        </div>
      </div>
    </section>
  );
}
