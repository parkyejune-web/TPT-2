import { apiCall, getIsMockMode, mockData } from './base';
import type { ApiResponse } from './base';

// Types
export type ProblemType = 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'SUBJECTIVE';
export type AttemptStatus = 'SUBMITTED' | 'GRADING' | 'GRADED';

// 객관식 페이로드
export interface MultipleChoicePayload {
  choice1: string;
  choice2: string;
  choice3?: string;
  choice4?: string;
  choice5?: string;
}

// 텍스트 답변 페이로드 (단답형/서술형)
export interface TextAnswerPayload {
  answerText: string;
}

// 문제 상세 정보
export interface LevelTestQuestionDetail {
  questionId: number;
  content: string;
  score: number;
  problemType: ProblemType;
  imageUrl: string;
  multipleChoice?: MultipleChoicePayload;
  textAnswer?: TextAnswerPayload;
}

// 문제 목록 응답
export interface QuestionListResponse {
  content: LevelTestQuestionDetail[];
  sliceInfo: {
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    isFirst: boolean;
    isLast: boolean;
  };
}

// 객관식 문제 생성/수정 요청
export interface MultipleChoiceRequest {
  content: string;
  score: number;
  choice1: string;
  choice2: string;
  choice3?: string;
  choice4?: string;
  choice5?: string;
  correctChoiceNum: string; // "1,2" 형식
  problemType: ProblemType;
}

// 단답형/서술형 문제 생성/수정 요청
export interface TextAnswerRequest {
  content: string;
  score: number;
  answerText: string;
  problemType: ProblemType;
}

// 시도 목록 항목
export interface AdminLeveltestAttemptListItem {
  attemptId: number;
  customerName: string;
  totalScore: number;
  status: AttemptStatus;
  createdAt: string;
}

// 시도 목록 응답
export interface AttemptListResponse {
  content: AdminLeveltestAttemptListItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 문항별 응답 정보
export interface QuestionResponse {
  questionId: number;
  responseId: number;
  content: string;
  problemType: ProblemType;
  imageUrl?: string;
  choices?: string[];
  choiceNumber?: string;
  answerText?: string;
  scoreAwarded: number;
  maxScore: number;
}

// 시도 상세 응답
export interface AttemptDetailResponse {
  attemptId: number;
  totalScore: number;
  grade?: string;
  customerId: number;
  customerName: string;
  responses: QuestionResponse[];
}

// 채점 요청 DTO
export interface QuestionGrade {
  questionId: number;
  responseId: number;
  score: number;
}

export interface GradeRequest {
  questionGrades: QuestionGrade[];
}

// ===== 문제 관리 API =====

// 문제 전체 조회 (무한 스크롤)
export async function getQuestions(params?: {
  page?: number;
  size?: number;
}): Promise<ApiResponse<QuestionListResponse>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: {
              content: [
                {
                  questionId: 1,
                  content: '다음 중 RSI 지표의 설명으로 옳은 것은?',
                  score: 5,
                  problemType: 'MULTIPLE_CHOICE',
                  imageUrl: '',
                  multipleChoice: {
                    choice1: '과매수/과매도 판단 지표',
                    choice2: '거래량 지표',
                    choice3: '추세 지표',
                    choice4: '변동성 지표',
                  },
                },
                {
                  questionId: 2,
                  content: '이동평균선이란 무엇인가?',
                  score: 3,
                  problemType: 'SHORT_ANSWER',
                  imageUrl: '',
                  textAnswer: {
                    answerText: '일정 기간 동안의 주가 평균값을 선으로 연결한 것',
                  },
                },
                {
                  questionId: 3,
                  content: '기술적 분석과 기본적 분석의 차이점을 서술하시오.',
                  score: 10,
                  problemType: 'SUBJECTIVE',
                  imageUrl: '',
                  textAnswer: {
                    answerText:
                      '기술적 분석은 차트와 지표를 통해 분석하며, 기본적 분석은 기업의 재무제표와 경제 지표를 분석합니다.',
                  },
                },
              ],
              sliceInfo: {
                currentPage: 0,
                pageSize: 20,
                hasNext: false,
                isFirst: true,
                isLast: true,
              },
            },
          }),
        300
      )
    );
  }

  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', String(params.page));
  if (params?.size !== undefined) queryParams.append('size', String(params.size));

  const query = queryParams.toString();
  return apiCall<QuestionListResponse>(
    `/api/v1/admin/leveltests${query ? `?${query}` : ''}`,
    {
      method: 'GET',
    }
  );
}

