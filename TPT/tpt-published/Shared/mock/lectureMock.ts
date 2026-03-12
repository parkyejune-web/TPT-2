/**
 * 강의 Mock 데이터
 * 실제 API가 데이터를 반환하면 자동으로 실제 데이터 사용
 *
 * 사용법:
 * - USE_MOCK_DATA를 true로 설정하면 mock 데이터 사용
 * - false로 설정하면 실제 API 데이터만 사용
 * - 'fallback'으로 설정하면 API가 빈 배열 반환 시에만 mock 사용
 */

import type { ChapterBlock } from '../api/services/lectureService';

// Mock 사용 설정: true | false | 'fallback'
// 'fallback': API가 빈 배열 반환 시에만 mock 사용
// true: Mock 데이터 사용
// false: 실제 API 데이터만 사용 (현재 설정)
export const USE_MOCK_DATA: boolean | 'fallback' = false;

/**
 * REGULAR 타입 강의 Mock 데이터
 */
export const MOCK_REGULAR_CHAPTERS: ChapterBlock[] = [
  {
    chapterId: 1001,
    chapterTitle: '트레이딩의 기초',
    description: '트레이딩을 시작하기 전 반드시 알아야 할 기본 개념들을 학습합니다.',
    progressPercent: 0,
    chapterType: 'REGULAR',
    lectures: [
      {
        lectureId: 10001,
        chapterId: 1001,
        title: '트레이딩이란 무엇인가',
        content: '트레이딩의 정의와 투자와의 차이점을 이해합니다.',
        paid: false,
        thumbnailUrl: '/images/lecture_thumb_1.png',
        durationSeconds: 1200,
        requiredTokens: 0,
        tokenCost: 3,
        completed: false,
        progressPercent: 0,
      },
      {
        lectureId: 10002,
        chapterId: 1001,
        title: '차트 분석의 기본',
        content: '캔들 차트를 읽는 방법과 기본적인 패턴을 학습합니다.',
        paid: false,
        thumbnailUrl: '/images/lecture_thumb_2.png',
        durationSeconds: 1800,
        requiredTokens: 0,
        tokenCost: 2,
        completed: false,
        progressPercent: 0,
      },
      {
        lectureId: 10003,
        chapterId: 1001,
        title: '리스크 관리의 중요성',
        content: '성공적인 트레이딩을 위한 리스크 관리 전략을 배웁니다.',
        paid: false,
        thumbnailUrl: '/images/lecture_thumb_3.png',
        durationSeconds: 1500,
        requiredTokens: 1,
        tokenCost: 1,
        completed: false,
        progressPercent: 0,
      },
    ],
  },
  {
    chapterId: 1002,
    chapterTitle: '기술적 분석',
    description: '차트와 지표를 활용한 기술적 분석 방법을 심도있게 학습합니다.',
    progressPercent: 0,
    chapterType: 'REGULAR',
    lectures: [
      {
        lectureId: 10004,
        chapterId: 1002,
        title: '이동평균선 활용법',
        content: 'MA, EMA 등 이동평균선을 활용한 추세 분석 방법을 학습합니다.',
        paid: false,
        thumbnailUrl: '/images/lecture_thumb_4.png',
        durationSeconds: 2100,
        requiredTokens: 1,
        tokenCost: 1,
        completed: false,
        progressPercent: 0,
      },
      {
        lectureId: 10005,
        chapterId: 1002,
        title: 'RSI와 MACD 지표',
        content: '모멘텀 지표를 활용한 매매 타이밍 포착 방법을 배웁니다.',
        paid: false,
        thumbnailUrl: '/images/lecture_thumb_5.png',
        durationSeconds: 1950,
        requiredTokens: 1,
        tokenCost: 1,
        completed: false,
        progressPercent: 0,
      },
      {
        lectureId: 10006,
        chapterId: 1002,
        title: '지지와 저항',
        content: '핵심 가격대를 찾고 활용하는 방법을 학습합니다.',
        paid: false,
        thumbnailUrl: '/images/lecture_thumb_6.png',
        durationSeconds: 1650,
        requiredTokens: 1,
        tokenCost: 1,
        completed: false,
        progressPercent: 0,
      },
    ],
  },
  {
    chapterId: 1003,
    chapterTitle: '실전 매매 전략',
    description: '실제 시장에서 적용할 수 있는 매매 전략을 학습합니다.',
    progressPercent: 0,
    chapterType: 'REGULAR',
    lectures: [
      {
        lectureId: 10007,
        chapterId: 1003,
        title: '스윙 트레이딩 전략',
        content: '중기적 관점의 스윙 트레이딩 전략을 학습합니다.',
        paid: false,
        thumbnailUrl: '/images/lecture_thumb_7.png',
        durationSeconds: 2400,
        requiredTokens: 2,
        tokenCost: 2,
        completed: false,
        progressPercent: 0,
      },
      {
        lectureId: 10008,
        chapterId: 1003,
        title: '데이 트레이딩 기법',
        content: '일중 매매에 필요한 기법과 주의사항을 배웁니다.',
        paid: false,
        thumbnailUrl: '/images/lecture_thumb_8.png',
        durationSeconds: 2700,
        requiredTokens: 2,
        tokenCost: 2,
        completed: false,
        progressPercent: 0,
      },
    ],
  },
];

