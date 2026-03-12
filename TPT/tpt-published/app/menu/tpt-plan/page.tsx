'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useWindowWidth } from '../../../Shared/hooks/useWindowWidth';
import { useNicepayPayment } from '../../../Shared/hooks/useNicePayments';
import { useAuthStore } from '../../../Shared/store/authStore';
import { useRouter } from 'next/navigation';
import { getActiveSubscriptionPlan, SubscriptionPlanPriceResponseDTO } from '../../../Shared/api/services/subscriptionPlanService';
import EventCountdownBanner from '../../../Features/tpt-plan/EventCountdownBanner';
import CustomModal from '../../../Shared/ui/CustomModal';

// 멤버십 카드 데이터 타입
interface MembershipCard {
  id: number;
  title: string;
  price: string;
  originalPrice?: string;
  description: string;
  benefits: { text: string; available: boolean }[];
  buttonText: string;
  buttonColor: 'blue' | 'yellow' | 'gray';
}

// 멤버십 카드 데이터
const membershipCards: MembershipCard[] = [
  {
    id: 1,
    title: 'Regular Type',
    price: 'Free',
    originalPrice: '₩99,000',
    description: '모든 매매를 기록하고 관리하세요.',
    benefits: [
      { text: '일간 매매일지 작성', available: true },
      { text: '일간 매매일지 피드백 요청', available: true },
      { text: '주간 누적 종합 데이터 활용', available: true },
      { text: '월간 누적 종합 데이터 활용', available: true },
      { text: '전문가 칼럼(10억 인사이트)', available: true },
      { text: 'TPT 트레이딩 룸', available: true },
      { text: 'Pro Type 매매일지', available: false },
      { text: 'TPT 시스템 트레이딩 강의 16강', available: false },
      { text: 'Regular 연구실 자료 무제한 열람', available: false },
      { text: '1:1 피드백 무제한 요청', available: false },
      { text: '주간 종합 피드백 자동 발송', available: false },
      { text: '월간 종합 피드백 자동 발송', available: false },
      { text: 'TPT 매매일지 전체 열람', available: false },
      { text: '토큰 무제한 지급', available: false },
    ],
    buttonText: '회원 가입하기',
    buttonColor: 'blue',
  },
  {
    id: 2,
    title: 'Pro Type',
    price: '₩99,000',
    description: '타점별 승률과 손익비 데이터까지 관리하세요.',
    benefits: [
      { text: '일간 매매일지 작성', available: true },
      { text: '일간 매매일지 피드백 요청', available: true },
      { text: '주간 누적 종합 데이터 활용', available: true },
      { text: '월간 누적 종합 데이터 활용', available: true },
      { text: '전문가 칼럼(10억 인사이트)', available: true },
      { text: 'TPT 트레이딩 룸', available: true },
      { text: 'Pro Type 매매일지', available: true },
      { text: 'TPT 시스템 트레이딩 강의 16강', available: true },
      { text: 'Regular 연구실 자료 무제한 열람', available: true },
      { text: '1:1 피드백 무제한 요청', available: true },
      { text: '주간 종합 피드백 자동 발송', available: true },
      { text: '월간 종합 피드백 자동 발송', available: true },
      { text: 'TPT 매매일지 전체 열람', available: true },
      { text: '토큰 무제한 지급', available: true },
    ],
    buttonText: 'Pro Type +2개월 혜택받기',
    buttonColor: 'yellow',
  },
  {
    id: 3,
    title: 'ETCC Memberships',
    price: '심사제',
    description: '트레이더를 위해 마련된 특별한 공간',
    benefits: [
      // { text: '매매일지 작성 기능', available: true },
      // { text: '기본 분석 리포트', available: true },
      // { text: '커뮤니티 접근', available: true },
      // { text: 'AI 피드백 (무제한)', available: true },
      // { text: '프리미엄 강의 시청', available: true },
      // { text: '심층 분석 리포트', available: true },
      // { text: '1:1 멘토링', available: true },
      // { text: '실시간 트레이딩룸', available: true },
      // { text: 'VIP 커뮤니티', available: true },
      // { text: '전용 이벤트 참여', available: true },
    ],
    buttonText: '심사 신청하기',
    buttonColor: 'gray',
  },
];

