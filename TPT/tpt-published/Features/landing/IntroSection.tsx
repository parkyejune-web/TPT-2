"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import CustomButton from "@/Shared/ui/CustomButton";
import Lottie from "lottie-react";
import scrollIconAnimation from "@/public/landing_scroll_icon.json";

export function IntroSection() {
  const router = useRouter();

  const handleSignupClick = () => {
    window.location.href = "/signup";
  };

  return (
    <div className="flex flex-col">
      <style jsx global>{`
        @keyframes sparkle {
          0%, 100% {
            filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
          50% {
            filter: brightness(1.3) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
          }
        }
      `}</style>

      <section className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 md:py-20">
      {/* 상단 인트로 블록 */}
      <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
        <p className="text-xl md:text-3xl font-extrabold md:font-bold text-[#323A4B]">올바른 트레이딩</p>

        {/* Lottie 애니메이션 */}
        <div className="flex justify-center md:my-8">
          <Lottie
            animationData={scrollIconAnimation}
            loop={true}
            autoplay={true}
            style={{ width: 200, height: 100 }}
          />
        </div>

        <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold md:font-bold text-[#323A4B] mb-3 md:mb-4 leading-tight">
          정답은 결국
          <br />
          나에게 있습니다.
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mt-4 md:mt-6">
          모든 매매를 기록하고 관리하세요.
        </p>
      </div>

      {/* 스크롤 유도 아이콘 */}
      {/* <div className="mb-12 md:mb-16 animate-bounce">
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
      </div> */}

      {/* 시각 자료 블록 */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-8 max-w-6xl mx-auto mb-16 md:mb-20">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative group"
          >
            <div className="bg-white rounded-md md:rounded-lg overflow-hidden h-[400px] md:h-[500px] lg:h-[555px]">
              <Image
                src={`/images/landing_img_2_${i}.svg`}
                alt={`트레이딩 예시 이미지 ${i}`}
                width={159}
                height={555}
                className="w-full h-full object-contain"
              />
            </div>
            {/* 호버 시 확대된 이미지 */}
            <div className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-50 group-hover:scale-[1.5] group-hover:-translate-y-[20%]">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden border-4 border-white">
                <Image
                  src={`/images/landing_img_2_${i}.svg`}
                  alt={`트레이딩 예시 이미지 ${i}`}
                  width={159}
                  height={555}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 문제 인식 블록 */}
      {/* <div className="max-w-4xl mx-auto mb-12 md:mb-16 px-4 md:px-8">
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
        </div> */}

        {/* 통통 튀는 구 아이콘 애니메이션 */}
        {/* <div className="flex justify-center mt-6 md:mt-8">
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping" />
            <div className="relative rounded-full bg-blue-600 w-12 h-12 md:w-16 md:h-16 animate-bounce-subtle" />
          </div>
        </div>
      </div> */}

      {/* 단계별 인사이트 블록 */}
      {/* <div className="max-w-3xl mx-auto mb-12 md:mb-16 space-y-4 md:space-y-6">
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
      </div> */}

      {/* 결론/전환 블록 */}
      {/* <div className="max-w-3xl mx-auto text-center">
        <div className="w-1 h-12 md:h-16 bg-gray-300 mx-auto mb-6 md:mb-8" />
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          하지만, 이제 걱정하지 마세요!
        </h3>
        <p className="text-lg md:text-xl text-gray-700">
          TPT가 그 문제를 완벽하게 해결해드리겠습니다.
        </p>
      </div> */}
    </section>

    {/* 홈으로 버튼 */}
      <div className="flex items-center justify-center py-5 w-full">
        <CustomButton
          className="w-full mb-20 bg-[#273042] rounded-none min-h-8 max-h-20"
          onClick={() => router.push("/home")}
        >
          <div className="flex items-center justify-center w-full h-full">
            <Image
              src={`/images/final_logo_white.png`}
              alt={`logo`}
              width={60}
              height={40}
              className="min-h-4 max-h-12 w-auto object-contain"
            />
          </div>
        </CustomButton>
      </div>

    {/* 화면 하단 고정 버튼 */}
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-transparent py-3 px-4 w-full rounded-2xl">
      <div className="w-full flex justify-center rounded-2xl">
        <button
          className="relative w-[280px] h-[70px] md:w-[350px] md:h-[90px] transition-all hover:scale-105 cursor-pointer rounded-2xl"
          onClick={handleSignupClick}
          style={{
            animation: 'sparkle 4s ease-in-out infinite'
          }}
        >
          <Image
            src="/images/landing_button_bg_img_2.svg"
            alt="회원가입"
            fill
            className="object-contain"
            priority
          />
        </button>
      </div>
    </div>
  </div>
  );
}
