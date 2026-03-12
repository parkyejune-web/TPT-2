'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import CustomModal from '../../Shared/ui/CustomModal';
import { useWindowWidth } from '../../Shared/hooks/useWindowWidth';

interface UIDGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * UID 가이드 모달 컴포넌트
 */
export default function UIDGuide({ isOpen, onClose }: UIDGuideProps) {
  const [gateSignupOpen, setGateSignupOpen] = useState(false);
  const [guideToggle1Open, setGuideToggle1Open] = useState(false);
  // const [guideToggle2Open, setGuideToggle2Open] = useState(false);
  const [serviceGuideOpen, setServiceGuideOpen] = useState(false);
  const [imageLoading1, setImageLoading1] = useState(false);
  // const [imageLoading2, setImageLoading2] = useState(false);

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 860;

  const handleToggle1 = () => {
    if (!guideToggle1Open) {
      setImageLoading1(true);
    }
    setGuideToggle1Open(!guideToggle1Open);
  };

  // const handleToggle2 = () => {
  //   if (!guideToggle2Open) {
  //     setImageLoading2(true);
  //   }
  //   setGuideToggle2Open(!guideToggle2Open);
  // };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} variant={1} width={isMobile ? "max-w-full" : "max-w-3xl"}>
      <div className={`flex flex-col gap-6 text-sm text-gray-700 max-h-[80vh] overflow-y-auto ${isMobile ? 'p-4' : 'p-6'}`}>
        {/* 상단 안내 텍스트 */}
        {/* <h3 className="text-lg font-bold text-red-600 text-center">
          거래소별 회원가입시 아래링크를 클릭 후 회원가입 진행 바랍니다.
        </h3> */}

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

          <div className="flex flex-col text-[#333]">
            <p className="text-center text-base leading-relaxed mb-3">
              TPT 서비스 이용 및 매매일지 분석의 정확성을 위해<br />
              아래의 사항들을 확인해 주시기를 바랍니다.
            </p>

            <ul className="space-y-3 text-sm text-[#333]">
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
        <div className={`flex flex-col gap-2 ${isMobile ? '-mx-4 w-[calc(100%+2rem)]' : ''}`}>
          <button
            onClick={handleToggle1}
            className={`flex items-center justify-between w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 transition ${isMobile ? 'px-4 rounded-none' : 'px-4 rounded-md'}`}
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

        {/* 가이드 토글 2 - 주석 처리됨 */}
        {/* <div className={`flex flex-col gap-2 ${isMobile ? '-mx-4 w-[calc(100%+2rem)]' : ''}`}>
          <button
            onClick={handleToggle2}
            className={`flex items-center justify-between w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 transition ${isMobile ? 'px-4 rounded-none' : 'px-4 rounded-md'}`}
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
        </div> */}

        {/* TPT 서비스 이용자 안내문 토글 */}
        <div className={`flex flex-col gap-2 ${isMobile ? '-mx-4 w-[calc(100%+2rem)]' : ''}`}>
          <button
            onClick={() => setServiceGuideOpen(!serviceGuideOpen)}
            className={`flex items-center justify-between w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 transition ${isMobile ? 'px-4 rounded-none' : 'px-4 rounded-md'}`}
          >
            <span className="font-medium text-gray-700">
              TPT 서비스 이용자 안내문
            </span>
            {serviceGuideOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {serviceGuideOpen && (
            <div className={`bg-gray-50 border border-gray-200 ${isMobile ? 'p-4 rounded-none' : 'p-6 rounded-md'}`}>
              <div className="space-y-6 text-sm text-gray-700">
                <h4 className="text-base font-bold text-black text-center">TPT 서비스 이용자 안내문</h4>

                <p className="leading-relaxed">
                  TPT는 이용자의 학습 목적을 지원하기 위해 매매 기록 분석, 시스템 트레이딩 교육, 거래 성향 파악 도구, 리스크 관리 개념 정립을 위한 콘텐츠 등을 제공하는 교육·정보 기반 서비스입니다. 본 안내문은 TPT 이용 과정에서 반드시 확인해야 할 사항을 정리한 것으로, 서비스 이용 시 아래 내용을 모두 숙지하신 것으로 간주됩니다.
                </p>

                {/* 서비스 성격에 관한 기본 고지 */}
                <div>
                  <h5 className="font-bold text-black mb-3">※서비스 성격에 관한 기본 고지※</h5>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>TPT는 투자자문, 자산운용, 금융상품 권유, 투자판단 제시, 매수·매도 추천 등의 행위를 제공하지 않습니다.</li>
                    <li>모든 자료와 설명은 일반적 교육 목적의 정보 제공, 기록·분석 도구 제공, 트레이딩 과정 개선을 위한 학습적 피드백에 한정됩니다.</li>
                    <li>특정 가상자산의 매수·매도 시점, 목표가, 손절가 등 투자 결정을 대신하는 정보는 제공하지 않습니다. 이용자의 모든 투자 판단과 그로부터 발생하는 결과는 전적으로 이용자 본인의 책임입니다.</li>
                    <li>TPT는 특정 거래소 사용을 강제하지 않습니다.</li>
                  </ol>
                </div>

                {/* 레퍼럴 사용 및 기능 활성화 관련 고지 */}
                <div>
                  <h5 className="font-bold text-black mb-3">※레퍼럴(추천인 코드) 사용 및 기능 활성화 관련 고지※</h5>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>TPT는 거래소 UID 연동을 통해 실거래 데이터를 분석하는 구조를 사용합니다. 따라서 일부 서비스 기능은 해당 거래소 UID가 정상적으로 연동된 이용자에게만 활성화될 수 있습니다.</li>
                    <li>레퍼럴 코드는 거래소와의 데이터 연동 절차를 단순화하기 위한 수단입니다.</li>
                    <li>레퍼럴 사용 여부는 투자 성과, 수익률, 매매 결과에 아무런 영향을 주지 않습니다.</li>
                    <li>TPT는 레퍼럴 사용을 통해 거래소로부터 수수료 일부를 지급받을 수 있으며, 이는 서비스 유지·운영을 위한 구조입니다.</li>
                    <li>이용자는 레퍼럴 사용 없이도 거래소 가입이 가능하며, 해당 선택은 완전히 자율적입니다.</li>
                    <li>레퍼럴 사용자는 UID 연동이 완료됨에 따라 기술적으로 필요한 일부 기능(매매일지 분석 등)을 이용할 수 있으나, 이는 데이터 연동 필요성에 따른 기능 제공일 뿐, 특정 투자 행위를 유도하거나 우월한 이익을 보장하는 구조가 아닙니다.</li>
                  </ol>
                </div>

                {/* 피드백 및 커뮤니티 운영에 대한 고지 */}
                <div>
                  <h5 className="font-bold text-black mb-3">※피드백 및 커뮤니티 운영에 대한 고지※</h5>
                  <p className="mb-2">TPT가 제공하는 모든 피드백, 설명, 코멘트는 다음 범위를 벗어나지 않습니다.</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>피드백은 개별 종목·매수/매도 시점·목표가·손절가 제시에 해당하지 않도록 운영됩니다.</li>
                    <li>매매 과정·규칙 준수 여부·리스크 관리 구조 등 프로세스 중심 검토</li>
                    <li>교육용 관점에서 제공되는 일반적 해석 및 기록 개선 방향성</li>
                    <li>특정 종목·가격·포지션 크기 등의 직접적 의사결정에 개입하지 않는 비권유적 설명</li>
                    <li>TPT는 개별 회원의 매수·매도 판단을 대신하거나, 승률·수익률·자산 증가 등 투자 결과를 보장하지 않습니다.</li>
                    <li>TPT는 종료된 매매 이력에 대해서만 피드백을 제공합니다.</li>
                    <li>포지션이 진행 중인 상태에서는 매수·매도·보유·포지션 축소 또는 확대 등 어떠한 결정에도 개입하지 않습니다.</li>
                    <li>제공되는 분석과 코멘트는 교육적 목적의 사후적 기록 검토에 한정되며, 투자 권유·자문에 해당하지 않습니다.</li>
                  </ol>
                </div>

                {/* 해외 거래소 이용에 대한 리스크 고지 */}
                <div>
                  <h5 className="font-bold text-black mb-3">※해외 거래소 이용에 대한 리스크 고지※</h5>
                  <p className="mb-2">TPT는 교육 및 분석 기능 제공을 목적으로 하며, 어느 거래소의 안정성·신뢰성·적합성을 보증하지 않습니다. 가상자산 거래는 다음과 같은 위험을 포함합니다.</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>가격 급변 및 높은 변동성</li>
                    <li>거래소의 인출 제한·운영 중단·시스템 장애 등의 위험</li>
                    <li>국내법상 미신고 해외 거래소의 경우 발생할 수 있는 법적 보호 공백</li>
                    <li>시장조성·유동성 부족·청산 리스크 등 시장의 구조적 위험</li>
                    <li>해외 거래소 이용은 이용자의 전적인 선택이며, 그에 따른 결과 또한 이용자 본인의 책임입니다.</li>
                  </ol>
                </div>

                {/* 가상자산 거래 관련 중요 고지 */}
                <div>
                  <h5 className="font-bold text-black mb-3">※가상자산 거래 관련 중요 고지※</h5>
                  <p className="mb-2">가상자산은 높은 변동성과 예측 불가능성을 지닌 자산군이며, 다음 위험을 반드시 고려해야 합니다.</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>원금 전액 손실 가능성</li>
                    <li>외환 변동성 및 기술적 오류</li>
                    <li>유동성 고갈, 돌발적 시장 급등락</li>
                    <li>규제 변경·정책 변화에 따른 거래 환경 불안정</li>
                    <li>미공개정보 이용, 시세조종, 부정거래 등 시장질서 관련 위험</li>
                    <li>가상자산 거래는 투자 목적·재무 상태·경험 등을 고려해 스스로 판단하여야 하며, 가상자산 매수·보유·매도는 전적으로 본인의 책임으로 결정해야 합니다.</li>
                  </ol>
                </div>

                {/* TPT의 책임 한계 */}
                <div>
                  <h5 className="font-bold text-black mb-3">※TPT의 책임 한계※</h5>
                  <p className="mb-2">TPT는 다음 사항을 보장하지 않습니다.</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>수익 발생, 손실 회피, 특정 성과의 달성</li>
                    <li>특정 거래 전략의 성공, 승률 향상</li>
                    <li>이용자의 투자 결과에 대한 법적·재정적 책임</li>
                    <li>외부 서비스(거래소 등)의 운영 신뢰성</li>
                  </ol>
                  <p className="mt-3">TPT의 자료는 교육 및 일반적 참고용이며, 경제적·재정적 결정의 근거로 사용될 수 없습니다.</p>
                </div>

                {/* 최종 안내 */}
                <div>
                  <h5 className="font-bold text-black mb-3">※최종 안내※</h5>
                  <p className="leading-relaxed">
                    TPT는 학습 중심 서비스이며, 어떠한 경우에도 투자판단 제공 또는 권유 서비스로 해석될 수 없도록 운영됩니다.<br /><br />
                    위 안내문에 포함된 사항들은 TPT와 이용자 간의 책임 범위를 명확히 하기 위한 필수적 정보입니다.<br /><br />
                    서비스를 지속적으로 이용하실 경우, 본 안내문의 모든 내용을 이해하고 동의한 것으로 간주됩니다.<br /><br />
                    본 안내문은 관련 법령 및 서비스 운영 정책에 따라 수시로 변경될 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
}
