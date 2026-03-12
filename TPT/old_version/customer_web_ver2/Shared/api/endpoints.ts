/**
 * API Endpoints
 *
 * 모든 API 엔드포인트를 도메인별로 관리합니다.
 * api-docs.json을 기반으로 생성되었습니다.
 */

export const API_ENDPOINTS = {
  // ==================== 인증 및 사용자 관리 ====================
  AUTH: {
    // 회원가입 및 로그인
    SIGNUP: '/api/v1/auth/signup',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',

    // 사용자 정보
    ME: '/api/v1/auth/me',
    DELETE_USER: '/api/v1/auth/users',

    // 소셜 로그인
    SOCIAL_INFO: '/api/v1/auth/social-info',
    KAKAO_LOGIN: '/oauth2/authorization/kakao',
    NAVER_LOGIN: '/oauth2/authorization/naver',

    // 인증 코드
    PHONE_CODE: '/api/v1/auth/phone/code',
    PHONE_VERIFY: '/api/v1/auth/phone/verify',
    EMAIL_CODE: '/api/v1/auth/email/code',
    EMAIL_VERIFY: '/api/v1/auth/email/verify',

    // 아이디/비밀번호
    FIND_ID: '/api/v1/auth/id/find',
    USERNAME_AVAILABLE: '/api/v1/auth/username/available',
    PASSWORD_UPDATE: '/api/v1/auth/password/update', // 비로그인 상태
  },

  USER: {
    CHANGE_PASSWORD: '/api/v1/user/password/change', // 로그인 상태
    PROFILE_IMAGE: '/api/v1/user/profile-image',
  },

  // ==================== 피드백 요청 ====================
  FEEDBACK_REQUEST: {
    // 피드백 생성
    CREATE_SWING: '/api/v1/feedback-requests/swing',
    CREATE_DAY: '/api/v1/feedback-requests/day',
    CREATE_SCALPING: '/api/v1/feedback-requests/scalping',

    // 피드백 조회
    LIST: '/api/v1/feedback-requests', // 실시간 트레이딩 목록 (무한 스크롤)
    DETAIL: (id: number) => `/api/v1/feedback-requests/${id}`,
    DELETE: (id: number) => `/api/v1/feedback-requests/${id}`,

    // 날짜별 조회
    BY_DATE: (year: number, month: number, day: number) =>
      `/api/v1/feedback-requests/customers/me/years/${year}/months/${month}/days/${day}`,

    // PnL 달력
    PNL_CALENDAR: (year: number, month: number) =>
      `/api/v1/feedback-requests/customers/me/years/${year}/months/${month}/pnl-calendar`,
  },

  // ==================== 피드백 답변 (관리자) ====================
  FEEDBACK_RESPONSE: {
    CREATE: (feedbackRequestId: number) =>
      `/api/v1/admin/feedback-responses/${feedbackRequestId}`,
    UPDATE: (feedbackRequestId: number) =>
      `/api/v1/admin/feedback-responses/${feedbackRequestId}`,
  },

  // ==================== 주간 매매 일지 통계 ====================
  WEEKLY_TRADING: {
    // 고객용
    GET: (year: number, month: number, week: number) =>
      `/api/v1/weekly-trading-summary/customers/me/years/${year}/months/${month}/weeks/${week}`,
    CREATE: (year: number, month: number, week: number) =>
      `/api/v1/weekly-trading-summary/customers/me/years/${year}/months/${month}/weeks/${week}`,

    // 관리자용
    ADMIN_CREATE: (customerId: number, year: number, month: number, week: number) =>
      `/api/v1/admin/weekly-trading-summary/customers/${customerId}/years/${year}/months/${month}/weeks/${week}`,
    ADMIN_DAYS: (customerId: number, year: number, month: number, week: number) =>
      `/api/v1/admin/weekly-trading-summary/customers/${customerId}/years/${year}/months/${month}/weeks/${week}/days`,
    ADMIN_BY_DAY: (customerId: number, year: number, month: number, week: number, day: number) =>
      `/api/v1/admin/weekly-trading-summary/customers/${customerId}/years/${year}/months/${month}/weeks/${week}/days/${day}`,
  },

  // ==================== 월간 매매 일지 통계 ====================
  MONTHLY_TRADING: {
    // 고객용
    GET_YEARS: (year: number) =>
      `/api/v1/monthly-trading-summaries/customers/me/years/${year}`,
    GET_MONTHS: (year: number, month: number) =>
      `/api/v1/monthly-trading-summaries/customers/me/years/${year}/months/${month}`,

    // 관리자용
    ADMIN_GET_YEARS: (customerId: number, year: number) =>
      `/api/v1/admin/monthly-trading-summaries/customers/${customerId}/years/${year}`,
    ADMIN_GET_MONTHS: (customerId: number, year: number, month: number) =>
      `/api/v1/admin/monthly-trading-summaries/customers/${customerId}/years/${year}/months/${month}`,
    ADMIN_CREATE: (customerId: number, year: number, month: number) =>
      `/api/v1/admin/monthly-trading-summaries/customers/${customerId}/years/${year}/months/${month}`,
  },

  // ==================== 레벨테스트 ====================
  LEVELTEST: {
    // 사용자용
    LIST: '/api/v1/leveltests',
    SUBMIT: '/api/v1/leveltests/attempts',
    ATTEMPT_DETAIL: (attemptId: number) => `/api/v1/leveltests/attempts/${attemptId}`,
    GRADED_ATTEMPTS: '/api/v1/leveltests/attempts/graded',

    // 관리자용 - 문제 관리
    ADMIN_LIST: '/api/v1/admin/leveltests',
    ADMIN_DETAIL: (questionId: number) => `/api/v1/admin/leveltests/${questionId}`,
    ADMIN_DELETE: (questionId: number) => `/api/v1/admin/leveltests/${questionId}`,

    ADMIN_CREATE_MULTIPLE: '/api/v1/admin/leveltests/multiple-choice',
    ADMIN_CREATE_SHORT: '/api/v1/admin/leveltests/short-answer',
    ADMIN_CREATE_SUBJECTIVE: '/api/v1/admin/leveltests/subjective',

    ADMIN_UPDATE_MULTIPLE: (questionId: number) => `/api/v1/admin/leveltests/multiple-choice/${questionId}`,
    ADMIN_UPDATE_SHORT: (questionId: number) => `/api/v1/admin/leveltests/short-answer/${questionId}`,
    ADMIN_UPDATE_SUBJECTIVE: (questionId: number) => `/api/v1/admin/leveltests/subjective/${questionId}`,

    // 관리자용 - 시도 관리
    ADMIN_ATTEMPTS: '/api/v1/admin/leveltests/attempts',
    ADMIN_ATTEMPT_DETAIL: (attemptId: number) => `/api/v1/admin/leveltests/attempts/${attemptId}`,
    ADMIN_GRADE: (attemptId: number) => `/api/v1/admin/leveltests/attempts/${attemptId}/grade`,
  },

  // ==================== 민원 ====================
  COMPLAINT: {
    // 고객용
    LIST: '/api/v1/complaints',
    CREATE: '/api/v1/complaints',

    // 관리자용
    ADMIN_LIST: '/api/v1/admin/complaints',
    ADMIN_DETAIL: (complaintId: number) => `/api/v1/admin/complaints/${complaintId}`,
    ADMIN_REPLY: (complaintId: number) => `/api/v1/admin/complaints/${complaintId}/reply`,
    ADMIN_UPDATE_REPLY: (complaintId: number) => `/api/v1/admin/complaints/${complaintId}/reply`,
    ADMIN_DELETE_REPLY: (complaintId: number) => `/api/v1/admin/complaints/${complaintId}/reply`,
  },

  // ==================== 리뷰 ====================
  REVIEW: {
    // 사용자용
    LIST: '/api/v1/reviews',
    CREATE: '/api/v1/reviews',
    DETAIL: (reviewId: number) => `/api/v1/reviews/${reviewId}`,
    MY_LIST: '/api/v1/reviews/me',
    MY_DETAIL: (reviewId: number) => `/api/v1/reviews/me/${reviewId}`,

    // 관리자용
    ADMIN_REPLY: (reviewId: number) => `/api/v1/admin/reviews/${reviewId}/reply`,
    ADMIN_VISIBILITY: (reviewId: number) => `/api/v1/admin/reviews/${reviewId}/visibility`,
  },

  // ==================== 칼럼 ====================
  COLUMN: {
    // 사용자용
    LIST: '/api/v1/columns',
    DETAIL: (columnId: number) => `/api/v1/columns/${columnId}`,
    CATEGORIES: '/api/v1/columns/categories',

    // 좋아요 및 댓글
    LIKE: (columnId: number) => `/api/v1/columns/${columnId}/likes`,
    COMMENT: (columnId: number) => `/api/v1/columns/${columnId}/comments`,
    UPDATE_COMMENT: (columnId: number, commentId: number) =>
      `/api/v1/columns/${columnId}/comments/${commentId}`,
    DELETE_COMMENT: (columnId: number, commentId: number) =>
      `/api/v1/columns/${columnId}/comments/${commentId}`,

    // 관리자용
    ADMIN_LIST: '/api/v1/admin/columns',
    ADMIN_CREATE: '/api/v1/admin/columns',
    ADMIN_DETAIL: (columnId: number) => `/api/v1/admin/columns/${columnId}`,
    ADMIN_UPDATE: (columnId: number) => `/api/v1/admin/columns/${columnId}`,
    ADMIN_DELETE: (columnId: number) => `/api/v1/admin/columns/${columnId}`,
    ADMIN_BEST: (columnId: number) => `/api/v1/admin/columns/${columnId}/best`,

    ADMIN_CATEGORIES: '/api/v1/admin/columns/categories',
    ADMIN_CREATE_CATEGORY: '/api/v1/admin/columns/categories',
    ADMIN_UPDATE_CATEGORY: (categoryId: number) => `/api/v1/admin/columns/categories/${categoryId}`,
    ADMIN_DELETE_CATEGORY: (categoryId: number) => `/api/v1/admin/columns/categories/${categoryId}`,

    ADMIN_COMMENT: (columnId: number) => `/api/v1/admin/columns/${columnId}/comments`,
  },

  // ==================== 상담 ====================
  CONSULTATION: {
    // 고객용
    MY_LIST: '/api/v1/consultations/me',
    CREATE: '/api/v1/consultations',
    UPDATE: '/api/v1/consultations/me',
    DELETE: (consultationId: number) => `/api/v1/consultations/me/${consultationId}`,
    AVAILABILITY: '/api/v1/consultations/availability',

    // 관리자용
    ADMIN_LIST: '/api/v1/admin/consultations',
    ADMIN_ACCEPT: (consultationId: number) => `/api/v1/admin/consultations/${consultationId}/accept`,
    ADMIN_MEMO: (consultationId: number) => `/api/v1/admin/consultations/${consultationId}/memo`,
    ADMIN_BLOCK: '/api/v1/admin/consultations/blocks',
    ADMIN_UNBLOCK: '/api/v1/admin/consultations/blocks',
  },

  // ==================== 투자 유형 변경 ====================
  INVESTMENT_TYPE_CHANGE: {
    // 고객용
    LIST: '/api/v1/investment-type-change-requests',
    CREATE: '/api/v1/investment-type-change-requests',
    DETAIL: (requestId: number) => `/api/v1/investment-type-change-requests/${requestId}`,
    DELETE: (requestId: number) => `/api/v1/investment-type-change-requests/${requestId}`,

    // 관리자용
    ADMIN_LIST: '/api/v1/admin/investment-type-change-requests',
    ADMIN_PENDING: '/api/v1/admin/investment-type-change-requests/pending',
    ADMIN_DETAIL: (requestId: number) => `/api/v1/admin/investment-type-change-requests/${requestId}`,
    ADMIN_PROCESS: (requestId: number) => `/api/v1/admin/investment-type-change-requests/${requestId}/process`,
  },

  // ==================== 관리자 - 사용자 관리 ====================
  ADMIN_USER: {
    PENDING_USERS: '/api/v1/admin/users/pending',
    MY_CUSTOMERS: '/api/v1/admin/users/my-customers',
    UPDATE_STATUS: (userId: number) => `/api/v1/admin/users/${userId}/status`,
    GRANT_TOKEN: (userId: number) => `/api/v1/admin/users/${userId}/token`,
  },

  // ==================== 관리자 - 트레이너 관리 ====================
  ADMIN_TRAINER: {
    LIST: '/api/v1/admin/trainers',
    CREATE: '/api/v1/admin/trainers',
    UPDATE: (trainerId: number) => `/api/v1/admin/trainers/${trainerId}`,
    DELETE: (trainerId: number) => `/api/v1/admin/trainers/${trainerId}`,
    CUSTOMERS: (trainerId: number) => `/api/v1/admin/trainers/${trainerId}/customers`,
    ASSIGN_CUSTOMER: (trainerId: number, customerId: number) =>
      `/api/v1/admin/trainers/${trainerId}/customers/${customerId}`,
    EVALUATIONS: '/api/v1/admin/me/managed_customers/evaluations',
  },

  // ==================== 관리자 - 피드백 관리 ====================
  ADMIN_FEEDBACK: {
    LIST: '/api/v1/admin/feedback-requests',
    DETAIL: (feedbackRequestId: number) => `/api/v1/admin/feedback-requests/${feedbackRequestId}`,
    TOKEN_USED: '/api/v1/admin/feedback-requests/token-used',
    NEW_CUSTOMER_FEEDBACK: '/api/v1/admin/feedback-requests/my-customers/new',
    UPDATE_BEST: '/api/v1/admin/feedback-requests/best',
  },

  // ==================== 관리자 - 인증 ====================
  ADMIN_AUTH: {
    LOGOUT: '/api/v1/admin/auth/logout',
  },
} as const;

// 타입 추출을 위한 헬퍼 (선택사항)
export type ApiEndpoint = typeof API_ENDPOINTS;