/**
 * TPT PLAN 안내 페이지
 * 프리미엄 회원권 상세 정보
 */
export default function TPTPlanPage() {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isBgImageLoaded, setIsBgImageLoaded] = useState(false);
  const [activePlan, setActivePlan] = useState<SubscriptionPlanPriceResponseDTO | null>(null);
  const [isEventPeriod, setIsEventPeriod] = useState(false);
  const [showDefaultSection, setShowDefaultSection] = useState(false); // 이벤트 배너에서 기본 섹션으로 전환
  const [currentIndex, setCurrentIndex] = useState(0);
  // Modal 상태
  const [isProTypeModalOpen, setIsProTypeModalOpen] = useState(false);
  const [isEtccModalOpen, setIsEtccModalOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const { openPayment, isLoading: isPaymentLoading } = useNicepayPayment();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // Pro Type 가격 표시 설정
  // TODO: API 가격을 표시하려면 이 값을 true로 변경
  const SHOW_PRO_TYPE_PRICE_FROM_API = false;

  // 이벤트 기간 체크 (11월 30일 00:00 ~ 12월 17일 24:00)
  useEffect(() => {
    const checkEventPeriod = () => {
      const now = new Date();
      const eventStartDate = new Date('2025-12-09T00:00:00+09:00'); // 요기 수정해서 확인하기 
      const eventEndDate = new Date('2025-12-18T00:00:00+09:00');
      setIsEventPeriod(now >= eventStartDate && now < eventEndDate);
    };
    checkEventPeriod();
    const timer = setInterval(checkEventPeriod, 60000);
    return () => clearInterval(timer);
  }, []);

  // 활성 구독 플랜 조회
  useEffect(() => {
    const fetchActivePlan = async () => {
      const response = await getActiveSubscriptionPlan();
      if (response.success && response.data && response.data.length > 0) {
        setActivePlan(response.data[0]);
      }
    };
    fetchActivePlan();
  }, []);

  // 모바일 슬라이더 스크롤 이벤트
  // 슬라이더가 조건부 렌더링되므로 isEventPeriod, showDefaultSection도 의존성에 포함
  useEffect(() => {
    // console.log('[DEBUG] useEffect 실행 - isMobile:', isMobile, 'sliderRef.current:', !!sliderRef.current, 'isEventPeriod:', isEventPeriod, 'showDefaultSection:', showDefaultSection);
    if (!isMobile || !sliderRef.current) {
      // console.log('[DEBUG] 조건 미충족으로 리턴 - isMobile:', isMobile, 'sliderRef:', !!sliderRef.current);
      return;
    }
    const slider = sliderRef.current;
    // console.log('[DEBUG] 스크롤 이벤트 리스너 등록');

    const handleScroll = () => {
      // console.log('[DEBUG] handleScroll 호출됨');
      // 슬라이더 내부의 카드 요소들을 직접 참조하여 현재 위치 계산
      const cards = slider.children;
      // console.log('[DEBUG] cards.length:', cards.length);
      if (cards.length === 0) return;

      const sliderRect = slider.getBoundingClientRect();
      const sliderCenter = sliderRect.left + sliderRect.width / 2;
      // console.log('[DEBUG] sliderRect:', sliderRect, 'sliderCenter:', sliderCenter);

      let closestIndex = 0;
      let closestDistance = Infinity;

      for (let i = 0; i < cards.length; i++) {
        const cardRect = cards[i].getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(sliderCenter - cardCenter);
        // console.log(`[DEBUG] Card ${i}: cardCenter=${cardCenter}, distance=${distance}`);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }

      // console.log('[DEBUG] 최종 closestIndex:', closestIndex, 'currentIndex 업데이트');
      setCurrentIndex(closestIndex);
    };
    slider.addEventListener('scroll', handleScroll);
    return () => {
      // console.log('[DEBUG] 스크롤 이벤트 리스너 제거');
      slider.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, isEventPeriod, showDefaultSection]);

  // 배경 이미지 프리로드
  useEffect(() => {
    const bgImageUrl = isMobile
      ? '/images/banners/tpt-plan_default_img_mobile_3.svg'
      : '/images/banners/tpt-plan_default_img_2.svg';

    const img = new window.Image();
    img.src = bgImageUrl;
    img.onload = () => setIsBgImageLoaded(true);
  }, [isMobile]);

  // dot 클릭 시 해당 카드로 이동
  const handleDotClick = (index: number) => {
    if (!sliderRef.current) return;
    const cards = sliderRef.current.children;
    if (index >= 0 && index < cards.length) {
      const card = cards[index] as HTMLElement;
      // 카드를 중앙에 위치시키기 위한 스크롤 위치 계산
      const scrollLeft = card.offsetLeft - (sliderRef.current.offsetWidth - card.offsetWidth) / 2;
      sliderRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  // CTA 버튼 클릭 핸들러
  const handleButtonClick = (cardId: number) => {
    // [1] Regular Type - 회원 가입하기
    if (cardId === 1) {
      // 비로그인 사용자만 /signup 으로 이동
      if (!isAuthenticated) {
        router.push('/signup');
      }
      // 로그인 사용자는 버튼이 비활성화되어 있으므로 아무 동작 안함
      return;
    }

    // [2] Pro Type - 구독하기
    if (cardId === 2) {
      // 비로그인 사용자는 /signup 으로 이동
      if (!isAuthenticated) {
        router.push('/signup');
        return;
      }

      // 로그인 했고, userStatus가 UID_REJECTED 또는 UID_REVIEW_PENDING인 경우 Modal 표시
      const userStatus = user?.userStatus;
      if (userStatus === 'UID_REJECTED' || userStatus === 'UID_REVIEW_PENDING') {
        setIsProTypeModalOpen(true);
        return;
      }

      // 그 외의 userStatus인 경우 결제창 열기
      openPayment();
      return;
    }

    // [3] ETCC Memberships - 심사 신청하기
    if (cardId === 3) {
      setIsEtccModalOpen(true);
      return;
    }
  };

  // Regular Type 버튼 비활성화 여부
  const isRegularButtonDisabled = isAuthenticated;

  // Pro Type 체크 아이콘 그라데이션 배경 계산 (위에서 아래로 점점 진해짐)
  const getProCheckGradient = (index: number, totalAvailable: number) => {
    // #CFC28F (밝은색) -> #96874A (진한색)
    const startColor = { r: 207, g: 194, b: 143 };
    const endColor = { r: 150, g: 135, b: 74 };

    const ratio = index / (totalAvailable - 1 || 1);
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 이벤트 기간에는 이벤트 배너, 그 외에는 기존 최상단 컴포넌트 */}
      {/* showDefaultSection이 true이면 이벤트 기간이라도 기존 섹션 표시 */}
      {isEventPeriod && !showDefaultSection ? (
        <EventCountdownBanner onReservationClick={() => setShowDefaultSection(true)} />
      ) : (
        <section className="relative">
          {/* 배경 이미지 컨테이너 - 이미지 비율 유지 */}
          <div className="relative w-full">
            {/* 스켈레톤 배경 (로딩 중) */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                isBgImageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              style={{
                background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #1a237e 100%)',
                backgroundSize: '200% 200%',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />

            {/* 실제 배경 이미지 - img 태그로 비율 유지 */}
            <img
              src={isMobile
                ? '/images/banners/tpt-plan_default_img_mobile_3.svg'
                : '/images/banners/tpt-plan_default_img_2.svg'}
              alt="TPT Plan Background"
              className={`w-full h-auto block transition-opacity duration-500 ${
                isBgImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsBgImageLoaded(true)}
            />

            {/* 배경 오버레이 - 이미지와 동일한 영역만 덮음 */}
            <div className="absolute inset-0 bg-black/30" />

            {/* 컨텐츠 - 배경 이미지 위에 절대 위치 */}
            <div className="absolute inset-0 z-10 flex items-center justify-center py-16 px-4">
              <div className="max-w-[1280px] w-full mx-auto flex flex-col items-center">
            {/* 로고 영역 */}
            <div className={`flex justify-center ${isMobile ? 'mb-6' : 'mb-10'}`}>
              <Image
                src="/images/final_logo_white.png"
                alt="TPT Logo"
                width={isMobile ? 100 : 150}
                height={isMobile ? 100 : 150}
                className="object-contain"
                priority
              />
            </div>

            {/* 데스크톱/태블릿: 카드 3개 가로 배치 - 반응형으로 유연하게 축소 */}
            {!isMobile && (
              <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-10 w-full max-w-full px-2 sm:px-4">
                {membershipCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex flex-col rounded-[10px] sm:rounded-[12px] lg:rounded-[14px] p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 flex-1 min-w-0 max-w-[340px]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {/* Title */}
                    <h3 className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-1 lg:mb-2">{card.title}</h3>

                    {/* 가격 */}
                    <div className="mb-1 sm:mb-2 lg:mb-3">
                      {card.originalPrice && (
                        <span className="text-white/60 line-through text-[10px] sm:text-xs lg:text-sm mr-1 sm:mr-2">
                          월 {card.originalPrice}
                        </span>
                      )}
                      <span className="text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg">
                        {card.id === 2
                          ? (SHOW_PRO_TYPE_PRICE_FROM_API && activePlan
                              ? `월 ₩${activePlan.price.toLocaleString()}`
                              : '사전예약자 전용 +2개월 무료 제공')
                          : card.id === 1
                          ? card.price
                          : card.id === 3
                          ? card.price
                          : `월 ${card.price}`}
                      </span>
                    </div>

                    {/* 설명 */}
                    <p className="text-white/90 text-[10px] sm:text-xs lg:text-sm mb-2 lg:mb-4">{card.description}</p>

                    {/* 혜택 목록 */}
                    <ul className="flex-1 space-y-0.5 sm:space-y-1 lg:space-y-2 mb-2 sm:mb-3 lg:mb-6">
                      {card.benefits.length === 0 ? (
                        // benefits가 비어있는 경우 "준비 중" 표시
                        <li className="flex items-center justify-center h-full">
                          <span className="text-white/60 text-[10px] sm:text-xs lg:text-sm">준비 중</span>
                        </li>
                      ) : (
                        (() => {
                          const availableBenefits = card.benefits.filter(b => b.available);
                          let availableIndex = 0;
                          return card.benefits.map((benefit, idx) => {
                            const currentAvailableIndex = benefit.available ? availableIndex++ : -1;
                            return (
                              <li
                                key={idx}
                                className={`flex items-center gap-1 sm:gap-1.5 lg:gap-2 text-[10px] sm:text-xs lg:text-sm ${
                                  benefit.available ? 'text-white' : 'text-white/40'
                                }`}
                              >
                                {benefit.available ? (
                                  card.id === 2 ? (
                                    // Pro Type: 체크 아이콘 자체에 골드 그라데이션
                                    <span
                                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 flex items-center justify-center text-xs sm:text-sm lg:text-base font-bold flex-shrink-0"
                                      style={{
                                        background: `linear-gradient(90deg, #CFC28F, ${getProCheckGradient(currentAvailableIndex, availableBenefits.length)})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                      }}
                                    >
                                      ✓
                                    </span>
                                  ) : (
                                    // Regular Type: 체크 아이콘 은색
                                    <span
                                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 flex items-center justify-center text-xs sm:text-sm lg:text-base font-bold flex-shrink-0"
                                      style={{
                                        background: 'linear-gradient(90deg, #E8E8E8, #A8A8A8)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                      }}
                                    >
                                      ✓
                                    </span>
                                  )
                                ) : (
                                  <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 flex items-center justify-center text-[8px] sm:text-[10px] lg:text-xs flex-shrink-0">✕</span>
                                )}
                                <span className="truncate">{benefit.text}</span>
                              </li>
                            );
                          });
                        })()
                      )}
                    </ul>

                    {/* CTA 버튼 - 그라데이션 적용 */}
                    <button
                      onClick={() => handleButtonClick(card.id)}
                      disabled={
                        (card.id === 1 && isRegularButtonDisabled) ||
                        (card.id === 2 && isPaymentLoading)
                      }
                      className={`w-full h-8 sm:h-9 lg:h-[42px] rounded-md lg:rounded-lg font-medium text-white text-xs sm:text-sm lg:text-base transition-all duration-200 active:scale-[0.97] hover:opacity-90 ${
                        (card.id === 1 && isRegularButtonDisabled) || (card.id === 2 && isPaymentLoading)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      style={{
                        background: 'linear-gradient(90deg, #2962FF, #8AD2D2)',
                      }}
                    >
                      {card.id === 2 && isPaymentLoading ? '처리 중...' : card.buttonText}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 모바일: 슬라이더 - Pro Type을 먼저 보여주기 위해 순서 재정렬 */}
            {isMobile && (
              <>
                <div
                  ref={sliderRef}
                  className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide px-8"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {/* 모바일에서는 Pro Type(id:2)을 먼저, 그 다음 Regular(id:1), ETCC(id:3) 순서로 표시 */}
                  {[membershipCards[1], membershipCards[0], membershipCards[2]].map((card) => (
                    <div
                      key={card.id}
                      className="flex-shrink-0 w-[80vw] snap-center mx-5 first:ml-0 last:mr-0"
                      style={{ scrollSnapAlign: 'center' }}
                    >
                      <div
                        className="flex flex-col rounded-[14px] p-5 h-full"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        {/* Title */}
                        <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>

                        {/* 가격 */}
                        <div className="mb-3">
                          {card.originalPrice && (
                            <span className="text-white/60 line-through text-sm mr-2">
                              월 {card.originalPrice}
                            </span>
                          )}
                          <span className="text-white font-semibold text-base">
                            {card.id === 2
                              ? (SHOW_PRO_TYPE_PRICE_FROM_API && activePlan
                                  ? `월 ₩${activePlan.price.toLocaleString()}`
                                  : '사전예약자 전용 +2개월 무료 제공')
                              : card.id === 1
                              ? card.price
                              : card.id === 3
                              ? card.price
                              : `월 ${card.price}`}
                          </span>
                        </div>

                        {/* 설명 */}
                        <p className="text-white/90 text-sm mb-4">{card.description}</p>

                        {/* 혜택 목록 */}
                        <ul className="flex-1 space-y-2 mb-5">
                          {card.benefits.length === 0 ? (
                            // benefits가 비어있는 경우 "준비 중" 표시
                            <li className="flex items-center justify-center h-full">
                              <span className="text-white/60 text-sm">준비 중</span>
                            </li>
                          ) : (
                            (() => {
                              const availableBenefits = card.benefits.filter(b => b.available);
                              let availableIndex = 0;
                              return card.benefits.map((benefit, idx) => {
                                const currentAvailableIndex = benefit.available ? availableIndex++ : -1;
                                return (
                                  <li
                                    key={idx}
                                    className={`flex items-center gap-2 text-sm ${
                                      benefit.available ? 'text-white' : 'text-white/40'
                                    }`}
                                  >
                                    {benefit.available ? (
                                      card.id === 2 ? (
                                        // Pro Type: 체크 아이콘 자체에 골드 그라데이션
                                        <span
                                          className="w-4 h-4 flex items-center justify-center text-base font-bold"
                                          style={{
                                            background: `linear-gradient(90deg, #CFC28F, ${getProCheckGradient(currentAvailableIndex, availableBenefits.length)})`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                          }}
                                        >
                                          ✓
                                        </span>
                                      ) : (
                                        // Regular Type: 체크 아이콘 은색
                                        <span
                                          className="w-4 h-4 flex items-center justify-center text-base font-bold"
                                          style={{
                                            background: 'linear-gradient(90deg, #E8E8E8, #A8A8A8)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                          }}
                                        >
                                          ✓
                                        </span>
                                      )
                                    ) : (
                                      <span className="w-4 h-4 flex items-center justify-center text-xs">✕</span>
                                    )}
                                    <span>{benefit.text}</span>
                                  </li>
                                );
                              });
                            })()
                          )}
                        </ul>

                        {/* CTA 버튼 - 그라데이션 적용 */}
                        <button
                          onClick={() => handleButtonClick(card.id)}
                          disabled={
                            (card.id === 1 && isRegularButtonDisabled) ||
                            (card.id === 2 && isPaymentLoading)
                          }
                          className={`w-full h-[42px] rounded-lg font-medium text-white transition-all duration-200 active:scale-[0.97] hover:opacity-90 ${
                            (card.id === 1 && isRegularButtonDisabled) || (card.id === 2 && isPaymentLoading)
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          style={{
                            background: 'linear-gradient(90deg, #2962FF, #8AD2D2)',
                          }}
                        >
                          {card.id === 2 && isPaymentLoading ? '처리 중...' : card.buttonText}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dot Indicator */}
                <div className="flex gap-2 mt-4">
                  {membershipCards.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDotClick(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        currentIndex === idx ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Plan 설명 이미지 - 모바일 반응형 (새 이미지 경로로 변경) */}
      <section className="w-full" style={{ minHeight: isMobile ? '500px' : '800px' }}>
        {isImageLoading && (
          <div className="w-full h-full flex items-center justify-center bg-gray-50" style={{ minHeight: isMobile ? '500px' : '800px' }}>
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="text-gray-600 font-medium">로딩 중...</p>
            </div>
          </div>
        )}
        <Image
          src={isMobile ? '/images/banners/final_tpt-plan_banner_mobile.svg' : '/images/banners/final_tpt-plan_banner_desk.svg'}
          alt="Plan Explanation"
          width={1920}
          height={1080}
          className={`w-full h-auto object-contain transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsImageLoading(false)}
          priority
        />
      </section>

      {/* Pro Type 구독 불가 Modal (UID_REJECTED, UID_REVIEW_PENDING) */}
      <CustomModal
        isOpen={isProTypeModalOpen}
        onClose={() => setIsProTypeModalOpen(false)}
        variant={1}
        width='w-lg'
      >
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <p className="text-gray-800 text-base leading-relaxed">
            Regular 계정 전환 후 Pro Type을 구독하실 수 있습니다.
          </p>
          <button
            onClick={() => setIsProTypeModalOpen(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            확인
          </button>
        </div>
      </CustomModal>

      {/* ETCC 서비스 준비 중 Modal */}
      <CustomModal
        isOpen={isEtccModalOpen}
        onClose={() => setIsEtccModalOpen(false)}
        variant={1}
        width='w-lg'
      >
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <p className="text-gray-800 text-base leading-relaxed">
            ETCC 서비스는 현재 준비 중입니다.<br />
            오픈 일정은 추후 공지해드릴 예정이오니 잠시만 기다려주세요.
          </p>
          <button
            onClick={() => setIsEtccModalOpen(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            확인
          </button>
        </div>
      </CustomModal>
    </div>
  );
}
