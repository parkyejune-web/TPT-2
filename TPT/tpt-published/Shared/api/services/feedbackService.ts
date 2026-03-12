/**
 * 피드백 요청 관련 API 서비스
 */

import { fetcher } from '../apiInstance';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  WeeklyProfitFeedbackListResponse,
  WeeklyLossFeedbackListResponse,
  MonthlyPnlCalendarResponseDTO,
  UpdateFeedbackRequestDTO,
  FeedbackScreenShotAttachmentDTO
} from '../apiTypes';

/**
 * 피드백 요청 생성 (DAY/SWING 통합 API)
 * 2025-11-28 기준 새로운 통합 API
 */
export const createFeedback = async (data: FormData): Promise<ApiResponse<any>> => {
  console.log('[createFeedback] 통합 API 피드백 요청 시작');
  const response = await fetcher<any>(API_ENDPOINTS.FEEDBACK_REQUEST.CREATE, {
    method: 'POST',
    body: data,
    // FormData는 자동으로 Content-Type 설정되므로 headers 생략
  });
  console.log('[createFeedback] 응답:', response);
  return response;
};

/**
 * @deprecated 스윙 피드백 요청 생성 - 통합 API(createFeedback) 사용 권장
 */
export const createSwingFeedback = async (data: FormData): Promise<ApiResponse<any>> => {
  console.log('[createSwingFeedback] deprecated API 호출 - createFeedback 사용 권장');
  return fetcher<any>(API_ENDPOINTS.FEEDBACK_REQUEST.CREATE_SWING, {
    method: 'POST',
    body: data,
    // FormData는 자동으로 Content-Type 설정되므로 headers 생략
  });
};

/**
 * @deprecated 데이 트레이딩 피드백 요청 생성 - 통합 API(createFeedback) 사용 권장
 */
export const createDayFeedback = async (data: FormData): Promise<ApiResponse<any>> => {
  console.log('[createDayFeedback] deprecated API 호출 - createFeedback 사용 권장');
  return fetcher<any>(API_ENDPOINTS.FEEDBACK_REQUEST.CREATE_DAY, {
    method: 'POST',
    body: data,
  });
};

/**
 * @deprecated 스켈핑 피드백 요청 생성 - 스켈핑 투자 유형이 삭제되어 더 이상 사용되지 않음
 */
export const createScalpingFeedback = async (data: FormData): Promise<ApiResponse<any>> => {
  console.log('[createScalpingFeedback] deprecated API 호출 - 스켈핑 투자 유형 삭제됨');
  return fetcher<any>(API_ENDPOINTS.FEEDBACK_REQUEST.CREATE_SCALPING, {
    method: 'POST',
    body: data,
  });
};

// ==================== 타입 정의 ====================

/**
 * 트레이너 작성 매매일지 아이템
 */
export interface TrainerWrittenFeedbackItem {
  id: number;
  investmentType: 'SWING' | 'DAY' | 'SCALPING';
  title: string;
  tradingReview: string;
  trainerName: string;
  pnl: number;
  imageUrls: string[];
  createdAt: string;
}

/**
 * 트레이너 작성 매매일지 목록 응답
 */
