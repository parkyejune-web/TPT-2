import { apiCall, type ApiResponse } from './index';

// 평가 상태 인터페이스
export interface EvaluationStatus {
  summaryId: number | null;
  year: number;
  month: number;
  week: number | null;
  evaluated: boolean;
  evaluatedAt: string | null;
  label: string;
}

// 담당 고객 평가 정보 인터페이스
export interface CustomerEvaluation {
  customerId: number;
  name: string;
  phoneNumber: string;
  primaryInvestmentType: 'SWING' | 'DAY' | 'SCALPING' | null;
  courseStatus: string;
  monthlyEvaluation: EvaluationStatus | null;
  weeklyEvaluation: EvaluationStatus | null;
}

export interface CustomerEvaluationPageResponse {
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
  content: CustomerEvaluation[];
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 담당 고객 평가 목록 조회
export async function getMyManagedCustomerEvaluations(
  page: number = 0,
  size: number = 20
): Promise<ApiResponse<CustomerEvaluationPageResponse>> {
  return apiCall(
    `/api/v1/admin/me/managed_customers/evaluations?page=${page}&size=${size}`,
    { method: 'GET' }
  );
}

// 월간 매매 일지 통계 (피드백 작성)
export async function submitMonthlyTradingSummary(
  customerId: number,
  year: number,
  month: number,
  feedback: string
): Promise<ApiResponse<void>> {
  return apiCall(
    `/api/v1/admin/monthly-trading-summaries/customers/${customerId}/years/${year}/months/${month}`,
    {
      method: 'POST',
      body: JSON.stringify({ feedback }),
    }
  );
}

// 주간 매매 일지 통계 (피드백 작성)
export async function submitWeeklyTradingSummary(
  customerId: number,
  year: number,
  month: number,
  week: number,
  feedback: string
): Promise<ApiResponse<void>> {
  return apiCall(
    `/api/v1/admin/weekly-trading-summary/customers/${customerId}/years/${year}/months/${month}/weeks/${week}`,
    {
      method: 'POST',
      body: JSON.stringify({ feedback }),
    }
  );
}

// 월간 매매 일지 통계 조회 (기존 함수 - 호환성 유지)
export async function getMonthlyTradingSummary(
  customerId: number,
  year: number,
  month: number
) {
  return apiCall(
    `/api/v1/admin/monthly-trading-summaries/customers/${customerId}/years/${year}/months/${month}`,
    { method: 'POST' }
  );
}

// ============================================
// 월간/주간 피드백 통계 조회 API
// ============================================

// 월간: 해당 연/월에 대한 주차 리스트업
export interface MonthlyWeekFeedbackResponse {
  year: number;
  month: number;
  weeks: number[]; // 피드백이 존재하는 주차 목록 [1, 3, 4]
}

export async function getMonthlyWeekFeedbacks(
  customerId: number,
  year: number,
  month: number
): Promise<ApiResponse<MonthlyWeekFeedbackResponse>> {
  return apiCall(
    `/api/v1/admin/monthly-trading-summaries/customers/${customerId}/years/${year}/months/${month}`,
    { method: 'GET' }
  );
}

// 주간: 특정 주의 피드백이 존재하는 날짜 목록 조회
export interface WeeklyDayFeedbackResponse {
  year: number;
  month: number;
  week: number;
  days: number[]; // 피드백이 존재하는 날짜 목록 [17, 19, 21, 22]
}

export async function getWeeklyDayFeedbacks(
  customerId: number,
  year: number,
  month: number,
  week: number
): Promise<ApiResponse<WeeklyDayFeedbackResponse>> {
  return apiCall(
    `/api/v1/admin/weekly-trading-summary/customers/${customerId}/years/${year}/months/${month}/weeks/${week}/days`,
    { method: 'GET' }
  );
}

// 특정 날짜의 피드백 목록 조회
export interface DailyFeedbackListItem {
  feedbackId: number;
  title: string;
  investmentType: 'SWING' | 'DAY';
  courseStatus: 'BEFORE_COMPLETION' | 'PENDING_COMPLETION' | 'AFTER_COMPLETION';
  status: 'FR' | 'FN' | 'N'; // FR: 피드백 읽음, FN: 피드백 미읽음, N: 피드백 없음
  createdAt: string;
  hasResponse: boolean;
}

export interface DailyFeedbackListResponse {
  year: number;
  month: number;
  week: number;
  day: number;
  feedbacks: DailyFeedbackListItem[];
}

export async function getDailyFeedbackList(
  customerId: number,
  year: number,
  month: number,
  week: number,
  day: number
): Promise<ApiResponse<DailyFeedbackListResponse>> {
  return apiCall(
    `/api/v1/admin/weekly-trading-summary/customers/${customerId}/years/${year}/months/${month}/weeks/${week}/days/${day}`,
    { method: 'GET' }
  );
}

// ============================================
// 월간/주간 매매 일지 통계 조회 API (트레이너용)
// ============================================

// 진입 타점 통계 상세
export interface PositionDetail {
  count: number;
  winRate: number;
  rnr: number;
}

// 진입 타점 통계 응답
export interface EntryPointStatisticsResponseDTO {
  reverse: PositionDetail | null;
  pullBack: PositionDetail | null;
  breakOut: PositionDetail | null;
}

// 방향성 통계 상세
export interface DirectionDetail {
  count: number;
  winRate: number;
  rnr: number;
}

// 방향성 통계 응답
export interface DirectionStatisticsResponseDTO {
  o: DirectionDetail | null;
  x: DirectionDetail | null;
}

// 월별 스냅샷
export interface MonthSnapshot {
  month: number;
  finalWinRate: number;
  averageRnr: number;
  finalPnL: number;
}

// 주별 스냅샷
export interface WeekSnapshot {
  week: number;
  winRate: number;
  rnr: number;
  pnl: number;
}

// 월별 성과 비교
export interface PerformanceComparisonMonthSnapshot {
  before: MonthSnapshot | null;
  current: MonthSnapshot | null;
}

// 주별 성과 비교
export interface PerformanceComparisonWeekSnapshot {
  before: WeekSnapshot | null;
  current: WeekSnapshot | null;
}

// 주차별 통계 DTO (월간 피드백용)
export interface MonthlyWeekFeedbackSummaryResponseDTO {
  week: number;
  startDate: string; // "2025-11-10"
  endDate: string;   // "2025-11-16"
  tradingCount: number;
  weeklyPnl: number;
  status: 'FR' | 'FN' | 'N';
}

// 월별 통계 DTO
export interface MonthlyFeedbackSummaryResponseDTO {
  monthlyWeekFeedbackSummaryResponseDTOS: MonthlyWeekFeedbackSummaryResponseDTO[];
  winningRate: number;
  monthlyAverageRnr: number;
  monthlyPnl: number;
}

// 일별 통계 DTO (주간 피드백용)
export interface WeeklyWeekFeedbackSummaryResponseDTO {
  date: string; // "2025-11-17"
  tradingCount: number;
  winCount: number;
  lossCount: number;
  dailyPnl: number;
  status: 'FR' | 'FN' | 'N';
}

// 주별 통계 DTO
export interface WeeklyFeedbackSummaryResponseDTO {
  weeklyWeekFeedbackSummaryResponseDTOS: WeeklyWeekFeedbackSummaryResponseDTO[];
  winningRate: number;
  weeklyAverageRnr: number;
  weeklyPnl: number;
}

// 완강 후 고객 월별 요약 (스윙/데이 트레이딩)
export interface AfterCompletedCourseMonthlySummaryDTO {
  courseStatus: 'AFTER_COMPLETION';
  investmentType: 'SWING' | 'DAY';
  year: number;
  month: number;
  monthlyFeedbackSummaryResponseDTO: MonthlyFeedbackSummaryResponseDTO | null;
  isTrainerEvaluated: boolean;
  monthlyEvaluation: string | null;
  nextMonthGoal: string | null;
  entryPointStatisticsResponseDTO: EntryPointStatisticsResponseDTO | null;
  performanceComparison: PerformanceComparisonMonthSnapshot | null;
}

// 완강 전 고객 월별 요약
export interface BeforeCompletedCourseMonthlySummaryDTO {
  courseStatus: 'BEFORE_COMPLETION' | 'PENDING_COMPLETION';
  investmentType: 'SWING' | 'DAY';
  year: number;
  month: number;
  monthlyFeedbackSummaryResponseDTO: MonthlyFeedbackSummaryResponseDTO | null;
  performanceComparison: PerformanceComparisonMonthSnapshot | null;
}

// 월간 통계 응답 (공통 타입)
export type MonthlySummaryResponseDTO = AfterCompletedCourseMonthlySummaryDTO | BeforeCompletedCourseMonthlySummaryDTO;

// 완강 후 고객 주별 요약 - 데이 트레이딩
export interface AfterCompletedDayWeeklySummaryDTO {
  courseStatus: 'AFTER_COMPLETION';
  investmentType: 'DAY';
  year: number;
  month: number;
  week: number;
  weeklyFeedbackSummaryResponseDTO: WeeklyFeedbackSummaryResponseDTO | null;
  performanceComparison: PerformanceComparisonWeekSnapshot | null;
  directionStatisticsResponseDTO: DirectionStatisticsResponseDTO | null;
  weeklyLossTradingAnalysis: string | null;
  weeklyProfitableTradingAnalysis: string | null;
  weeklyEvaluation: string | null;
}

// 일별 피드백 요약 DTO (스윙 트레이딩용)
export interface DailyFeedbackSummaryDTO {
  date: string;
  totalCount: number;
  status: 'FR' | 'FN' | 'N';
}

// 완강 후 고객 주별 요약 - 스윙 트레이딩
export interface AfterCompletedSwingWeeklySummaryDTO {
  courseStatus: 'AFTER_COMPLETION';
  investmentType: 'SWING';
  year: number;
  month: number;
  week: number;
  dailyFeedbackSummaryDTOS: DailyFeedbackSummaryDTO[] | null;
}

// 완강 전 고객 주간 매매 일지
export interface BeforeCompletedCourseWeeklySummaryDTO {
  courseStatus: 'BEFORE_COMPLETION' | 'PENDING_COMPLETION';
  investmentType: 'SWING' | 'DAY';
  year: number;
  month: number;
  week: number;
  weeklyFeedbackSummaryResponseDTO: WeeklyFeedbackSummaryResponseDTO | null;
  performanceComparison: PerformanceComparisonWeekSnapshot | null;
  memo: string | null;
}

// 주간 통계 응답 (공통 타입)
export type WeeklySummaryResponseDTO = AfterCompletedDayWeeklySummaryDTO | AfterCompletedSwingWeeklySummaryDTO | BeforeCompletedCourseWeeklySummaryDTO;

// 고객 월간 매매 일지 조회 (Admin/Trainer)
export async function getAdminMonthlySummary(
  customerId: number,
  year: number,
  month: number
): Promise<ApiResponse<MonthlySummaryResponseDTO>> {
  return apiCall(
    `/api/v1/admin/monthly-trading-summaries/customers/${customerId}/years/${year}/months/${month}/summary`,
    { method: 'GET' }
  );
}

// 고객 주간 매매 일지 조회 (Admin/Trainer)
export async function getAdminWeeklySummary(
  customerId: number,
  year: number,
  month: number,
  week: number
): Promise<ApiResponse<WeeklySummaryResponseDTO>> {
  return apiCall(
    `/api/v1/admin/weekly-trading-summary/customers/${customerId}/years/${year}/months/${month}/weeks/${week}/summary`,
    { method: 'GET' }
  );
}

// ============================================
// 매매일지 전체 내역 조회용 API (연도 → 월 → 주 → 일 → 상세)
// ============================================

// 월별 피드백 요약 정보
export interface MonthlyFeedbackSummaryItem {
  month: number;
  totalCount: number;
  status: 'FR' | 'FN' | 'N';
}

// 연도별 월 리스트 응답
export interface YearlySummaryResponse {
  feedbackYear: number;
  months: MonthlyFeedbackSummaryItem[];
}

// 해당 연도에 대한 월 리스트 조회
export async function getYearlyMonthList(
  customerId: number,
  year: number
): Promise<ApiResponse<YearlySummaryResponse>> {
  return apiCall(
    `/api/v1/admin/monthly-trading-summaries/customers/${customerId}/years/${year}`,
    { method: 'GET' }
  );
}

// ============================================
// 피드백 요청 상세 조회 및 피드백 답변 수정 API
// ============================================

// 트레이너 정보
export interface TrainerDTO {
  trainerId: number;
  profileImageUrl: string | null;
  trainerName: string;
}

// 피드백 응답 DTO
export interface FeedbackResponseDTO {
  id: number;
  title: string;
  submittedAt: string;
  trainer: TrainerDTO;
  content: string;
}

// 피드백 요청 상세 응답
export interface FeedbackRequestDetailResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  investmentType: 'SWING' | 'DAY';
  courseStatus: 'BEFORE_COMPLETION' | 'PENDING_COMPLETION' | 'AFTER_COMPLETION';
  membershipLevel: 'BASIC' | 'PREMIUM';
  status: 'FR' | 'FN' | 'N';
  isBestFeedback: boolean;
  feedbackYear: number;
  feedbackMonth: number;
  feedbackWeek: number;
  feedbackRequestDate: string;
  category: string;
  positionHoldingTime: string | null;
  screenshotImageUrls: string[];
  riskTaking: number | null;
  leverage: number | null;
  position: 'LONG' | 'SHORT';
  pnl: number | null;
  totalAssetPnl: number | null;
  rnr: number | null;
  operatingFundsRatio: number | null;
  entryPrice: number | null;
  exitPrice: number | null;
  settingStopLoss: number | null;
  settingTakeProfit: number | null;
  positionStartReason: string | null;
  positionEndReason: string | null;
  tradingReview: string | null;
  directionFrameExists: boolean | null;
  directionFrame: string | null;
  mainFrame: string | null;
  subFrame: string | null;
  trendAnalysis: string | null;
  trainerFeedbackRequestContent: string | null;
  entryPoint: 'REVERSE' | 'PULL_BACK' | 'BREAK_OUT' | null;
  grade: 'S_PLUS' | 'S' | 'A' | 'B' | 'NONE' | null;
  additionalBuyCount: number | null;
  splitSellCount: number | null;
  positionStartDate: string | null;
  positionEndDate: string | null;
  isTokenUsed: boolean;
  tokenAmount: number | null;
  feedbackResponse: FeedbackResponseDTO | null;
}

