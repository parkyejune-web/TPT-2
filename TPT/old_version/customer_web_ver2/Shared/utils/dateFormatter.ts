/**
 * 날짜 포맷팅 유틸리티 함수
 */

/**
 * Date 객체를 YYYY-MM-DD 형식으로 변환
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Date 객체를 YYYY년 MM월 DD일 형식으로 변환
 */
export const formatDateToKorean = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * YYYY-MM-DD 문자열을 Date 객체로 변환
 */
export const parseYYYYMMDD = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * 현재 날짜의 연도, 월, 주차 계산
 */
export const getCurrentDateInfo = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // 해당 월의 첫 날
  const firstDay = new Date(year, month - 1, 1);
  const firstDayOfWeek = firstDay.getDay(); // 0 (일요일) ~ 6 (토요일)

  // 현재 날짜
  const currentDay = now.getDate();

  // 주차 계산 (첫 주는 1주차)
  const week = Math.ceil((currentDay + firstDayOfWeek) / 7);

  return { year, month, week, day: currentDay };
};

/**
 * 특정 월의 주차 목록 계산
 */
export const getWeeksInMonth = (year: number, month: number): number[] => {
  const lastDay = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const totalWeeks = Math.ceil((lastDay + firstDayOfWeek) / 7);
  return Array.from({ length: totalWeeks }, (_, i) => i + 1);
};

/**
 * 요일을 한글로 변환
 */
export const getDayOfWeekInKorean = (date: Date): string => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
};
