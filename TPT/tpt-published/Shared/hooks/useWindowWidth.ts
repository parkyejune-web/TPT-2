import { useState, useEffect } from 'react';

/**
 * 현재 윈도우 width를 추적하는 커스텀 hook
 * @returns 현재 윈도우 width (number)
 */
export function useWindowWidth(): number {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  );

  useEffect(() => {
    // 서버 사이드 렌더링 환경에서는 실행하지 않음
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 초기 width 설정
    setWindowWidth(window.innerWidth);

    // resize 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    // cleanup: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowWidth;
}

/**
 * 특정 breakpoint 이하인지 판단하는 커스텀 hook
 * @param breakpoint - 기준이 되는 width 값 (default: 768)
 * @returns breakpoint 이하면 true, 초과면 false
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const windowWidth = useWindowWidth();
  return windowWidth <= breakpoint;
}