export interface TrainerWrittenFeedbackListResponse {
  feedbacks: TrainerWrittenFeedbackItem[];
  sliceInfo: {
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * 피드백 카드 DTO (실시간 트레이딩 목록용)
 */
export interface FeedbackCardItem {
  feedbackRequestId: number;
  title: string;
  contentPreview: string;
  createdAt: string;
  investmentType: 'SWING' | 'DAY' | 'SCALPING';
  courseStatus: 'BEFORE_COMPLETION' | 'PENDING_COMPLETION' | 'AFTER_COMPLETION';
  status: 'FR' | 'FN' | 'N';
  isBestFeedback: boolean;
  customerName: string;
  imageUrls?: string[];
  totalAssetPnl?: number;
}

/**
 * 실시간 트레이딩 목록 응답
 */
export interface FeedbackListResponse {
  feedbacks: FeedbackCardItem[];
  sliceInfo: {
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * 트레이너 정보 DTO
 */
export interface TrainerDTO {
  trainerId: number;
  profileImageUrl?: string;
  trainerName: string;
}

/**
 * 피드백 응답 DTO (트레이너 피드백)
 */
export interface FeedbackResponseDTO {
  id: number;
  title?: string;
  submittedAt: string;
  trainer: TrainerDTO;
  content: string; // HTML 형식일 수 있음
}

/**
 * 피드백 상세 조회 응답 - 공통 기본 필드
 */
export interface FeedbackDetailBase {
  id: number;
  createdAt: string;
  updatedAt: string;
  investmentType: 'SWING' | 'DAY' | 'SCALPING';
  courseStatus: 'BEFORE_COMPLETION' | 'PENDING_COMPLETION' | 'AFTER_COMPLETION';
  feedbackRequestDate: string;
  status: 'FR' | 'FN' | 'N';
  feedbackYear: number;
  feedbackMonth: number;
  feedbackWeek: number;
  isBestFeedback: boolean;
  category: string;
  /** @deprecated 구버전 응답 호환용 - screenshotImages 사용 권장 */
  screenshotImageUrls?: string[];
  /** 스크린샷 이미지 목록 (imageId, imageUrl 포함) */
  screenshotImages?: FeedbackScreenShotAttachmentDTO[];
  riskTaking: number;
  leverage: number;
  position: 'LONG' | 'SHORT';
  positionStartReason?: string;
  positionEndReason?: string;
  trainerFeedbackRequestContent?: string;
  pnl: number;
  totalAssetPnl?: number;
  rnr?: number;
  tradingReview?: string;
  feedbackResponse?: FeedbackResponseDTO;
  // 멤버십 정보 (API 응답에 포함될 수 있음)
  membershipLevel?: 'BASIC' | 'PREMIUM';
  // 고객 정보 (권한 체크용)
  customerId?: number;
  customerName?: string;
}

/**
 * 스윙 피드백 상세 조회 응답
 */
export interface SwingFeedbackDetail extends FeedbackDetailBase {
  investmentType: 'SWING';
  positionHoldingTime?: string;
  positionStartDate?: string;
  positionEndDate?: string;
  directionFrameExists?: boolean;
  directionFrame?: string;
  mainFrame?: string;
  subFrame?: string;
  trendAnalysis?: string;
  entryPoint1?: 'REVERSE' | 'PULL_BACK' | 'BREAK_OUT';
  entryPoint2?: string;
  entryPoint3?: string;
  grade?: 'S_PLUS' | 'S' | 'A' | 'B' | 'NONE';
  additionalBuyCount?: number;
  splitSellCount?: number;
}

/**
 * 데이 피드백 상세 조회 응답
 */
export interface DayFeedbackDetail extends FeedbackDetailBase {
  investmentType: 'DAY';
  positionHoldingTime?: string;
  positionStartDate?: string;
  positionEndDate?: string;
  directionFrameExists?: boolean;
  directionFrame?: string;
  mainFrame?: string;
  subFrame?: string;
  trendAnalysis?: string;
  entryPoint?: 'REVERSE' | 'PULL_BACK' | 'BREAK_OUT';
  grade?: 'S_PLUS' | 'S' | 'A' | 'B' | 'NONE';
  additionalBuyCount?: number;
  splitSellCount?: number;
}

/**
 * 스캘핑 피드백 상세 조회 응답
 */
export interface ScalpingFeedbackDetail extends FeedbackDetailBase {
  investmentType: 'SCALPING';
  positionHoldingTime?: string;
  operatingFundsRatio?: number;
  entryPrice?: number;
  exitPrice?: number;
  settingStopLoss?: number;
  settingTakeProfit?: number;
}

/**
 * 피드백 상세 조회 응답 (유니온 타입)
 */
export type FeedbackDetailResponse = SwingFeedbackDetail | DayFeedbackDetail | ScalpingFeedbackDetail;

// ==================== API 함수 ====================

/**
 * 피드백 목록 조회 (무한 스크롤) - 실시간 트레이딩
 */
export const getFeedbackList = async (page: number = 0, size: number = 20): Promise<ApiResponse<FeedbackListResponse>> => {
  console.log(`[getFeedbackList] 요청 - page: ${page}, size: ${size}`);
  const response = await fetcher<FeedbackListResponse>(`${API_ENDPOINTS.FEEDBACK_REQUEST.LIST}?page=${page}&size=${size}`, {
    method: 'GET',
  });
  console.log(`[getFeedbackList] 응답:`, response);
  return response;
};

/**
 * 트레이너 작성 매매일지 조회 (무한 스크롤)
 */
export const getTrainerWrittenFeedbacks = async (page: number = 0, size: number = 12): Promise<ApiResponse<TrainerWrittenFeedbackListResponse>> => {
  console.log(`[getTrainerWrittenFeedbacks] 요청 - page: ${page}, size: ${size}`);
  const response = await fetcher<TrainerWrittenFeedbackListResponse>(`${API_ENDPOINTS.FEEDBACK_REQUEST.TRAINER_WRITTEN}?page=${page}&size=${size}`, {
    method: 'GET',
  });
  console.log(`[getTrainerWrittenFeedbacks] 응답:`, response);
  return response;
};

/**
 * 피드백 상세 조회
 */
export const getFeedbackDetail = async (feedbackRequestId: number): Promise<ApiResponse<FeedbackDetailResponse>> => {
  console.log(`[getFeedbackDetail] 요청 - feedbackRequestId: ${feedbackRequestId}`);
  const response = await fetcher<FeedbackDetailResponse>(API_ENDPOINTS.FEEDBACK_REQUEST.DETAIL(feedbackRequestId), {
    method: 'GET',
  });
  console.log(`[getFeedbackDetail] 응답:`, response);
  return response;
};

/**
 * 피드백 삭제
 */
export const deleteFeedback = async (feedbackRequestId: number): Promise<ApiResponse<void>> => {
  console.log(`[deleteFeedback] 요청 - feedbackRequestId: ${feedbackRequestId}`);
  const response = await fetcher<void>(API_ENDPOINTS.FEEDBACK_REQUEST.DELETE(feedbackRequestId), {
    method: 'DELETE',
  });
  console.log(`[deleteFeedback] 응답:`, response);
  return response;
};

/**
 * 피드백 수정 (FormData 방식)
 * 주의: 피드백 답변이 완료된 요청은 수정할 수 없음 (COMPLETED_FEEDBACK_UPDATE_NOT_ALLOWED 에러)
 *
 * @param feedbackRequestId - 수정할 피드백 요청 ID
 * @param data - 수정 데이터 (screenshotFiles: 추가할 이미지, deleteAttachmentIds: 삭제할 이미지 ID)
 */
export const updateFeedback = async (
  feedbackRequestId: number,
  data: UpdateFeedbackRequestDTO
): Promise<ApiResponse<FeedbackDetailResponse>> => {
  console.log(`[updateFeedback] 요청 - feedbackRequestId: ${feedbackRequestId}`);
  console.log(`[updateFeedback] 요청 데이터:`, data);

  // FormData 생성
  const formData = new FormData();

  // 필수 필드 추가
  formData.append('category', data.category);
  formData.append('position', data.position);
  formData.append('pnl', String(data.pnl));
  formData.append('totalAssetPnl', String(data.totalAssetPnl));
  formData.append('rnr', String(data.rnr));
  formData.append('riskTaking', String(data.riskTaking));
  formData.append('leverage', String(data.leverage));
  formData.append('operatingFundsRatio', String(data.operatingFundsRatio));
  formData.append('entryPrice', String(data.entryPrice));
  formData.append('exitPrice', String(data.exitPrice));
  formData.append('settingStopLoss', String(data.settingStopLoss));

  // 선택 필드 추가 (값이 있을 경우만)
  if (data.settingTakeProfit !== undefined) {
    formData.append('settingTakeProfit', String(data.settingTakeProfit));
  }
  if (data.positionHoldingTime) {
    formData.append('positionHoldingTime', data.positionHoldingTime);
  }
  if (data.positionStartReason) {
    formData.append('positionStartReason', data.positionStartReason);
  }
  if (data.positionEndReason) {
    formData.append('positionEndReason', data.positionEndReason);
  }
  if (data.tradingReview) {
    formData.append('tradingReview', data.tradingReview);
  }
  if (data.directionFrameExists !== undefined) {
    formData.append('directionFrameExists', String(data.directionFrameExists));
  }
  if (data.directionFrame) {
    formData.append('directionFrame', data.directionFrame);
  }
  if (data.mainFrame) {
    formData.append('mainFrame', data.mainFrame);
  }
  if (data.subFrame) {
    formData.append('subFrame', data.subFrame);
  }
  if (data.trendAnalysis) {
    formData.append('trendAnalysis', data.trendAnalysis);
  }
  if (data.trainerFeedbackRequestContent) {
    formData.append('trainerFeedbackRequestContent', data.trainerFeedbackRequestContent);
  }
  if (data.entryPoint) {
    formData.append('entryPoint', data.entryPoint);
  }
  if (data.grade) {
    formData.append('grade', data.grade);
  }
  if (data.additionalBuyCount !== undefined) {
    formData.append('additionalBuyCount', String(data.additionalBuyCount));
  }
  if (data.splitSellCount !== undefined) {
    formData.append('splitSellCount', String(data.splitSellCount));
  }
  if (data.positionStartDate) {
    formData.append('positionStartDate', data.positionStartDate);
  }
  if (data.positionEndDate) {
    formData.append('positionEndDate', data.positionEndDate);
  }

  // 삭제할 이미지 ID 목록 추가
  if (data.deleteAttachmentIds && data.deleteAttachmentIds.length > 0) {
    data.deleteAttachmentIds.forEach((id) => {
      formData.append('deleteAttachmentIds', String(id));
    });
    console.log(`[updateFeedback] 삭제할 이미지 ID:`, data.deleteAttachmentIds);
  }

  // 추가할 이미지 파일 추가
  if (data.screenshotFiles && data.screenshotFiles.length > 0) {
    data.screenshotFiles.forEach((file) => {
      formData.append('screenshotFiles', file);
    });
    console.log(`[updateFeedback] 추가할 이미지 파일 수:`, data.screenshotFiles.length);
  }

  const response = await fetcher<FeedbackDetailResponse>(
    API_ENDPOINTS.FEEDBACK_REQUEST.UPDATE(feedbackRequestId),
    {
      method: 'PUT',
      body: formData,
      // FormData는 자동으로 Content-Type 설정되므로 headers 생략
    }
  );
  console.log(`[updateFeedback] 응답:`, response);
  return response;
};

/**
 * 특정 날짜의 피드백 요청 목록 조회
 */
export const getFeedbackByDate = async (
  year: number,
  month: number,
  day: number
): Promise<ApiResponse<any>> => {
  return fetcher<any>(API_ENDPOINTS.FEEDBACK_REQUEST.BY_DATE(year, month, day), {
    method: 'GET',
  });
};

/**
 * 월별 PnL 달력 조회
 */
export const getPnLCalendar = async (
  year: number,
  month: number
): Promise<ApiResponse<MonthlyPnlCalendarResponseDTO>> => {
  console.log(`[getPnLCalendar] 요청 - year: ${year}, month: ${month}`);
  const response = await fetcher<MonthlyPnlCalendarResponseDTO>(
    API_ENDPOINTS.FEEDBACK_REQUEST.PNL_CALENDAR(year, month),
    {
      method: 'GET',
    }
  );
  console.log(`[getPnLCalendar] 응답:`, response);
  return response;
};

/**
 * 주간 이익 매매 모아보기
 * @param year 연도
 * @param month 월 (1-12)
 * @param week 주차 (1-5)
 */
export const getWeeklyProfitFeedbacks = async (
  year: number,
  month: number,
  week: number
): Promise<ApiResponse<WeeklyProfitFeedbackListResponse>> => {
  const url = API_ENDPOINTS.WEEKLY_TRADING.PROFIT_FEEDBACKS(year, month, week);
  console.log(`[getWeeklyProfitFeedbacks] 요청 - year: ${year}, month: ${month}, week: ${week}`);

  const response = await fetcher<WeeklyProfitFeedbackListResponse>(url, {
    method: 'GET',
  });

  console.log(`[getWeeklyProfitFeedbacks] 응답:`, response);
  return response;
};

/**
 * 주간 손실 매매 모아보기
 * @param year 연도
 * @param month 월 (1-12)
 * @param week 주차 (1-5)
 */
export const getWeeklyLossFeedbacks = async (
  year: number,
  month: number,
  week: number
): Promise<ApiResponse<WeeklyLossFeedbackListResponse>> => {
  const url = API_ENDPOINTS.WEEKLY_TRADING.LOSS_FEEDBACKS(year, month, week);
  console.log(`[getWeeklyLossFeedbacks] 요청 - year: ${year}, month: ${month}, week: ${week}`);

  const response = await fetcher<WeeklyLossFeedbackListResponse>(url, {
    method: 'GET',
  });

  console.log(`[getWeeklyLossFeedbacks] 응답:`, response);
  return response;
};
