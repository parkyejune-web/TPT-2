'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useWindowWidth } from '../../../../Shared/hooks/useWindowWidth';

/**
 * 거래소 사용 방법 페이지
 */
export default function ExchangeGuidePage() {
  const [gateSignupOpen, setGateSignupOpen] = useState(false);
  const [guideToggle1Open, setGuideToggle1Open] = useState(false);
  const [guideToggle2Open, setGuideToggle2Open] = useState(false);
  const [imageLoading1, setImageLoading1] = useState(false);
  const [imageLoading2, setImageLoading2] = useState(false);

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 860;

  const handleToggle1 = () => {
    if (!guideToggle1Open) {
      setImageLoading1(true);
    }
    setGuideToggle1Open(!guideToggle1Open);
  };

  const handleToggle2 = () => {
    if (!guideToggle2Open) {
      setImageLoading2(true);
    }
    setGuideToggle2Open(!guideToggle2Open);
  };

  return (
    <div className="w-full p-4 md:p-6 mt-20 max-w-4xl mx-auto mb-20">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">거래소 사용 방법</h1>
      </div>

      <div className="flex flex-col gap-6 text-sm text-gray-700">
        {/* 상단 안내 텍스트 */}
        <h3 className="text-lg font-bold text-red-600 text-center">
          거래소별 회원가입시 아래링크를 클릭 후 회원가입 진행 바랍니다.
        </h3>

        {/* 게이트 거래소 회원가입 링크 토글 */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setGateSignupOpen(!gateSignupOpen)}
            className="flex items-center justify-between w-full px-4 py-3 bg-white border-2 border-[#D2C693] rounded-md hover:bg-gray-50 transition"
          >
            <span className="font-semibold bg-gradient-to-r from-[#D2C693] to-[#928346] bg-clip-text text-transparent">
              게이트 거래소 회원가입 링크
            </span>
            {gateSignupOpen ? <ChevronUp className="text-[#D2C693]" size={20} /> : <ChevronDown className="text-[#D2C693]" size={20} />}
          </button>

          {gateSignupOpen && (
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="mb-3 text-gray-700">
                게이트 거래소를 이용하시는 경우, 아래 링크를 통해 회원가입을 진행해주세요.
              </p>
              <a
                href="https://www.gate.com/share/VVJAXF1YVQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full px-4 py-3 bg-gradient-to-r from-[#D2C693] to-[#928346] text-white text-center rounded-md hover:from-[#C2B683] hover:to-[#827336] transition-all font-semibold"
              >
                UID 발급하기 →
              </a>
            </div>
          )}
        </div>

        {/* TPT 회원가입 안내사항 */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg px-6 py-8">
          <h3 className="text-xl font-bold text-black mb-3 text-center">TPT 회원가입 안내사항</h3>

          <div className="border-t border-[#E5E5E5] mb-3" />

          <div className="flex flex-col text-[#333] justify-center">
            <p className="text-center text-base leading-relaxed mb-3">
              TPT 서비스 이용 및 매매일지 분석의 정확성을 위해<br />
              아래의 사항들을 확인해 주시기를 바랍니다.
            </p>

            <ul className="space-y-3 text-sm text-[#333] mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-black font-bold mt-0.5">•</span>
                <span>
                  <span className="text-[#3B82F6]">친구추천 링크(레퍼럴 링크)</span>를 통해 TPT에 가입하는 것은
                  <br />
                  이용자의 <span className="text-[#3B82F6]">선택사항</span>입니다. 강제하거나 의무로써 강요하지 않습니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold mt-0.5">•</span>
                <span>타 거래소 제휴코드 문의는 카카오톡 채널 상담을 이용해주세요.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 가이드 토글 1 */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleToggle1}
            className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            <span className="font-medium text-gray-700">
              게이트 거래소 회원가입 방법 / UID 확인방법
            </span>
            {guideToggle1Open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {guideToggle1Open && (
            <div className={`bg-gray-50 border border-gray-200 relative ${isMobile ? 'p-0 rounded-none' : 'p-4 rounded-md'}`}>
              {imageLoading1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                  <Loader2 className="animate-spin text-[#D2C693]" size={40} />
                  <span className="ml-3 text-gray-600">로딩 중...</span>
                </div>
              )}
              <Image
                src={isMobile ? "/images/banners/UID_modal_new2_img_mobile_1.svg" : "/images/banners/UID_modal_new2_img_desk_1.svg"}
                alt="게이트 거래소 회원가입 방법 / UID 확인방법"
                width={800}
                height={600}
                className={`w-full h-auto shadow-md ${isMobile ? 'rounded-none' : 'rounded-lg'}`}
                onLoadingComplete={() => setImageLoading1(false)}
              />
            </div>
          )}
        </div>

        {/* 가이드 토글 2 */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleToggle2}
            className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            <span className="font-medium text-gray-700">
              게이트 거래소로 자산 옮기기 (국내 거래소 → 게이트 거래소)
            </span>
            {guideToggle2Open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {guideToggle2Open && (
            <div className={`bg-gray-50 border border-gray-200 relative ${isMobile ? 'p-0 rounded-none' : 'p-4 rounded-md'}`}>
              {imageLoading2 && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                  <Loader2 className="animate-spin text-[#D2C693]" size={40} />
                  <span className="ml-3 text-gray-600">로딩 중...</span>
                </div>
              )}
              <Image
                src={isMobile ? "/images/banners/UID_modal_new2_img_mobile_2.svg" : "/images/banners/UID_modal_new2_img_desk_2.svg"}
                alt="게이트 거래소로 자산 옮기기"
                width={800}
                height={600}
                className={`w-full h-auto shadow-md ${isMobile ? 'rounded-none' : 'rounded-lg'}`}
                onLoadingComplete={() => setImageLoading2(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