// 피드백 요청 상세 조회
export async function getFeedbackRequestDetail(
  feedbackRequestId: number
): Promise<ApiResponse<FeedbackRequestDetailResponse>> {
  return apiCall(
    `/api/v1/feedback-requests/${feedbackRequestId}`,
    { method: 'GET' }
  );
}

// 피드백 답변 수정 요청 DTO
export interface UpdateFeedbackResponseRequest {
  title?: string;
  content?: string;
}

// 피드백 답변 수정 (Admin)
export async function updateAdminFeedbackResponse(
  feedbackRequestId: number,
  data: UpdateFeedbackResponseRequest
): Promise<ApiResponse<FeedbackResponseDTO>> {
  return apiCall(
    `/api/v1/admin/feedback-responses/${feedbackRequestId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

// ============================================
// 월간/주간 매매일지 트레이너 평가 Upsert API
// ============================================

// 월간 매매일지 트레이너 평가 요청 DTO
export interface MonthlyEvaluationUpsertRequest {
  monthlyEvaluation: string; // 트레이너의 한달간 회원님 매매 최종 평가
  nextMonthGoal: string; // 다음달 회원님의 목표 성과
}

// 월간 매매일지 트레이너 평가 응답 DTO
export interface MonthlyEvaluationResponseDTO {
  id: number;
  customerId: number;
  customerNickname: string;
  trainerId: number;
  trainerNickname: string;
  year: number;
  month: number;
  courseStatus: string;
  investmentType: string;
  monthlyEvaluation: string;
  nextMonthGoal: string;
  evaluatedAt: string;
  createdAt: string;
  updatedAt: string;
}

// 월간 매매일지 트레이너 평가 Upsert (Trainer)
export async function upsertMonthlyEvaluation(
  customerId: number,
  year: number,
  month: number,
  data: MonthlyEvaluationUpsertRequest
): Promise<ApiResponse<MonthlyEvaluationResponseDTO>> {
  return apiCall(
    `/api/v1/admin/monthly-trading-summaries/customers/${customerId}/years/${year}/months/${month}/evaluation`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

// 주간 매매일지 트레이너 평가 요청 DTO
export interface WeeklyEvaluationUpsertRequest {
  weeklyLossTradingAnalysis: string; // 회원님의 손실난 매매 분석
  weeklyProfitableTradingAnalysis: string; // 회원님의 수익난 매매 분석
  weeklyEvaluation: string; // 회원님의 주간 매매 최종 평가 및 개선점
}

// 주간 매매일지 트레이너 평가 응답 DTO
export interface WeeklyEvaluationResponseDTO {
  id: number;
  customerId: number;
  customerNickname: string;
  trainerId: number;
  trainerNickname: string;
  year: number;
  month: number;
  week: number;
  courseStatus: string;
  investmentType: string;
  weeklyEvaluation: string;
  weeklyProfitableTradingAnalysis: string;
  weeklyLossTradingAnalysis: string;
  evaluatedAt: string;
  createdAt: string;
  updatedAt: string;
}

// 주간 매매일지 트레이너 평가 Upsert (Trainer)
export async function upsertWeeklyEvaluation(
  customerId: number,
  year: number,
  month: number,
  week: number,
  data: WeeklyEvaluationUpsertRequest
): Promise<ApiResponse<WeeklyEvaluationResponseDTO>> {
  return apiCall(
    `/api/v1/admin/weekly-trading-summary/customers/${customerId}/years/${year}/months/${month}/weeks/${week}/evaluation`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

// ============================================
// 담당 고객 미작성 평가 목록 조회 API
// ============================================

// 미작성 평가 항목 DTO
export interface PendingEvaluationItemDTO {
  customerId: number;
  customerName: string;
  phoneNumber: string;
  investmentType: 'SWING' | 'DAY';
  evaluationType: 'WEEKLY' | 'MONTHLY';
  targetYear: number;
  targetMonth: number;
  targetWeek: number | null;
  targetPeriodDisplay: string;
}

// 미작성 평가 슬라이스 정보
export interface PendingEvaluationSliceInfo {
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  isFirst: boolean;
  isLast: boolean;
}

// 미작성 평가 목록 응답 DTO
export interface PendingEvaluationListResponseDTO {
  evaluations: PendingEvaluationItemDTO[];
  sliceInfo: PendingEvaluationSliceInfo;
}

// 담당 고객 미작성 평가 목록 조회
export async function getPendingEvaluations(
  page: number = 0,
  size: number = 20
): Promise<ApiResponse<PendingEvaluationListResponseDTO>> {
  return apiCall(
    `/api/v1/admin/customer-evaluations/pending?page=${page}&size=${size}`,
    { method: 'GET' }
  );
}
