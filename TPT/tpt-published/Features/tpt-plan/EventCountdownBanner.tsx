'use client';

import { useState, useEffect, useRef } from 'react';
import { useWindowWidth } from '../../Shared/hooks/useWindowWidth';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// 카운트다운 숫자 컴포넌트 (부드러운 떨어지는 애니메이션)
function CountdownDigit({ value, label, isDesktop }: { value: number; label: string; isDesktop?: boolean }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setPrevValue(prevValueRef.current);
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 300);

      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  // 데스크톱에서는 더 큰 크기
  const boxSizeClass = isDesktop
    ? 'h-16 w-20 lg:h-20 lg:w-24'
    : 'h-10 sm:h-12 w-12 sm:w-14';
  const textSizeClass = isDesktop
    ? 'text-3xl lg:text-4xl'
    : 'text-xl sm:text-2xl';
  const labelSizeClass = isDesktop
    ? 'text-sm lg:text-base'
    : 'text-xs sm:text-sm';

  return (
    <div className="flex flex-col items-center">
      <div className={`relative overflow-hidden ${boxSizeClass} bg-gray-900/80 rounded-lg flex items-center justify-center`}>
        {/* 이전 숫자 (위로 사라짐) */}
        <span
          className={`absolute ${textSizeClass} font-bold text-white transition-all duration-300 ease-in-out ${
            isAnimating ? 'transform translate-y-full opacity-0' : 'transform translate-y-0 opacity-0'
          }`}
        >
          {String(prevValue).padStart(2, '0')}
        </span>
        {/* 현재 숫자 (위에서 떨어짐) */}
        <span
          className={`absolute ${textSizeClass} font-bold text-white transition-all duration-300 ease-out ${
            isAnimating ? 'transform -translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
          }`}
        >
          {String(displayValue).padStart(2, '0')}
        </span>
      </div>
      <span className={`${labelSizeClass} text-white mt-1 lg:mt-2`}>{label}</span>
    </div>
  );
}

interface EventCountdownBannerProps {
  onReservationClick?: () => void;
}

/**
 * 이벤트 카운트다운 배너 컴포넌트
 * 11월 30일 00:00 ~ 12월 17일 24:00 기간에만 표시
 */
export default function EventCountdownBanner({ onReservationClick }: EventCountdownBannerProps) {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 860;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 카카오 채널 링크
  const kakaoChannelLink = 'http://pf.kakao.com/_eTxkNn/chat';

  // 이벤트 종료일 (12월 17일 24:00 = 12월 18일 00:00)
  const eventEndDate = new Date('2025-12-18T00:00:00+09:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = eventEndDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleReservationClick = () => {
    if (onReservationClick) {
      onReservationClick();
    } else {
      // 콜백이 없으면 기존 동작 (카카오 채널 링크)
      window.open(kakaoChannelLink, '_blank');
    }
  };

  return (
    <section className="relative w-full">
      {/* 배경 이미지 - 원래 비율대로 */}
      <img
        src={`/images/${isMobile ? 'event_banner_mobile.svg' : 'event_banner_desk.svg'}`}
        alt="이벤트 배너"
        className="w-full h-auto object-contain"
      />

      {/* 타이머 컨테이너 - 이미지 위에 겹쳐서 배치 */}
      <div
        className={`absolute ${
          isMobile
            ? 'bottom-4 left-1/2 transform -translate-x-1/2 w-[90%]'
            : 'right-12 lg:right-20 top-1/2 transform -translate-y-1/2'
        }`}
      >
        <div className={`bg-white/20 backdrop-blur-sm rounded-xl flex flex-col justify-start items-start ${
          isMobile
            ? 'p-3 mb-20'
            : 'p-6 lg:p-8 mr-8 lg:mr-16'
        }`}>
          {/* 사전 예약 혜택 */}
          <h1 className={`font-bold text-white ${
            isMobile
              ? 'text-xl sm:text-2xl mb-1'
              : 'text-2xl lg:text-4xl mb-2 lg:mb-3'
          }`}>
            사전 예약 혜택
          </h1>

          {/* +Pro Type 2달 무료 */}
          <p className={`font-semibold text-white ${
            isMobile
              ? 'text-base sm:text-lg mb-3'
              : 'text-lg lg:text-2xl mb-4 lg:mb-6'
          }`}>
            +Pro Type 2달 무료
          </p>

          {/* 예약 마감 텍스트 */}
          <p className={`text-white/80 ${
            isMobile
              ? 'text-sm mb-2'
              : 'text-base lg:text-lg mb-3 lg:mb-4'
          }`}>예약 마감</p>

          {/* 카운트다운 */}
          <div className={`flex items-start mb-4 ${
            isMobile
              ? 'gap-2 sm:gap-3'
              : 'gap-3 lg:gap-4 mb-6 lg:mb-8'
          }`}>
            <CountdownDigit value={timeLeft.days} label="일" isDesktop={!isMobile} />
            <span className={`font-bold text-white ${
              isMobile
                ? 'text-xl sm:text-2xl mt-2'
                : 'text-2xl lg:text-4xl mt-4 lg:mt-6'
            }`}>:</span>
            <CountdownDigit value={timeLeft.hours} label="시간" isDesktop={!isMobile} />
            <span className={`font-bold text-white ${
              isMobile
                ? 'text-xl sm:text-2xl mt-2'
                : 'text-2xl lg:text-4xl mt-4 lg:mt-6'
            }`}>:</span>
            <CountdownDigit value={timeLeft.minutes} label="분" isDesktop={!isMobile} />
            <span className={`font-bold text-white ${
              isMobile
                ? 'text-xl sm:text-2xl mt-2'
                : 'text-2xl lg:text-4xl mt-4 lg:mt-6'
            }`}>:</span>
            <CountdownDigit value={timeLeft.seconds} label="초" isDesktop={!isMobile} />
          </div>

          {/* 사전 예약 등록 버튼 */}
          <button
            onClick={handleReservationClick}
            className={`w-full rounded-lg text-white font-bold transition-transform hover:scale-105 active:scale-95 ${
              isMobile
                ? 'py-3 px-6 text-base sm:text-lg'
                : 'py-4 lg:py-5 px-8 lg:px-12 text-lg lg:text-xl'
            }`}
            style={{
              background: 'linear-gradient(90deg, #2962FF 0%, #8AD2D2 100%)',
            }}
          >
            사전 예약 등록
          </button>
        </div>
      </div>
    </section>
  );
}
