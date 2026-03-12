// 백엔드 통신 단위 — 서버와의 요청(request)·응답(response)을 명세함
// 서버랑 주고받는 데이터 형태 정의 

// 임시 파일 (나중에 request-types 폴더 내부에 도메인별로 분리하여 정리 필요)

/**
 * 공통 API 응답 구조
 * 모든 API 응답은 이 인터페이스를 기반으로 함
 */
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	status?: number;
	code?: string; // 서버 에러 코드 (예: LECTURE_404_1, LECTURE_404_4)
}

/**
 * 서버 원본 응답 구조 (서버 내부 result 구조 포함)
 */
export interface ServerResponse<T> {
	timestamp: string;
	code: string;
	message: string;
	result: T;
}

/* ------------------ Auth 관련 ------------------ */

/** 회원가입 요청 */
export interface SignupRequest {
	name: string;
	phone: string;
	email: string;
	username: string;
	password: string;
	passwordCheck: string;
	termsService: boolean;
	termsPrivacy: boolean;
	termsMarketing?: boolean;
	investmentType?: string;
	uids: {
		exchangeName: string;
		uid: string;
	}[];
}

/** 로그인 요청 */
export interface LoginRequest {
	username: string;
	password: string;
	rememberMe?: boolean;
}

// 로그인 응답에 맞는 타입 지정
export interface LoginResponse {
	name: string;
	username: string;
	email: string;
	investmentType: string;
	isPremium: boolean;
	isCourseCompleted: boolean;
	remainingToken?: number; // 남은 토큰 개수
}

/** 아이디 찾기 결과 */
export interface FindIdResult {
	userName: string;
}

/** 아이디 찾기 응답 */
export type FindIdResponse = ApiResponse<FindIdResult>;


/* ------------------ 민원 관련 ------------------ */

/** 민원 작성 요청 DTO */
export interface WriteComplaintRequest {
	title: string;
	content: string;
}

/** 민원 작성 응답 */
export type WriteComplaint = ApiResponse<WriteComplaintRequest>;

/** 단일 민원 조회 결과 */
export interface ComplaintResponse {
	id: number;
	title: string;
	content: string;
	complaintReply: string | null;
	answeredAt: string | null;
	createdAt: string;
}

/** 민원 조회 응답 (배열을 data로 감쌈) */
export type ReadComplaintResponse = ApiResponse<ComplaintResponse[]>;


/* ------------------ 칼럼 관련 ------------------ */

/** 칼럼 아이템 (기존 호환용) */
export interface Column {
  id: number;
  title: string;
  content?: string;
  thumbnailUrl?: string | null;
  categoryId?: number;
  categoryName?: string;
  isBest?: boolean;
  likeCount?: number;
  viewCount?: number;
  createdAt: string;
}

/** 칼럼 목록 요청 파라미터 */
export interface ColumnListParams {
  categoryId?: number;
  page?: number;
  size?: number;
}

