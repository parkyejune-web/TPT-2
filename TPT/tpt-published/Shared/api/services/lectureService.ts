/**
 * 강의 관련 API 서비스
 * API 명세서 기반 (유저-강의 태그)
 */

import { fetcher } from '../apiInstance';
import type { ApiResponse } from '../apiTypes';
import { API_ENDPOINTS } from '../endpoints';

// ==================== 타입 정의 ====================

/**
 * 첨부파일 정보 (API 명세: AttachmentInfo)
 */
export interface AttachmentInfo {
  id: number;
  fileUrl: string;
  fileKey: string;
}

/**
 * 강의 자료 파일 (프론트엔드 확장용)
 */
export interface MaterialFile {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
}

/**
 * 강의 요약 응답 DTO (API 명세: LectureResponseDTO)
 * GET /api/v1/lectures 의 lectures 배열 내 개별 항목
 */
export interface LectureResponseDTO {
  lectureId: number;
  chapterId: number;
  title: string;
  content?: string;
  paid: boolean;
  thumbnailUrl?: string;
  durationSeconds: number;
  requiredTokens: number;
  lastWatchedAt?: string;
  watchedSeconds?: number;
  completed: boolean;
  /** 수강 만료일 (무료 강의 토큰 구매 후 생성됨) - 있으면 구매 완료 */
  dueDate?: string;
}

/**
 * 챕터 블록 DTO (API 명세: ChapterBlockDTO)
 * GET /api/v1/lectures 응답의 result 배열 내 개별 항목
 */
export interface ChapterBlockDTO {
  chapterId: number;
  chapterTitle: string;
  description?: string;
  progressPercent: number;
  chapterType: 'REGULAR' | 'PRO';
  lectures: LectureResponseDTO[];
}

/**
 * 강의 상세 조회 응답 DTO (API 명세: LectureDetailDTO)
 * GET /api/v1/lectures/{lectureId} 응답의 result
 */
export interface LectureDetailDTO {
  lectureId: number;
  chapterId: number;
  title: string;
  content?: string;
  videoUrl?: string;
  durationSeconds: number;
  lectureOrder: number;
  requiredTokens: number;
  thumbnailUrl?: string;
  attachments?: AttachmentInfo[];
  watchedSeconds?: number | null;
  isCompleted?: boolean | null;
  lastWatchedAt?: string | null;
  lastPositionedSeconds?: number | null;
}

/**
 * 강의 진행도 업데이트 요청 DTO (API 명세: LectureProgressUpdateRequestDTO)
 */
export interface LectureProgressUpdateRequestDTO {
  currentSeconds: number;
}

/**
 * 과제 제출 상세 응답 DTO (API 실제 응답 형식)
 * GET /api/v1/lectures/{lectureId}/assignments/me 응답의 배열 요소
 */
export interface AssignmentSubmissionDetailDTO {
  assignmentId: number;
  lectureId: number;
  attemptNo: number;
  submittedAt: string;
  downloadUrl: string;
  fileKey: string;
  timestamp?: string;
  /** 프론트엔드에서 사용하기 위한 호환 필드 */
  submitted?: boolean;
  fileUrl?: string;
}

/**
 * 강의 재생 URL 응답 DTO (API 실제 응답 형식)
 * GET /api/v1/lectures/{lectureId}/play 응답
 */
export interface LecturePlayResponseDTO {
  playUrl: string;
  expiresInSeconds: number;
  timestamp?: string;
  /** 프론트엔드 호환용 */
  lectureId?: number;
  videoUrl?: string;
}

// ==================== Legacy 타입 (기존 컴포넌트 호환용) ====================

/**
 * 강의 데이터 (프론트엔드 사용)
 * API 응답을 변환하여 사용
 */
export interface LectureData {
  lectureId: number;
  chapterId: number;
  title: string;
  content?: string;
  paid: boolean;
  thumbnailUrl?: string;
  durationSeconds: number;
  videoUrl?: string;
  materials?: MaterialFile[];
  hasAssignment?: boolean;
  tokenCost?: number;
  completed?: boolean;
  progressPercent?: number;
  requiredTokens?: number;
  watchedSeconds?: number;
  lastWatchedAt?: string;
  /** 수강 만료일 (무료 강의 토큰 구매 후 생성됨) - 있으면 구매 완료 */
  dueDate?: string;
  /** 과제 제출 완료 여부 (Pro 강의 전용) */
  assignmentSubmitted?: boolean;
}

