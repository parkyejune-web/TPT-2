"use client";

import Image from "next/image";

export function AutoJournalSection() {
  return (
    <section className="min-h-screen flex items-center bg-white px-4 py-12 md:py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* 좌측 영역 - 기능 시각화 */}
        <div className="space-y-6 md:space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
              복잡한 계산은 잊으세요.
            </h2>
            <p className="text-lg md:text-xl text-gray-700">
              이제 단 한 번의 매매일지 작성으로 모든 것이 자동으로 완성됩니다.
            </p>
          </div>

          {/* 이미지 박스 (실제 UI 캡처 이미지 예시) */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 max-w-md mx-auto lg:max-w-none">
            <Image
              src="/images/landing_img_4.png"
              alt="매매일지 작성 UI"
              width={600}
              height={800}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* 우측 영역 - 사용자 인식 전환 */}
        <div className="space-y-6 md:space-y-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            회원님이 해야 할 일은 단 한 가지
          </h3>
          <p className="text-base md:text-lg text-gray-600">
            하루 한 번, 주어진 양식에 맞춰 매매일지를 작성하는 것뿐입니다.
          </p>

          <div className="h-px bg-gray-300 my-6 md:my-8" />

          <p className="text-base md:text-lg text-gray-700">
            귀찮아서 미뤄왔던 매매일지 작성 이제 단 1분이면 해결할 수 있어요.
          </p>

          <p className="text-lg md:text-xl font-semibold text-gray-900 mt-4 md:mt-6">
            혼자 고민하면서 먼 길 돌아가지 마세요.
          </p>

          <p className="text-base md:text-lg text-gray-700">
            이미 먼저 잃어보고 깨달은 경험자에게 현명한 조언을 구할 수 있으니까요.
          </p>
        </div>
      </div>
    </section>
  );
}