// 문제 상세 조회
export async function getQuestionDetail(
  questionId: number
): Promise<ApiResponse<LevelTestQuestionDetail>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: {
              questionId: questionId,
              content: 'Mock 문제 내용입니다.',
              score: 5,
              problemType: 'MULTIPLE_CHOICE',
              imageUrl: '',
              multipleChoice: {
                choice1: '선택지 1',
                choice2: '선택지 2',
                choice3: '선택지 3',
                choice4: '선택지 4',
              },
            },
          }),
        300
      )
    );
  }

  return apiCall<LevelTestQuestionDetail>(`/api/v1/admin/leveltests/${questionId}`, {
    method: 'GET',
  });
}

// 문제 삭제
export async function deleteQuestion(questionId: number): Promise<ApiResponse<void>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: undefined,
          }),
        300
      )
    );
  }

  return apiCall<void>(`/api/v1/admin/leveltests/${questionId}`, {
    method: 'DELETE',
  });
}

// 객관식 문제 생성 (multipart)
export async function createMultipleChoice(
  data: MultipleChoiceRequest,
  image?: File
): Promise<ApiResponse<number>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: Math.floor(Math.random() * 1000),
          }),
        300
      )
    );
  }

  const formData = new FormData();
  formData.append('content', data.content);
  formData.append('score', String(data.score));
  formData.append('choice1', data.choice1);
  formData.append('choice2', data.choice2);
  if (data.choice3) formData.append('choice3', data.choice3);
  if (data.choice4) formData.append('choice4', data.choice4);
  if (data.choice5) formData.append('choice5', data.choice5);
  formData.append('correctChoiceNum', data.correctChoiceNum);
  formData.append('problemType', data.problemType);
  if (image) formData.append('image', image);

  return apiCall<number>('/api/v1/admin/leveltests/multiple-choice', {
    method: 'POST',
    body: formData,
    isMultipart: true,
  });
}

// 객관식 문제 수정 (multipart)
export async function updateMultipleChoice(
  questionId: number,
  data: MultipleChoiceRequest,
  image?: File
): Promise<ApiResponse<number>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: questionId,
          }),
        300
      )
    );
  }

  const formData = new FormData();
  formData.append('content', data.content);
  formData.append('score', String(data.score));
  formData.append('choice1', data.choice1);
  formData.append('choice2', data.choice2);
  if (data.choice3) formData.append('choice3', data.choice3);
  if (data.choice4) formData.append('choice4', data.choice4);
  if (data.choice5) formData.append('choice5', data.choice5);
  formData.append('correctChoiceNum', data.correctChoiceNum);
  formData.append('problemType', data.problemType);
  if (image) formData.append('image', image);

  return apiCall<number>(`/api/v1/admin/leveltests/multiple-choice/${questionId}`, {
    method: 'PUT',
    body: formData,
    isMultipart: true,
  });
}

// 단답형 문제 생성 (multipart)
export async function createShortAnswer(
  data: TextAnswerRequest,
  image?: File
): Promise<ApiResponse<number>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: Math.floor(Math.random() * 1000),
          }),
        300
      )
    );
  }

  const formData = new FormData();
  formData.append('content', data.content);
  formData.append('score', String(data.score));
  formData.append('answerText', data.answerText);
  formData.append('problemType', data.problemType);
  if (image) formData.append('image', image);

  return apiCall<number>('/api/v1/admin/leveltests/short-answer', {
    method: 'POST',
    body: formData,
    isMultipart: true,
  });
}

// 단답형 문제 수정 (multipart)
export async function updateShortAnswer(
  questionId: number,
  data: TextAnswerRequest,
  image?: File
): Promise<ApiResponse<number>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: questionId,
          }),
        300
      )
    );
  }

  const formData = new FormData();
  formData.append('content', data.content);
  formData.append('score', String(data.score));
  formData.append('answerText', data.answerText);
  formData.append('problemType', data.problemType);
  if (image) formData.append('image', image);

  return apiCall<number>(`/api/v1/admin/leveltests/short-answer/${questionId}`, {
    method: 'PUT',
    body: formData,
    isMultipart: true,
  });
}

// 서술형 문제 생성 (multipart)
export async function createSubjective(
  data: TextAnswerRequest,
  image?: File
): Promise<ApiResponse<number>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: Math.floor(Math.random() * 1000),
          }),
        300
      )
    );
  }

  const formData = new FormData();
  formData.append('content', data.content);
  formData.append('score', String(data.score));
  formData.append('answerText', data.answerText);
  formData.append('problemType', data.problemType);
  if (image) formData.append('image', image);

  return apiCall<number>('/api/v1/admin/leveltests/subjective', {
    method: 'POST',
    body: formData,
    isMultipart: true,
  });
}