/**
 * PRO 타입 강의 Mock 데이터
 */
export const MOCK_PRO_CHAPTERS: ChapterBlock[] = [
  {
    chapterId: 2001,
    chapterTitle: '고급 백테스팅',
    description: '수천 번의 백테스팅 결과를 기반으로 한 실전 전략을 공개합니다.',
    progressPercent: 0,
    chapterType: 'PRO',
    lectures: [
      {
        lectureId: 20001,
        chapterId: 2001,
        title: '백테스팅 환경 구축',
        content: '정확한 백테스팅을 위한 환경 설정 방법을 학습합니다.',
        paid: true,
        thumbnailUrl: '/images/lecture_thumb_pro_1.png',
        durationSeconds: 3600,
        requiredTokens: 0,
        tokenCost: 0,
        completed: false,
        progressPercent: 0,
      },
      {
        lectureId: 20002,
        chapterId: 2001,
        title: '전략 검증 방법론',
        content: '트레이딩 전략의 유효성을 검증하는 체계적인 방법을 배웁니다.',
        paid: true,
        thumbnailUrl: '/images/lecture_thumb_pro_2.png',
        durationSeconds: 4200,
        requiredTokens: 0,
        tokenCost: 0,
        completed: false,
        progressPercent: 0,
      },
    ],
  },
  {
    chapterId: 2002,
    chapterTitle: '매매일지 노하우',
    description: '프로 트레이더의 매매일지 작성 및 분석 노하우를 전수합니다.',
    progressPercent: 0,
    chapterType: 'PRO',
    lectures: [
      {
        lectureId: 20003,
        chapterId: 2002,
        title: '효과적인 매매일지 작성법',
        content: '실력 향상에 직결되는 매매일지 작성 방법을 학습합니다.',
        paid: true,
        thumbnailUrl: '/images/lecture_thumb_pro_3.png',
        durationSeconds: 2700,
        requiredTokens: 0,
        tokenCost: 0,
        completed: false,
        progressPercent: 0,
      },
      {
        lectureId: 20004,
        chapterId: 2002,
        title: '매매일지 분석과 개선',
        content: '작성한 매매일지를 분석하여 실력을 개선하는 방법을 배웁니다.',
        paid: true,
        thumbnailUrl: '/images/lecture_thumb_pro_4.png',
        durationSeconds: 3000,
        requiredTokens: 0,
        tokenCost: 0,
        completed: false,
        progressPercent: 0,
      },
    ],
  },
];

/**
 * 전체 Mock 챕터 반환
 */
export function getMockChapters(): ChapterBlock[] {
  return [...MOCK_REGULAR_CHAPTERS, ...MOCK_PRO_CHAPTERS];
}

/**
 * Mock 데이터 적용 여부 판단 및 데이터 반환
 * @param apiData API에서 반환된 데이터
 * @param type 챕터 타입 ('REGULAR' | 'PRO' | 'ALL')
 * @returns 사용할 챕터 데이터
 */
export function applyMockDataIfNeeded(
  apiData: ChapterBlock[],
  type: 'REGULAR' | 'PRO' | 'ALL' = 'ALL'
): ChapterBlock[] {
  // Mock 사용 안함
  if (USE_MOCK_DATA === false) {
    return apiData;
  }

  // 항상 Mock 사용
  if (USE_MOCK_DATA === true) {
    if (type === 'REGULAR') return MOCK_REGULAR_CHAPTERS;
    if (type === 'PRO') return MOCK_PRO_CHAPTERS;
    return getMockChapters();
  }

  // Fallback 모드: API 데이터가 비어있을 때만 Mock 사용
  if (USE_MOCK_DATA === 'fallback') {
    if (type === 'ALL') {
      return apiData.length > 0 ? apiData : getMockChapters();
    }

    const filteredApiData = apiData.filter(ch => ch.chapterType === type);
    if (filteredApiData.length > 0) {
      return filteredApiData;
    }

    // API 데이터가 비어있으면 Mock 반환
    return type === 'REGULAR' ? MOCK_REGULAR_CHAPTERS : MOCK_PRO_CHAPTERS;
  }

  return apiData;
}
