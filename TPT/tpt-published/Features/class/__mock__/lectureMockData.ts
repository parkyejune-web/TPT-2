/**
 * ⚠️ MOCK DATA - 실제 API 연동 후 이 파일 전체 삭제 필요 ⚠️
 *
 * 강의 페이지 개발/테스트용 Mock 데이터
 */

import type { ChapterBlock, LectureData } from '../../../Shared/api/services/lectureService';

// ==================== Mock 강의 데이터 ====================

const mockRegularLectures: LectureData[] = [
  {
    lectureId: 1,
    chapterId: 1,
    title: '트레이딩을 할 준비가 되었는가?',
    content: '트레이딩 시작 전 반드시 알아야 할 기본 마인드셋과 준비사항',
    paid: false,
    thumbnailUrl: 'https://picsum.photos/seed/lecture1/640/360',
    durationSeconds: 900, // 15분
    tokenCost: 1,
    completed: false,
    progressPercent: 0,
  },
  {
    lectureId: 2,
    chapterId: 1,
    title: '매매일지부터 시작하자',
    content: '매매일지 작성의 중요성과 올바른 작성 방법',
    paid: false,
    thumbnailUrl: 'https://picsum.photos/seed/lecture2/640/360',
    durationSeconds: 1080, // 18분
    tokenCost: 1,
    completed: true,
    progressPercent: 100,
  },
  {
    lectureId: 3,
    chapterId: 1,
    title: '차트의 기본 구조 이해하기',
    content: '캔들스틱, 거래량, 시간프레임의 기초',
    paid: false,
    thumbnailUrl: 'https://picsum.photos/seed/lecture3/640/360',
    durationSeconds: 1320, // 22분
    tokenCost: 1,
    completed: false,
    progressPercent: 45,
  },
  {
    lectureId: 4,
    chapterId: 1,
    title: '리스크 관리의 기초',
    content: '손절의 중요성과 자금 관리 기본 원칙',
    paid: false,
    thumbnailUrl: 'https://picsum.photos/seed/lecture4/640/360',
    durationSeconds: 960, // 16분
    tokenCost: 1,
    completed: false,
    progressPercent: 0,
  },
  {
    lectureId: 5,
    chapterId: 2,
    title: '기술적 분석 지표 활용법',
    content: '이동평균선, RSI, MACD 등 주요 지표 해석',
    paid: false,
    thumbnailUrl: undefined,
    durationSeconds: 1500, // 25분
    tokenCost: 2,
    completed: false,
    progressPercent: 0,
  },
  {
    lectureId: 6,
    chapterId: 2,
    title: '패턴 인식과 매매 시그널',
    content: '차트 패턴을 활용한 진입/청산 타이밍 포착',
    paid: false,
    thumbnailUrl: undefined,
    durationSeconds: 1680, // 28분
    tokenCost: 2,
    completed: false,
    progressPercent: 20,
  },
  {
    lectureId: 7,
    chapterId: 2,
    title: '추세 분석 마스터',
    content: '상승/하락/횡보 추세 판단과 대응 전략',
    paid: false,
    thumbnailUrl: undefined,
    durationSeconds: 1440, // 24분
    tokenCost: 2,
    completed: false,
    progressPercent: 0,
  },
  {
    lectureId: 8,
    chapterId: 2,
    title: '지지와 저항의 실전 활용',
    content: '주요 가격대를 활용한 진입/청산 전략',
    paid: false,
    thumbnailUrl: undefined,
    durationSeconds: 1200, // 20분
    tokenCost: 2,
    completed: false,
    progressPercent: 0,
  },
];