/**
 * 챕터 블록 (프론트엔드 사용)
 */
export interface ChapterBlock {
  chapterId: number;
  chapterTitle: string;
  description?: string;
  progressPercent: number;
  chapterType: 'REGULAR' | 'PRO';
  lectures: LectureData[];
}

/**
 * 강의 상세 데이터 (프론트엔드 사용)
 */
export interface LectureDetailData {
  lectureId: number;
  chapterId: number;
  title: string;
  content?: string;
  paid?: boolean;
  thumbnailUrl?: string;
  videoUrl?: string;
  materials?: MaterialFile[];
  hasAssignment?: boolean;
  durationSeconds: number;
  tokenCost?: number;
  completed?: boolean;
  progressPercent?: number;
  requiredTokens?: number;
  watchedSeconds?: number;
  lastWatchedAt?: string;
  lastPositionedSeconds?: number;
  attachments?: AttachmentInfo[];
}

// ==================== 데이터 변환 함수 ====================

/**
 * API 응답을 프론트엔드 LectureData로 변환
 */
function transformLectureResponse(dto: LectureResponseDTO): LectureData {
  return {
    lectureId: dto.lectureId,
    chapterId: dto.chapterId,
    title: dto.title,
    content: dto.content,
    paid: dto.paid,
    thumbnailUrl: dto.thumbnailUrl,
    durationSeconds: dto.durationSeconds,
    requiredTokens: dto.requiredTokens,
    tokenCost: dto.requiredTokens,
    completed: dto.completed,
    watchedSeconds: dto.watchedSeconds,
    lastWatchedAt: dto.lastWatchedAt,
    dueDate: dto.dueDate,
    progressPercent: dto.durationSeconds > 0 && dto.watchedSeconds
      ? Math.min(100, Math.floor((dto.watchedSeconds / dto.durationSeconds) * 100))
      : 0,
  };
}

/**
 * API 응답을 프론트엔드 ChapterBlock으로 변환
 */
function transformChapterBlock(dto: ChapterBlockDTO): ChapterBlock {
  return {
    chapterId: dto.chapterId,
    chapterTitle: dto.chapterTitle,
    description: dto.description,
    progressPercent: dto.progressPercent,
    chapterType: dto.chapterType,
    lectures: dto.lectures.map(transformLectureResponse),
  };
}

/**
 * API 응답을 프론트엔드 LectureDetailData로 변환
 */
function transformLectureDetail(dto: LectureDetailDTO): LectureDetailData {
  return {
    lectureId: dto.lectureId,
    chapterId: dto.chapterId,
    title: dto.title,
    content: dto.content,
    thumbnailUrl: dto.thumbnailUrl,
    videoUrl: dto.videoUrl,
    durationSeconds: dto.durationSeconds,
    requiredTokens: dto.requiredTokens,
    tokenCost: dto.requiredTokens,
    completed: dto.isCompleted ?? false,
    watchedSeconds: dto.watchedSeconds ?? 0,
    lastWatchedAt: dto.lastWatchedAt ?? undefined,
    lastPositionedSeconds: dto.lastPositionedSeconds ?? undefined,
    attachments: dto.attachments,
    materials: dto.attachments?.map((att, index) => ({
      fileId: String(att.id),
      fileName: att.fileKey.split('/').pop() || `첨부파일_${index + 1}`,
      fileUrl: att.fileUrl,
      fileType: att.fileKey.endsWith('.pdf') ? 'application/pdf' : undefined,
    })),
    progressPercent: dto.durationSeconds > 0 && dto.watchedSeconds
      ? Math.min(100, Math.floor((dto.watchedSeconds / dto.durationSeconds) * 100))
      : 0,
  };
}

// ==================== API 함수 ====================

/**
 * 전체 커리큘럼 조회 (무료+유료 통합)
 * GET /api/v1/lectures
 */
