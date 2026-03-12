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

/**
 * 특정 날짜의 연도, 월, 주차 계산
 * 주차는 월요일~일요일 단위로 계산됩니다.
 * 월 1일이 포함된 주부터 1주차로 시작합니다.
 * @param dateString YYYY-MM-DD 형식의 날짜 문자열
 * @returns 연도, 월, 주차 정보
 */
export const getDateInfo = (dateString: string) => {
  const date = parseYYYYMMDD(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 주차 계산: 월요일~일요일 단위
  // 해당 월의 1일이 무슨 요일인지 확인
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (일요일) ~ 6 (토요일)

  // 1일이 속한 주의 월요일 날짜 찾기
  let firstMondayOfFirstWeek;
  if (firstDayOfWeek === 0) {
    // 1일이 일요일이면, 그 주의 월요일은 2일
    firstMondayOfFirstWeek = 2;
  } else if (firstDayOfWeek === 1) {
    // 1일이 월요일이면, 그 주의 월요일은 1일
    firstMondayOfFirstWeek = 1;
  } else {
    // 1일이 화~토요일이면, 그 주의 월요일은 이전 달(음수)
    // 예: 1일이 토요일(6)이면 월요일은 1 - 5 = -4일 (전달)
    firstMondayOfFirstWeek = 1 - (firstDayOfWeek - 1);
  }

  // 현재 날짜가 첫 주의 월요일로부터 며칠 후인지 계산
  const daysSinceFirstMonday = day - firstMondayOfFirstWeek;

  // 주차 계산: 0일~6일 = 1주차, 7일~13일 = 2주차, ...
  const week = Math.floor(daysSinceFirstMonday / 7) + 1;

  console.log(`[getDateInfo] ${dateString} (${year}-${month}-${day}): 1일 요일=${firstDayOfWeek}, 첫주의 월요일=${firstMondayOfFirstWeek}일, daysSinceFirstMonday=${daysSinceFirstMonday}, 주차=${week}`);

  return { year, month, week, day };
};

/**
 * 특정 년/월/주차에 해당하는 날짜 범위를 계산
 * @param year 연도
 * @param month 월 (1-12)
 * @param weekNumber 주차 (1-5)
 * @returns 해당 주차의 시작일과 종료일 (M/D 형식)
 */
export const getWeekDateRange = (year: number, month: number, weekNumber: number): { start: string; end: string } => {
  // 해당 월의 1일
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (일요일) ~ 6 (토요일)

  // 1주차의 월요일 날짜 찾기
  let firstMondayOffset;
  if (firstDayOfWeek === 0) {
    // 1일이 일요일이면, 1주차의 월요일은 1일의 다음날인 2일
    firstMondayOffset = 1;
  } else if (firstDayOfWeek === 1) {
    // 1일이 월요일이면, 1주차의 월요일은 1일
    firstMondayOffset = 0;
  } else {
    // 1일이 화~토요일이면, 1주차의 월요일은 이전 주로 간주
    // 예: 1일이 수요일(3)이면 월요일은 1 - 2 = -1일 (전달)
    firstMondayOffset = -(firstDayOfWeek - 1);
  }

  // 해당 주차의 월요일과 일요일 계산
  const mondayOffset = firstMondayOffset + (weekNumber - 1) * 7;
  const sundayOffset = mondayOffset + 6;

  const mondayDate = new Date(year, month - 1, 1 + mondayOffset);
  const sundayDate = new Date(year, month - 1, 1 + sundayOffset);

  const formatShortDate = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return {
    start: formatShortDate(mondayDate),
    end: formatShortDate(sundayDate),
  };
};

/**
 * 특정 년/월/주차에 해당하는 각 요일의 날짜를 계산
 * @param year 연도
 * @param month 월 (1-12)
 * @param weekNumber 주차 (1-5)
 * @returns 월~일요일 각 날짜 (M/D 형식)
 */
export const getWeekDayDates = (year: number, month: number, weekNumber: number): string[] => {
  // 해당 월의 1일
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (일요일) ~ 6 (토요일)

  // 1주차의 월요일 날짜 찾기
  let firstMondayOffset;
  if (firstDayOfWeek === 0) {
    firstMondayOffset = 1;
  } else if (firstDayOfWeek === 1) {
    firstMondayOffset = 0;
  } else {
    firstMondayOffset = -(firstDayOfWeek - 1);
  }

  // 해당 주차의 월요일 계산
  const mondayOffset = firstMondayOffset + (weekNumber - 1) * 7;

  const formatShortDate = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 월~일 (7일) 날짜 배열 생성
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(year, month - 1, 1 + mondayOffset + i);
    dates.push(formatShortDate(date));
  }

  return dates;
};