const mockProLectures: LectureData[] = [
  {
    lectureId: 101,
    chapterId: 101,
    title: '백테스팅의 모든 것',
    content: '수천 번의 백테스팅으로 검증된 전략 수립 방법',
    paid: true,
    thumbnailUrl: 'https://picsum.photos/seed/lecture101/640/360',
    durationSeconds: 2400, // 40분
    tokenCost: 0, // Pro 회원은 무료
    completed: false,
    progressPercent: 0,
  },
  {
    lectureId: 102,
    chapterId: 101,
    title: '나만의 매매 전략 구축',
    content: '개인 성향에 맞는 트레이딩 시스템 설계',
    paid: true,
    thumbnailUrl: 'https://picsum.photos/seed/lecture102/640/360',
    durationSeconds: 3000, // 50분
    tokenCost: 0,
    completed: true,
    progressPercent: 100,
  },
  {
    lectureId: 103,
    chapterId: 101,
    title: '손절과 익절의 과학',
    content: 'R:R 비율 최적화와 감정 통제 기법',
    paid: true,
    thumbnailUrl: undefined,
    durationSeconds: 2700, // 45분
    tokenCost: 0,
    completed: false,
    progressPercent: 60,
  },
  {
    lectureId: 104,
    chapterId: 101,
    title: '포지션 사이징 전략',
    content: '계좌 크기별 최적 포지션 설정 방법',
    paid: true,
    thumbnailUrl: undefined,
    durationSeconds: 2100, // 35분
    tokenCost: 0,
    completed: false,
    progressPercent: 0,
  },
  {
    lectureId: 105,
    chapterId: 102,
    title: '스윙 트레이딩 고급 전략',
    content: '중장기 관점의 트렌드 추종 매매법',
    paid: true,
    thumbnailUrl: undefined,
    durationSeconds: 3600, // 60분
    tokenCost: 0,
    completed: false,
    progressPercent: 0,
  },
  {
    lectureId: 106,
    chapterId: 102,
    title: '데이 트레이딩 마스터',
    content: '당일 매매 타이밍 포착과 리스크 관리',
    paid: true,
    thumbnailUrl: undefined,
    durationSeconds: 3300, // 55분
    tokenCost: 0,
    completed: false,
    progressPercent: 30,
  },
  {
    lectureId: 107,
    chapterId: 102,
    title: '스캘핑 고급 테크닉',
    content: '초단타 매매의 실전 노하우와 심리 관리',
    paid: true,
    thumbnailUrl: undefined,
    durationSeconds: 2880, // 48분
    tokenCost: 0,
    completed: false,
    progressPercent: 0,
  },
  {
    lectureId: 108,
    chapterId: 103,
    title: '매매 심리학',
    content: '감정 통제와 객관적 판단력 향상 방법',
    paid: true,
    thumbnailUrl: undefined,
    durationSeconds: 2520, // 42분
    tokenCost: 0,
    completed: false,
    progressPercent: 0,
  },
  {
    lectureId: 109,
    chapterId: 103,
    title: '수익 관리와 출금 전략',
    content: '장기 수익 유지를 위한 자금 관리법',
    paid: true,
    thumbnailUrl: undefined,
    durationSeconds: 1800, // 30분
    tokenCost: 0,
    completed: false,
    progressPercent: 0,
  },
];

// ==================== Mock Chapter 블록 ====================

export const mockRegularChapters: ChapterBlock[] = [
  {
    chapterId: 1,
    chapterTitle: 'Chapter 01. 트레이딩 기초',
    description: '트레이딩을 시작하기 위한 필수 기초 지식',
    progressPercent: 36,
    chapterType: 'REGULAR',
    lectures: mockRegularLectures.filter(l => l.chapterId === 1),
  },
  {
    chapterId: 2,
    chapterTitle: 'Chapter 02. 기술적 분석',
    description: '차트와 지표를 활용한 매매 기법',
    progressPercent: 5,
    chapterType: 'REGULAR',
    lectures: mockRegularLectures.filter(l => l.chapterId === 2),
  },
];

export const mockProChapters: ChapterBlock[] = [
  {
    chapterId: 101,
    chapterTitle: 'Chapter 01. 올바른 트레이딩이란?',
    description: '데이터 기반의 체계적인 트레이딩 시스템 구축',
    progressPercent: 40,
    chapterType: 'PRO',
    lectures: mockProLectures.filter(l => l.chapterId === 101),
  },
  {
    chapterId: 102,
    chapterTitle: 'Chapter 02. 투자 유형별 전략',
    description: '스윙, 데이, 스캘핑 각각의 실전 전략',
    progressPercent: 10,
    chapterType: 'PRO',
    lectures: mockProLectures.filter(l => l.chapterId === 102),
  },
  {
    chapterId: 103,
    chapterTitle: 'Chapter 03. 수익 극대화',
    description: '장기 수익 유지를 위한 고급 기법',
    progressPercent: 0,
    chapterType: 'PRO',
    lectures: mockProLectures.filter(l => l.chapterId === 103),
  },
];

// ==================== Mock 강의 상세 데이터 ====================