export async function getLectureCurriculum(
  page: number = 0,
  size: number = 100
): Promise<ApiResponse<ChapterBlock[]>> {
  console.log('[lectureService] 커리큘럼 조회 요청:', { page, size });

  const response = await fetcher<ChapterBlockDTO[]>(
    `${API_ENDPOINTS.LECTURE.LIST}?page=${page}&size=${size}`,
    { method: 'GET' }
  );

  if (response.success && response.data) {
    console.log('[lectureService] 커리큘럼 조회 성공:', response.data.length, '개 챕터');
    return {
      ...response,
      data: response.data.map(transformChapterBlock),
    };
  }

  console.error('[lectureService] 커리큘럼 조회 실패:', response.message);
  return response as ApiResponse<ChapterBlock[]>;
}

/**
 * 강의 상세 조회 (진행도 포함)
 * GET /api/v1/lectures/{lectureId}
 */
export async function getLectureDetail(lectureId: number): Promise<ApiResponse<LectureDetailData>> {
  console.log('[lectureService] 강의 상세 조회 요청:', lectureId);

  const response = await fetcher<LectureDetailDTO>(
    API_ENDPOINTS.LECTURE.DETAIL(lectureId),
    { method: 'GET' }
  );

  if (response.success && response.data) {
    console.log('[lectureService] 강의 상세 조회 성공:', response.data.title);
    return {
      ...response,
      data: transformLectureDetail(response.data),
    };
  }

  console.error('[lectureService] 강의 상세 조회 실패:', response.message);
  return response as ApiResponse<LectureDetailData>;
}

/**
 * 강의 시청 진행도 업데이트
 * PATCH /api/v1/lectures/{lectureId}/progress
 */
export async function updateLectureProgress(
  lectureId: number,
  currentSeconds: number
): Promise<ApiResponse<void>> {
  console.log('[lectureService] 진행도 업데이트 요청:', { lectureId, currentSeconds });

  const response = await fetcher<void>(
    API_ENDPOINTS.LECTURE.PROGRESS(lectureId),
    {
      method: 'PATCH',
      body: JSON.stringify({ currentSeconds } as LectureProgressUpdateRequestDTO),
    }
  );

  if (response.success) {
    console.log('[lectureService] 진행도 업데이트 성공');
  } else {
    console.error('[lectureService] 진행도 업데이트 실패:', response.message);
  }

  return response;
}

/**
 * 강의 재생 URL 발급
 * GET /api/v1/lectures/{lectureId}/play
 *
 * @returns 3시간 유효한 재생 URL
 */
export async function getLecturePlayUrl(lectureId: number): Promise<ApiResponse<LecturePlayResponseDTO>> {
  console.log('[lectureService] 강의 재생 URL 발급 요청:', lectureId);

  const response = await fetcher<LecturePlayResponseDTO>(
    API_ENDPOINTS.LECTURE.PLAY(lectureId),
    { method: 'GET' }
  );

  if (response.success && response.data) {
    // playUrl을 videoUrl로 매핑 (프론트엔드 호환)
    const transformedData: LecturePlayResponseDTO = {
      ...response.data,
      videoUrl: response.data.playUrl,
      lectureId,
    };
    console.log('[lectureService] 강의 재생 URL 발급 성공:', {
      lectureId,
      playUrl: response.data.playUrl,
      expiresInSeconds: response.data.expiresInSeconds,
    });
    return {
      ...response,
      data: transformedData,
    };
  } else {
    console.error('[lectureService] 강의 재생 URL 발급 실패:', response.message);
  }

  return response;
}

/**
 * 무료 강의 토큰으로 구매
 * POST /api/v1/lectures/{lectureId}/purchase
 */
export async function purchaseLectureWithToken(lectureId: number): Promise<ApiResponse<number>> {
  console.log('[lectureService] 토큰으로 강의 구매 요청:', lectureId);

  const response = await fetcher<number>(
    API_ENDPOINTS.LECTURE.PURCHASE(lectureId),
    { method: 'POST' }
  );

  if (response.success) {
    console.log('[lectureService] 강의 구매 성공, 결과:', response.data);
  } else {
    console.error('[lectureService] 강의 구매 실패:', response.message);
  }

  return response;
}

/**
 * 과제 제출 (PDF)
 * POST /api/v1/lectures/{lectureId}/assignments/submit
 */
