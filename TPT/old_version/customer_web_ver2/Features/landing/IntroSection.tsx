"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import CustomButton from "@/Shared/ui/CustomButton";

export function IntroSection() {
  const router = useRouter();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 md:py-20">
      {/* 상단 인트로 블록 */}
      <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
        <p className="text-base md:text-lg text-gray-600 mb-3 md:mb-4">올바른 트레이딩</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
          정답은 결국 <span className="text-red-600">나에게</span> 있습니다.
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mt-4 md:mt-6">
          국내 유일 맞춤형 트레이딩 교육 서비스
        </p>
      </div>

      {/* 스크롤 유도 아이콘 */}
      <div className="mb-12 md:mb-16 animate-bounce">
        <svg
          className="w-6 h-6 md:w-8 md:h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      {/* 시각 자료 블록 */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-8 max-w-6xl mx-auto mb-16 md:mb-20">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-md md:rounded-lg overflow-hidden hover:scale-105 transition-transform shadow-sm md:shadow-md"
          >
            <Image
              src={`/images/landing_img_${i}.png`}
              alt={`트레이딩 예시 이미지 ${i}`}
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* 홈으로 버튼 */}
      <div className="flex items-center justify-center py-5 w-full px-4">
        <CustomButton
          variant="prettyFull"
          className="w-[90%] mb-20 px-5"
          onClick={() => router.push("/home")}
        >
          <div className="flex items-center justify-between w-full">
            <span>홈으로</span>
            <ArrowRight size={20} />
          </div>
        </CustomButton>
      </div>

      {/* 문제 인식 블록 */}
      <div className="max-w-4xl mx-auto mb-12 md:mb-16 px-4 md:px-8">
        <div className="border-l-4 border-black pl-4 md:pl-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
            여러분들도 이제는 아실겁니다.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-2">
            고수익 리딩방, 매매법 강의, 시그널 보조지표...
          </p>
          <p className="text-base md:text-lg text-gray-700">
            본질이 빠진 채로는 <span className="text-red-600 font-semibold">진짜 돈을 버는 방법</span>이 될 수 없다는 걸요.
          </p>
        </div>

        {/* 통통 튀는 구 아이콘 애니메이션 */}
        <div className="flex justify-center mt-6 md:mt-8">
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping" />
            <div className="relative rounded-full bg-blue-600 w-12 h-12 md:w-16 md:h-16 animate-bounce-subtle" />
          </div>
        </div>
      </div>

      {/* 단계별 인사이트 블록 */}
      <div className="max-w-3xl mx-auto mb-12 md:mb-16 space-y-4 md:space-y-6">
        {[
          { num: "01", text: "그렇다면 트레이딩으로 진짜 돈을 벌 수 있는 유일한 방법은 뭘까요?", highlight: false },
          { num: "02", text: "정답은, 매매일지를 통한 자신의 성장입니다.", highlight: true },
          { num: "03", text: "사람들은 감정으로 트레이딩을 합니다. 손실을 두려워하고 '감'에 의존하죠.", highlight: false },
          { num: "04", text: "그래서 우리는 매매일지를 쓰려고 하지만 대부분 귀찮아서 일주일을 넘기지 못합니다.", highlight: false },
        ].map((item) => (
          <div key={item.num} className="flex gap-3 md:gap-6 items-start border-b border-gray-200 pb-3 md:pb-4">
            <span className="text-xl md:text-2xl font-bold text-gray-400 flex-shrink-0">{item.num}</span>
            <p className={`text-sm md:text-base lg:text-lg ${item.highlight ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* 결론/전환 블록 */}
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-1 h-12 md:h-16 bg-gray-300 mx-auto mb-6 md:mb-8" />
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          하지만, 이제 걱정하지 마세요!
        </h3>
        <p className="text-lg md:text-xl text-gray-700">
          TPT가 그 문제를 완벽하게 해결해드리겠습니다.
        </p>
      </div>
    </section>
  );
}