export const mockLectureDetails: Record<number, any> = {
  // Case 1: 첨부파일 1개 + 과제 있음
  1: {
    lectureId: 1,
    chapterId: 1,
    title: '트레이딩을 할 준비가 되었는가?',
    content: '트레이딩 시작 전 반드시 알아야 할 기본 마인드셋과 준비사항을 다룹니다. 자금 관리, 심리적 준비, 시장에 대한 이해 등 성공적인 트레이딩을 위한 기초를 배웁니다.',
    paid: false,
    thumbnailUrl: 'https://picsum.photos/seed/lecture1/640/360',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    materials: [
      {
        fileId: 'mat-001',
        fileName: '트레이딩 준비 체크리스트.pdf',
        fileUrl: 'https://pdfobject.com/pdf/sample.pdf',
        fileSize: 2457600, // 2.4MB
        fileType: 'application/pdf',
      },
    ],
    hasAssignment: true,
    durationSeconds: 900,
    tokenCost: 1,
    completed: false,
    progressPercent: 0,
  },
  // Case 2: 첨부파일 여러개 + 과제 있음
  2: {
    lectureId: 2,
    chapterId: 1,
    title: '매매일지부터 시작하자',
    content: '매매일지 작성의 중요성과 올바른 작성 방법을 학습합니다. 자신의 매매 패턴을 분석하고 개선점을 찾는 방법을 배웁니다.',
    paid: false,
    thumbnailUrl: 'https://picsum.photos/seed/lecture2/640/360',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    materials: [
      {
        fileId: 'mat-002-1',
        fileName: '매매일지 템플릿.pdf',
        fileUrl: 'https://pdfobject.com/pdf/sample.pdf',
        fileSize: 1536000, // 1.5MB
        fileType: 'application/pdf',
      },
      {
        fileId: 'mat-002-2',
        fileName: '매매일지 작성 가이드.pdf',
        fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
        fileSize: 3145728, // 3MB
        fileType: 'application/pdf',
      },
      {
        fileId: 'mat-002-3',
        fileName: '매매일지 예시.xlsx',
        fileUrl: '#', // Excel file placeholder
        fileSize: 512000, // 500KB
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
    hasAssignment: true,
    durationSeconds: 1080,
    tokenCost: 1,
    completed: true,
    progressPercent: 100,
  },
  // Case 3: 첨부파일 없음 + 과제 없음
  3: {
    lectureId: 3,
    chapterId: 1,
    title: '차트의 기본 구조 이해하기',
    content: '캔들스틱, 거래량, 시간프레임의 기초',
    paid: false,
    thumbnailUrl: 'https://picsum.photos/seed/lecture3/640/360',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    materials: undefined,
    hasAssignment: false,
    durationSeconds: 1320,
    tokenCost: 1,
    completed: false,
    progressPercent: 45,
  },
  // Case 4: 첨부파일 여러개 + 과제 없음
  4: {
    lectureId: 4,
    chapterId: 1,
    title: '리스크 관리의 기초',
    content: '손절의 중요성과 자금 관리 기본 원칙',
    paid: false,
    thumbnailUrl: 'https://picsum.photos/seed/lecture4/640/360',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    materials: [
      {
        fileId: 'mat-004-1',
        fileName: '리스크 관리 전략.pdf',
        fileUrl: 'https://pdfobject.com/pdf/sample.pdf',
        fileSize: 2048000, // 2MB
        fileType: 'application/pdf',
      },
      {
        fileId: 'mat-004-2',
        fileName: '자금 관리 계산기.xlsx',
        fileUrl: '#',
        fileSize: 256000, // 250KB
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
    hasAssignment: false,
    durationSeconds: 960,
    tokenCost: 1,
    completed: false,
    progressPercent: 0,
  },
  // Case 5: Pro 강의 - 첨부파일 없음 + 과제 있음
  101: {
    lectureId: 101,
    chapterId: 101,
    title: '백테스팅의 모든 것',
    content: '수천 번의 백테스팅으로 검증된 전략 수립 방법을 배웁니다. 통계적으로 유의미한 결과를 도출하는 방법과 실전 적용 노하우를 학습합니다.',
    paid: true,
    thumbnailUrl: 'https://picsum.photos/seed/lecture101/640/360',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    materials: undefined,
    hasAssignment: true,
    durationSeconds: 2400,
    tokenCost: 0,
    completed: false,
    progressPercent: 0,
  },
  // Case 6: Pro 강의 - 첨부파일 여러개 + 과제 있음
  102: {
    lectureId: 102,
    chapterId: 101,
    title: '나만의 매매 전략 구축',
    content: '개인 성향에 맞는 트레이딩 시스템 설계',
    paid: true,
    thumbnailUrl: 'https://picsum.photos/seed/lecture102/640/360',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    materials: [
      {
        fileId: 'mat-102-1',
        fileName: '매매 전략 수립 가이드.pdf',
        fileUrl: 'https://pdfobject.com/pdf/sample.pdf',
        fileSize: 4194304, // 4MB
        fileType: 'application/pdf',
      },
      {
        fileId: 'mat-102-2',
        fileName: '백테스팅 데이터 샘플.csv',
        fileUrl: '#',
        fileSize: 1024000, // 1MB
        fileType: 'text/csv',
      },
      {
        fileId: 'mat-102-3',
        fileName: '전략 템플릿.xlsx',
        fileUrl: '#',
        fileSize: 768000, // 750KB
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
    hasAssignment: true,
    durationSeconds: 3000,
    tokenCost: 0,
    completed: true,
    progressPercent: 100,
  },
};