// 서술형 문제 수정 (multipart)
export async function updateSubjective(
  questionId: number,
  data: TextAnswerRequest,
  image?: File
): Promise<ApiResponse<number>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: questionId,
          }),
        300
      )
    );
  }

  const formData = new FormData();
  formData.append('content', data.content);
  formData.append('score', String(data.score));
  formData.append('answerText', data.answerText);
  formData.append('problemType', data.problemType);
  if (image) formData.append('image', image);

  return apiCall<number>(`/api/v1/admin/leveltests/subjective/${questionId}`, {
    method: 'PUT',
    body: formData,
    isMultipart: true,
  });
}

// ===== 시도 관리 API =====

// 레벨테스트 시도 목록 조회 (상태별)
export async function getAttempts(params?: {
  status?: AttemptStatus;
  page?: number;
  size?: number;
}): Promise<ApiResponse<AttemptListResponse>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: {
              content: [
                {
                  attemptId: 1,
                  customerName: '김철수',
                  totalScore: 85,
                  status: 'GRADED',
                  createdAt: '2025-01-15T10:30:00',
                },
                {
                  attemptId: 2,
                  customerName: '이영희',
                  totalScore: 70,
                  status: 'GRADING',
                  createdAt: '2025-01-16T14:20:00',
                },
                {
                  attemptId: 3,
                  customerName: '박민준',
                  totalScore: 0,
                  status: 'SUBMITTED',
                  createdAt: '2025-01-17T09:15:00',
                },
              ],
              totalElements: 3,
              totalPages: 1,
              size: 20,
              number: 0,
            },
          }),
        300
      )
    );
  }

  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page !== undefined) queryParams.append('page', String(params.page));
  if (params?.size !== undefined) queryParams.append('size', String(params.size));

  const query = queryParams.toString();
  return apiCall<AttemptListResponse>(
    `/api/v1/admin/leveltests/attempts${query ? `?${query}` : ''}`,
    {
      method: 'GET',
    }
  );
}

// 레벨테스트 시도 상세 조회
export async function getAttemptDetail(
  attemptId: number
): Promise<ApiResponse<AttemptDetailResponse>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: {
              attemptId: attemptId,
              totalScore: 85,
              grade: 'A',
              customerId: 1,
              customerName: '김철수',
              responses: [
                {
                  questionId: 1,
                  responseId: 101,
                  content: '다음 중 RSI 지표의 설명으로 옳은 것은?',
                  problemType: 'MULTIPLE_CHOICE',
                  imageUrl: '',
                  choices: ['과매수/과매도 판단 지표', '거래량 지표', '추세 지표', '변동성 지표'],
                  choiceNumber: '1',
                  scoreAwarded: 5,
                  maxScore: 5,
                },
                {
                  questionId: 2,
                  responseId: 102,
                  content: '이동평균선이란 무엇인가?',
                  problemType: 'SHORT_ANSWER',
                  answerText: '일정 기간의 주가 평균',
                  scoreAwarded: 0,
                  maxScore: 3,
                },
                {
                  questionId: 3,
                  responseId: 103,
                  content: '기술적 분석과 기본적 분석의 차이점을 서술하시오.',
                  problemType: 'SUBJECTIVE',
                  answerText: '기술적 분석은 차트를 보고...',
                  scoreAwarded: 0,
                  maxScore: 10,
                },
              ],
            },
          }),
        300
      )
    );
  }

  return apiCall<AttemptDetailResponse>(`/api/v1/admin/leveltests/attempts/${attemptId}`, {
    method: 'GET',
  });
}

// 수동 채점 반영
export async function gradeAttempt(
  attemptId: number,
  grades: QuestionGrade[]
): Promise<ApiResponse<void>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: undefined,
          }),
        300
      )
    );
  }

  const requestBody: GradeRequest = {
    questionGrades: grades,
  };

  return apiCall<void>(`/api/v1/admin/leveltests/attempts/${attemptId}/grade`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
}

// ===== 유틸리티 함수 =====

export function getProblemTypeLabel(type: ProblemType): string {
  const labels: Record<ProblemType, string> = {
    MULTIPLE_CHOICE: '객관식',
    SHORT_ANSWER: '단답형',
    SUBJECTIVE: '서술형',
  };
  return labels[type] || type;
}

export function getAttemptStatusLabel(status: AttemptStatus): string {
  const labels: Record<AttemptStatus, string> = {
    SUBMITTED: '제출됨',
    GRADING: '채점 중',
    GRADED: '채점 완료',
  };
  return labels[status] || status;
}

export function getAttemptStatusColor(status: AttemptStatus): string {
  const colors: Record<AttemptStatus, string> = {
    SUBMITTED: 'bg-blue-100 text-blue-800',
    GRADING: 'bg-yellow-100 text-yellow-800',
    GRADED: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