/** 칼럼 목록 응답 (기존 호환용) */
export interface ColumnListResponse {
  content: Column[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/** 칼럼 목록 응답 DTO (API 문서 기준) */
export interface ColumnListResponseDTO {
  columnId: number;
  categoryName: string;
  categoryColor?: string;
  title: string;
  subtitle?: string;
  content: string;
  thumbnailImage?: string;
  likeCount: number;
  commentCount: number;
  writerName: string;
  isBest: boolean;
  createdAt: string;
  updatedAt?: string;
}

/** 페이지네이션된 칼럼 목록 응답 */
export interface PageColumnListResponseDTO {
  content: ColumnListResponseDTO[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/* ------------------ 피드백 관련 ------------------ */

/** 스윙 피드백 요청 DTO */
export interface SwingFeedbackRequest {
	positionEndDate: string;
	feedbackYear: number;
	trainerFeedbackRequestContent: string;
	positionStartDate: string;
	positionHoldingTime: string;
	position: string;
	winLossRatio: string;
	subFrame: string;
	courseStatus: string;
	directionFrame: string;
	membershipLevel: string;
	pnl: number;
	screenshotFiles: File | string;
	riskTaking: number;
	entryPoint1: string;
	preCourseFeedbackDetail: string;
	mainFrame: string;
	entryPoint2: string;
	leverage: number;
	entryPoint3: string;
	grade: string;
	feedbackWeek: number;
	trendAnalysis: string;
	tradingReview: string;
	feedbackMonth: number;
	requestDate: string;
	category: string;
}

/** 데이 피드백 요청 DTO */
export interface DayFeedbackRequest {
	trainerFeedbackRequestContent: string;
	positionHoldingTime: string;
	position: string;
	directionFrameExists: boolean;
	winLossRatio: string;
	subFrame: string;
	courseStatus: string;
	directionFrame: string;
	membershipLevel: string;
	pnl: number;
	screenshotFiles: File | string;
	riskTaking: number;
	entryPoint1: string;
	preCourseFeedbackDetail: string;
	mainFrame: string;
	entryPoint2: string;
	leverage: number;
	grade: string;
	trendAnalysis: string;
	tradingReview: string;
	requestDate: string;
	category: string;
}

/** 스켈핑 피드백 요청 DTO */
export interface ScalpingFeedbackRequest {
	trainerFeedbackRequestContent: string;
	dailyTradingCount: number;
	positionHoldingTime: string;
	courseStatus: string;
	membershipLevel: string;
	screenshotFiles: File | string;
	riskTaking: number;
	preCourseFeedbackDetail: string;
	leverage: number;
	totalProfitMarginPerTrades: number;
	trendAnalysis: string;
	requestDate: string;
	category: string;
	totalPositionTakingCount: number;
}


/* ------------------ 월간/주간 매매일지 관련 ------------------ */

/** 피드백 상태 */
export type FeedbackStatus = "FR" | "FN" | "N"; // FR: 답변 읽음, FN: 답변 안 읽음, N: 답변 없음

/** 투자 타입 */
export type InvestmentType = "SWING" | "DAY" | "SCALPING";

/** 코스 상태 */
export type CourseStatus = "BEFORE_COMPLETION" | "PENDING_COMPLETION" | "AFTER_COMPLETION";

/** 월별 피드백 요약 */
export interface MonthlyFeedbackSummary {
	month: number;
	totalCount: number;
	status: FeedbackStatus;
}

/** 연도별 월 목록 응답 */
export interface YearlySummaryResponse {
	feedbackYear: number;
	months: MonthlyFeedbackSummary[];
}

/** 주차별 통계 */
export interface MonthlyWeekFeedbackSummary {
	week: number;
	tradingCount: number;
	weeklyPnl: number;
	status: FeedbackStatus;
}

/** 월별 피드백 통계 */
export interface MonthlyFeedbackSummaryResponse {
	monthlyWeekFeedbackSummaryResponseDTOS: MonthlyWeekFeedbackSummary[];
	winningRate: number;
	monthlyAverageRnr: number;
	monthlyPnl: number;
}

/** 월간 스냅샷 */
export interface MonthSnapshot {
	month: number;
	finalWinRate: number;
	averageRnr: number;
	finalPnL: number;
}

/** 월간 성과 비교 */
export interface PerformanceComparisonMonthSnapshot {
	before: MonthSnapshot;
	current: MonthSnapshot;
}

/** 월간 매매일지 기본 응답 */
export interface MonthlySummaryResponse {
	courseStatus: CourseStatus;
	investmentType: InvestmentType;
	year: number;
	month: number;
}

/** 완강 전 월간 매매일지 */
export interface BeforeCompletedCourseMonthlySummary extends MonthlySummaryResponse {
	monthlyFeedbackSummaryResponseDTO: MonthlyFeedbackSummaryResponse;
	performanceComparison: PerformanceComparisonMonthSnapshot;
}

/** 일별 통계 */
export interface WeeklyWeekFeedbackSummary {
	date: string;
	tradingCount: number;
	winCount: number;
	lossCount: number;
	dailyPnl: number;
	status: FeedbackStatus;
}

/** 주별 피드백 통계 */
export interface WeeklyFeedbackSummaryResponse {
	weeklyWeekFeedbackSummaryResponseDTOS: WeeklyWeekFeedbackSummary[];
	winningRate: number;
	weeklyAverageRnr: number;
	weeklyPnl: number;
}

/** 주간 스냅샷 */
export interface WeekSnapshot {
	week: number;
	winRate: number;
	rnr: number;
	pnl: number;
}

/** 주간 성과 비교 */
export interface PerformanceComparisonWeekSnapshot {
	before: WeekSnapshot;
	current: WeekSnapshot;
}

/** 주간 매매일지 기본 응답 */
export interface WeeklySummaryResponse {
	courseStatus: CourseStatus;
	investmentType: InvestmentType;
	year: number;
	month: number;
	week: number;
}

/** 완강 전 주간 매매일지 */
export interface BeforeCompletedCourseWeeklySummary extends WeeklySummaryResponse {
	weeklyFeedbackSummaryResponseDTO: WeeklyFeedbackSummaryResponse;
	performanceComparison: PerformanceComparisonWeekSnapshot;
	memo?: string;
}

/** 주간 피드백 아이템 (이익/손실 매매용) */
export interface WeeklyFeedbackListItem {
	feedbackId: number;
	title: string;
	feedbackRequestDate: string; // "2025-11-15"
	totalAssetPnl: number; // 서버에서 totalAssetPnl로 반환
	investmentType: InvestmentType;
	status: FeedbackStatus;
	hasResponse: boolean;
}

/** 주간 이익 매매 목록 응답 */
export interface WeeklyProfitFeedbackListResponse {
	year: number;
	month: number;
	week: number;
	profitFeedbacks: WeeklyFeedbackListItem[];
	totalAssetPnlSum: number; // 전체 P&L 합계
}

/** 주간 손실 매매 목록 응답 */
export interface WeeklyLossFeedbackListResponse {
	year: number;
	month: number;
	week: number;
	lossFeedbacks: WeeklyFeedbackListItem[];
	totalAssetPnlSum: number; // 전체 P&L 합계
}


/* ------------------ 피드백 요청 조회 관련 ------------------ */

/** 포지션 타입 */
export type Position = "LONG" | "SHORT";

/** 진입 타점 */
export type EntryPoint = "REVERSE" | "PULL_BACK" | "BREAK_OUT";

/** 등급 */
export type Grade = "S_PLUS" | "S" | "A" | "B" | "NONE";

/** 슬라이스 정보 (무한 스크롤용) */
export interface SliceInfo {
	currentPage: number;
	pageSize: number;
	hasNext: boolean;
	isFirst: boolean;
	isLast: boolean;
}

/** 피드백 카드 DTO (목록용) */
export interface FeedbackCardDTO {
	feedbackRequestId: number;
	title: string;
	contentPreview: string;
	createdAt: string;
	investmentType: InvestmentType;
	courseStatus: CourseStatus;
	status: FeedbackStatus;
	isBestFeedback: boolean;
	customerName?: string;
}

/** 피드백 요청 목록 응답 */
export interface FeedbackListResponseDTO {
	feedbacks: FeedbackCardDTO[];
	sliceInfo: SliceInfo;
}

/** 트레이너 정보 */
export interface TrainerDTO {
	id: number;
	name: string;
	profileImageUrl?: string;
}

/** 피드백 답변 DTO */
export interface FeedbackResponseDTO {
	id: number;
	title: string;
	submittedAt: string;
	trainer: TrainerDTO;
	content: string;
}

/** 데이 트레이딩 피드백 요청 상세 응답 */
export interface DayFeedbackRequestDetailResponseDTO {
	id: number;
	createdAt: string;
	investmentType: InvestmentType;
	courseStatus: CourseStatus;
	membershipLevel: "BASIC" | "PREMIUM";
	feedbackYear: number;
	feedbackMonth: number;
	feedbackWeek: number;
	feedbackRequestDate: string;
	status: FeedbackStatus;
	isBestFeedback: boolean;
	updatedAt: string;
	category: string;
	positionHoldingTime: string;
	screenshotImageUrls: string[];
	riskTaking: number;
	leverage: number;
	positionStartDate: string;
	positionEndDate: string;
	position: Position;
	positionStartReason: string;
	positionEndReason: string;
	trainerFeedbackRequestContent: string;
	directionFrameExists: boolean;
	directionFrame?: string;
	mainFrame: string;
	subFrame: string;
	trendAnalysis: string;
	pnl: number;
	rnr: number;
	entryPoint1: EntryPoint;
	grade: Grade;
	entryPoint2?: string;
	tradingReview: string;
}

/** 스켈핑 트레이딩 피드백 요청 상세 응답 */
export interface ScalpingFeedbackRequestDetailResponseDTO {
	id: number;
	createdAt: string;
	investmentType: InvestmentType;
	courseStatus: CourseStatus;
	membershipLevel: "BASIC" | "PREMIUM";
	feedbackYear: number;
	feedbackMonth: number;
	feedbackWeek: number;
	feedbackRequestDate: string;
	status: FeedbackStatus;
	isBestFeedback: boolean;
	updatedAt: string;
	category: string;
	positionHoldingTime: string;
	screenshotImageUrls: string[];
	riskTaking: number;
	leverage: number;
	position: Position;
	pnl: number;
	rnr: number;
	operatingFundsRatio: number;
	entryPrice: number;
	exitPrice: number;
	settingStopLoss: number;
	settingTakeProfit: number;
	positionStartReason: string;
	positionEndReason: string;
	tradingReview: string;
}

/** 스윙 트레이딩 피드백 요청 상세 응답 */
export interface SwingFeedbackRequestDetailResponseDTO {
	id: number;
	createdAt: string;
	investmentType: InvestmentType;
	courseStatus: CourseStatus;
	membershipLevel: "BASIC" | "PREMIUM";
	feedbackRequestDate: string;
	status: FeedbackStatus;
	feedbackYear: number;
	feedbackMonth: number;
	feedbackWeek: number;
	isBestFeedback: boolean;
	updatedAt: string;
	category: string;
	positionHoldingTime: string;
	screenshotImageUrls: string[];
	riskTaking: number;
	leverage: number;
	positionStartDate: string;
	positionEndDate: string;
	position: Position;
	positionStartReason: string;
	positionEndReason: string;
	trainerFeedbackRequestContent: string;
	directionFrame: string;
	mainFrame: string;
	subFrame: string;
	trendAnalysis: string;
	pnl: number;
	rnr: number;
	entryPoint1: EntryPoint;
	grade: Grade;
	entryPoint2?: string;
	entryPoint3?: string;
	tradingReview: string;
}

/** 피드백 요청 상세 응답 */
export interface FeedbackRequestDetailResponseDTO {
	id: number;
	investmentType: InvestmentType;
	status: FeedbackStatus;
	dayDetail?: DayFeedbackRequestDetailResponseDTO;
	scalpingDetail?: ScalpingFeedbackRequestDetailResponseDTO;
	swingDetail?: SwingFeedbackRequestDetailResponseDTO;
	feedbackResponse?: FeedbackResponseDTO;
}

/** 피드백 요청 목록 아이템 (특정 날짜의 피드백 요청 목록 조회용) */
export interface FeedbackRequestListItemResponseDTO {
	id: number;
	customerId: number;
	customerName: string;
	investmentType: InvestmentType;
	courseStatus: CourseStatus;
	status: FeedbackStatus;
	createdAt: string;
	feedbackRequestDate: string;
	feedbackYear: number;
	feedbackMonth: number;
	feedbackWeek: number;
	feedbackDay: number;
	isBestFeedback: boolean;
}


/* ------------------ 상담 관련 ------------------ */

/** 상담 시간 슬롯 타입 */
export type TimeSlot = "H09" | "H10" | "H11" | "H13" | "H14" | "H15" | "H16" | "H17" | "H18";

/** 상담 가능 시간대 DTO */
export interface SlotAvailabilityDTO {
	timeSlot: TimeSlot;
	available: boolean;
}

/** 상담 예약 생성 요청 */
export interface ConsultationCreateRequest {
	date: string; // YYYY-MM-DD 형식
	time: string; // HH:MM:SS 형식
}

/** 상담 예약 수정 요청 */
export interface ConsultationUpdateRequest {
	oldConsultationId: number;
	newDate: string; // YYYY-MM-DD 형식
	newTime: string; // HH:MM:SS 형식
}

/** 상담 예약 응답 DTO */
export interface ConsultationResponse {
	id: number;
	date: string; // YYYY-MM-DD 형식
	time: string; // HH:MM:SS 형식
}


/* ------------------ 투자 유형 변경 신청 관련 ------------------ */

/** 투자 유형 변경 신청 상태 */
export type ChangeRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

/** 투자 유형 변경 신청 생성 요청 */
export interface CreateChangeRequest {
	requestedType: InvestmentType;
	reason?: string;
}

/** 투자 유형 변경 신청 응답 DTO */
export interface ChangeRequestResponse {
	id: number;
	customerId: number;
	customerName: string;
	currentType: InvestmentType;
	requestedType: InvestmentType;
	status: ChangeRequestStatus;
	reason?: string;
	requestedDate: string; // YYYY-MM-DD 형식
	targetChangeDate: string; // YYYY-MM-DD 형식
	processedAt?: string; // ISO 8601 형식
	rejectionReason?: string;
}


/* ------------------ 레벨테스트 관련 ------------------ */

/** 문제 유형 */
export type ProblemType = "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "SUBJECTIVE";

/** 객관식 선택지 */
export interface MultipleChoicePayload {
	choice1?: string;
	choice2?: string;
	choice3?: string;
	choice4?: string;
	choice5?: string;
}

/** 레벨테스트 문제 DTO (유저용) */
export interface LevelTestQuestionUserResponse {
	questionId: number;
	content: string;
	score: number;
	problemType: ProblemType;
	imageUrl?: string;
	multipleChoice?: MultipleChoicePayload;
}

/** Slice 응답 (무한스크롤용) */
export interface SliceResponse<T> {
	content: T[];
	pageable: {
		pageNumber: number;
		pageSize: number;
		offset: number;
	};
	numberOfElements: number;
	size: number;
	number: number;
	first: boolean;
	last: boolean;
	empty: boolean;
}

/** 문제별 응답 정보 */
export interface QuestionAnswer {
	questionId: number;
	choiceNumber?: string; // 객관식일 경우 선택 번호 (예: "1" 또는 "1,3")
	answerText?: string; // 단답형/서술형일 경우 작성한 답변 내용
}

/** 레벨테스트 제출 요청 DTO */
export interface LeveltestSubmitRequest {
	answers: QuestionAnswer[];
}

/** 레벨테스트 제출 응답 DTO */
export interface LeveltestAttemptSubmitResponse {
	attemptId: number;
}


/* ------------------ 결제수단 관련 ------------------ */

/** 나이스페이 설정 DTO */
export interface NicePayConfigDTO {
	mid: string;
	goodsName: string;
	amt: string;
	payMethod: string;
	billAuthYN?: string; // 대문자 N (레거시)
	billAuthYn?: string; // 소문자 n (백엔드 실제 응답)
}

/** 빌키 등록 초기화 응답 DTO */
export interface BillingKeyInitResponseDTO {
	moid: string;
	ediDate: string;
	signData: string;
	nicePayConfig: NicePayConfigDTO;
	mobileReturnUrl: string; // 모바일 결제용 콜백 URL (백엔드에서 제공)
}

/** 카드 정보 요청 DTO (비인증 빌키 발급) */
export interface CardInfoRequestDTO {
	cardNo: string; // 카드번호 (13~16자리)
	expYear: string; // 유효기간 년도 (YY)
	expMonth: string; // 유효기간 월 (MM)
	idNo: string; // 생년월일(YYMMDD) 또는 사업자번호(10자리)
	cardPw: string; // 카드 비밀번호 앞 2자리
}

/** 빌키 등록 완료 요청 DTO (인증 방식) */
export interface BillingKeyCompleteRequestDTO {
	txTid: string;
	authToken: string;
	moid: string;
	signature?: string; // Signature 검증용 (선택사항, 백엔드에서 검증 권장)
	mid?: string; // MID (Signature 검증용)
	amt?: string; // Amt (Signature 검증용)
}

/** 빌키 등록 응답 DTO */
export interface BillingKeyRegisterResponseDTO {
	paymentMethodId: number;
	billingKey: string;
	cardName: string;
	cardNo: string;
	cardCode: string;
	issuedAt: string; // ISO 8601 형식
	isPrimary: boolean;
	isActive: boolean;
}

/** 카드 타입 */
export type CardType = 'CREDIT' | 'DEBIT' | 'SIMPLE';

/** 결제수단 응답 DTO */
export interface PaymentMethodResponseDTO {
	id: number;
	displayName: string;
	cardCompanyName: string;
	cardCompanyCode: string;
	maskedCardNo: string; // 마스킹된 카드번호
	cardType: CardType;
	isPrimary: boolean;
	isActive: boolean;
	expiresAt: string; // 유효기간 (날짜만)
	isExpired: boolean;
	billingKeyIssuedAt: string; // ISO 8601 형식
	createdAt: string; // ISO 8601 형식
}

/** 주 결제수단 조회 응답 */
export type PrimaryPaymentMethodResponse = ApiResponse<PaymentMethodResponseDTO | null>;

/** 결제수단 상세 조회 응답 */
export type PaymentMethodDetailResponse = ApiResponse<PaymentMethodResponseDTO>;

/** 결제수단 삭제 응답 */
export type DeletePaymentMethodResponse = ApiResponse<void>;

/* ------------------ 월별 PnL 달력 관련 ------------------ */

/** 일별 PnL DTO */
export interface DailyPnlDTO {
	day: number; // 일 (1-31)
	pnl: number; // PnL (손익)
	pnlPercentage: number; // PnL 퍼센테이지
	feedbackCount?: number; // 매매 횟수
	winRate?: number; // 승률 (0-100)
}

/** 월별 PnL 달력 응답 DTO */
export interface MonthlyPnlCalendarResponseDTO {
	year: number; // 연도
	month: number; // 월 (1-12)
	dailyPnls: DailyPnlDTO[]; // 일별 PnL 목록
	totalPnl: number; // 월 전체 PnL 합계
	averagePnlPercentage: number; // 월 평균 PnL 퍼센테이지
}

/** 월별 PnL 달력 조회 응답 */
export type MonthlyPnlCalendarResponse = ApiResponse<MonthlyPnlCalendarResponseDTO>;

/* ------------------ 주간 매매 일지 통계 관련 ------------------ */

/** 주간 매매 일지 통계 작성 요청 DTO @deprecated - UpsertWeeklyMemoRequestDTO 사용 권장 */
export interface CreateWeeklyTradingSummaryRequestDTO {
	memo?: string; // 나의 문제점 메모 (완강 전/후 모두 가능)
	weeklyEvaluation?: string; // 주간 회원 매매 평가 (완강 후 - 트레이너만)
	weeklyProfitableTradingAnalysis?: string; // 수익난 매매 분석 (완강 후 - 트레이너만)
	weeklyLossTradingAnalysis?: string; // 손실난 매매 분석 (완강 후 - 트레이너만)
}

/** 주간 매매 일지 통계 작성 응답 @deprecated */
export type CreateWeeklyTradingSummaryResponse = ApiResponse<void>;

/** 주간 매매일지 메모 Upsert 요청 DTO (고객용 - 완강 전) */
export interface UpsertWeeklyMemoRequestDTO {
	memo: string; // 나의 문제점 메모하기 (max 5000자)
}

/** 주간 매매일지 메모 응답 DTO */
export interface WeeklyMemoResponseDTO {
	id: number; // 주간 매매일지 ID
	customerId: number; // 고객 ID
	customerNickname: string; // 고객 닉네임
	year: number; // 연도
	month: number; // 월
	week: number; // 주차
	courseStatus: 'BEFORE_COMPLETION' | 'PENDING_COMPLETION' | 'AFTER_COMPLETION'; // 코스 상태
	investmentType: 'SWING' | 'DAY'; // 투자 유형
	memo: string; // 나의 문제점 메모
	createdAt: string; // 생성일시 (ISO 8601)
	updatedAt: string; // 수정일시 (ISO 8601)
}

/** 주간 매매일지 메모 Upsert 응답 */
export type UpsertWeeklyMemoResponse = ApiResponse<WeeklyMemoResponseDTO>;


/* ------------------ 리뷰 관련 ------------------ */

/** 트레이너 답변 응답 DTO */
export interface TrainerReplyResponseDTO {
	trainerId: number;
	trainerName?: string; // API에서 제공하지 않을 수 있음
	replyContent: string; // API 필드명
	repliedAt: string; // ISO 8601 형식
}

/** 리뷰 응답 DTO */
export interface ReviewResponseDTO {
	id: number;
	customerId: number;
	customerName: string;
	phoneNumber?: string;
	content: string;
	rating: number; // 리뷰 별점 (1-5)
	submittedAt: string; // ISO 8601 형식
	trainerReply?: TrainerReplyResponseDTO;
	isPublic: boolean;
}

/** 공개 리뷰 목록 응답 DTO (무한 스크롤) */
export interface PublicReviewListResponseDTO {
	reviews: ReviewResponseDTO[];
	sliceInfo: SliceInfo;
}

/** 공개 리뷰 목록 조회 응답 */
export type PublicReviewListResponse = ApiResponse<PublicReviewListResponseDTO>;

/** 리뷰 작성 요청 DTO */
export interface CreateReviewRequestDTO {
	content: string; // 리뷰 본문 (HTML/Markdown)
	rating: number; // 리뷰 별점 (1-5)
	tagIds?: number[]; // 선택한 리뷰 태그 ID 목록
}

/** 리뷰 태그 응답 DTO */
export interface ReviewTagResponseDTO {
	id: number; // 태그 ID
	name: string; // 태그 이름
	description?: string; // 태그 설명
}

/** 리뷰 태그별 통계 응답 DTO */
export interface ReviewTagStatisticsResponseDTO {
	tagId: number; // 태그 ID
	tagName: string; // 태그 이름
	reviewCount: number; // 해당 태그가 선택된 리뷰 수
}

/** 리뷰 통계 응답 DTO */
export interface ReviewStatisticsResponseDTO {
	totalReviewCount: number; // 전체 리뷰 개수
	averageRating: number; // 평균 별점 (총 별점 합 / 총 리뷰 개수)
	tagStatistics: ReviewTagStatisticsResponseDTO[]; // 태그별 리뷰 통계
}


/* ------------------ 피드백 이미지 관련 ------------------ */

/** 피드백 요청 스크린샷 이미지 응답 DTO (API 응답용) */
export interface FeedbackScreenShotAttachmentDTO {
	imageId: number; // 이미지 PK ID
	imageUrl: string; // 파일 URL
}

/* ------------------ 피드백 수정 관련 ------------------ */

/** 피드백 요청 수정 DTO (FormData로 전송) */
export interface UpdateFeedbackRequestDTO {
	// 필수 필드
	category: string; // 종목
	position: Position; // 포지션 (LONG/SHORT)
	pnl: number; // P&L
	totalAssetPnl: number; // 전체 자산 기준 P&L
	rnr: number; // 손익비 (R&R)
	riskTaking: number; // 리스크 테이킹
	leverage: number; // 레버리지 (1.0-125.0)
	operatingFundsRatio: number; // 비중 (운용 자금 대비, 1-100)
	entryPrice: number; // 진입 가격
	exitPrice: number; // 탈출 가격
	settingStopLoss: number; // 설정 손절가

	// 선택 필드
	settingTakeProfit?: number; // 설정 익절가
	positionHoldingTime?: string; // 포지션 홀딩 시간
	positionStartReason?: string; // 포지션 진입 근거
	positionEndReason?: string; // 포지션 탈출 근거
	tradingReview?: string; // 매매 복기
	directionFrameExists?: boolean; // 디렉션 프레임 존재 여부
	directionFrame?: string; // 디렉션 프레임
	mainFrame?: string; // 메인 프레임
	subFrame?: string; // 서브 프레임
	trendAnalysis?: string; // 추세 분석
	trainerFeedbackRequestContent?: string; // 담당 트레이너 피드백 요청 사항
	entryPoint?: EntryPoint; // 진입 타점
	grade?: Grade; // 등급
	additionalBuyCount?: number; // 추가 매수 횟수
	splitSellCount?: number; // 분할 매도 횟수
	positionStartDate?: string; // 포지션 시작 날짜 (SWING 전용, YYYY-MM-DD)
	positionEndDate?: string; // 포지션 종료 날짜 (SWING 전용, YYYY-MM-DD)

	// 이미지 관련 필드 (FormData로 전송 시 사용)
	screenshotFiles?: File[]; // 추가할 스크린샷 이미지 파일 목록
	deleteAttachmentIds?: number[]; // 삭제할 기존 첨부파일 ID 목록
}

/** 피드백 수정 API 에러 코드 */
export type FeedbackUpdateErrorCode =
	| 'COMPLETED_FEEDBACK_UPDATE_NOT_ALLOWED' // 피드백 답변이 완료된 요청은 수정할 수 없습니다
	| 'FEEDBACK_NOT_FOUND' // 피드백을 찾을 수 없습니다
	| 'UNAUTHORIZED'; // 권한이 없습니다


/* ------------------ 닉네임 관련 ------------------ */

/** 닉네임 등록/변경 요청 DTO */
export interface UpdateNicknameRequestDTO {
	nickname: string; // 닉네임 (필수) - API 명세 파라미터명: nickname
}

/** 닉네임 등록/변경 응답 DTO */
export interface UpdateNicknameResponseDTO {
	nickName: string; // 변경된 닉네임
}

/** 닉네임 변경 응답 */
export type UpdateNicknameResponse = ApiResponse<UpdateNicknameResponseDTO>;


/* ------------------ 레벨테스트 결과 관련 ------------------ */

/** 레벨테스트 시도 목록 응답 DTO */
export interface LeveltestAttemptListResponseDTO {
	attemptId: number; // 시도(Attempt) ID
	totalScore: number; // 총점 (객관식+주관식 채점 결과 포함)
	grade: string; // 등급 (예: A, B, C)
	createdAt: string; // 생성일시 (ISO 8601)
}

/** 문항별 응답 정보 DTO */
export interface QuestionResponseDTO {
	questionId: number; // 문항 ID
	content: string; // 문제 내용
	problemType: ProblemType; // 문제 유형
	imageUrl?: string; // 문제 이미지 URL
	choices?: string[]; // 객관식일 경우 선택지 내용
	choiceNumber?: string; // 유저가 선택한 번호 (객관식일 경우)
	answerText?: string; // 유저가 작성한 답변 (주관식/단답형일 경우)
	scoreAwarded: number; // 획득 점수
}

/** 레벨테스트 시도 상세 조회 응답 DTO */
export interface LeveltestAttemptDetailResponseDTO {
	attemptId: number; // 시도(Attempt) ID
	totalScore: number; // 총점
	grade: string; // 등급
	customerId: number; // 응시자 ID
	responses: QuestionResponseDTO[]; // 문항별 응답 리스트
}