export async function submitAssignment(
  lectureId: number,
  file: File
): Promise<ApiResponse<number>> {
  console.log('[lectureService] 과제 제출 요청:', { lectureId, fileName: file.name });

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetcher<number>(
    API_ENDPOINTS.LECTURE.SUBMIT_ASSIGNMENT(lectureId),
    {
      method: 'POST',
      body: formData,
    }
  );

  if (response.success) {
    console.log('[lectureService] 과제 제출 성공, submissionId:', response.data);
  } else {
    console.error('[lectureService] 과제 제출 실패:', response.message);
  }

  return response;
}

/**
 * 본인 과제 제출 상세 조회
 * GET /api/v1/lectures/{lectureId}/assignments/me
 * API는 배열을 반환하므로 가장 최근 제출(첫 번째 요소)을 반환
 */
export async function getMyAssignmentSubmission(
  lectureId: number
): Promise<ApiResponse<AssignmentSubmissionDetailDTO | null>> {
  console.log('[lectureService] 내 과제 제출 조회 요청:', lectureId);

  // API는 배열을 반환함
  const response = await fetcher<AssignmentSubmissionDetailDTO[]>(
    API_ENDPOINTS.LECTURE.MY_ASSIGNMENT(lectureId),
    { method: 'GET' }
  );

  if (response.success && response.data && response.data.length > 0) {
    // 배열에서 첫 번째 요소(가장 최근 제출)를 가져와서 호환 필드 추가
    const latestSubmission = response.data[0];
    const transformedData: AssignmentSubmissionDetailDTO = {
      ...latestSubmission,
      submitted: true, // 데이터가 있으면 제출 완료
      fileUrl: latestSubmission.downloadUrl, // downloadUrl을 fileUrl로 매핑
    };
    console.log('[lectureService] 내 과제 제출 조회 성공:', transformedData);
    return {
      ...response,
      data: transformedData,
    };
  }

  console.log('[lectureService] 내 과제 제출 조회 결과: 제출 내역 없음');
  return {
    ...response,
    data: null,
  };
}

/**
 * 강의 첨부파일 다운로드 URL 응답 DTO
 */
export interface LectureAttachmentDownloadResponseDTO {
  downloadUrl: string;
  expiresAt?: string;
}

/**
 * 강의 첨부파일 다운로드 URL 발급
 * GET /api/v1/lectures/{lectureId}/attachments/{attachmentId}/download
 */
export async function getLectureAttachmentDownloadUrl(
  lectureId: number,
  attachmentId: number
): Promise<ApiResponse<LectureAttachmentDownloadResponseDTO>> {
  console.log('[lectureService] 첨부파일 다운로드 URL 발급 요청:', { lectureId, attachmentId });

  const response = await fetcher<LectureAttachmentDownloadResponseDTO>(
    API_ENDPOINTS.LECTURE.ATTACHMENT_DOWNLOAD(lectureId, attachmentId),
    { method: 'GET' }
  );

  if (response.success && response.data) {
    console.log('[lectureService] 첨부파일 다운로드 URL 발급 성공');
  } else {
    console.error('[lectureService] 첨부파일 다운로드 URL 발급 실패:', response.message);
  }

  return response;
}

/**
 * 과제 제출 이력 아이템 DTO
 */
export interface AssignmentSubmissionHistoryItemDTO {
  submissionId: number;
  lectureId: number;
  submittedAt: string;
  fileUrl: string;
  fileKey: string;
}

/**
 * 내 과제 제출 이력 조회 (배열로 반환)
 * GET /api/v1/lectures/{lectureId}/assignments/me
 */
export async function getMyAssignmentHistory(
  lectureId: number
): Promise<ApiResponse<AssignmentSubmissionHistoryItemDTO[]>> {
  console.log('[lectureService] 내 과제 제출 이력 조회 요청:', lectureId);

  const response = await fetcher<AssignmentSubmissionHistoryItemDTO[]>(
    API_ENDPOINTS.LECTURE.MY_ASSIGNMENT(lectureId),
    { method: 'GET' }
  );

  if (response.success) {
    console.log('[lectureService] 내 과제 제출 이력 조회 성공:', response.data?.length, '개');
  } else {
    console.log('[lectureService] 내 과제 제출 이력 조회 결과:', response.message);
  }

  return response;
}

// ==================== Legacy 함수 (하위 호환용) ====================

/**
 * @deprecated purchaseLectureWithToken 사용
 */
export async function purchaseLecture(lectureId: number): Promise<ApiResponse<number>> {
  return purchaseLectureWithToken(lectureId);
}
