import { apiCall } from './base';
import type { ApiResponse } from './base';

// Types
export type LectureExposure = 'SUBSCRIBER_WEEKLY' | 'PUBLIC_INSTANT' | 'PRIVATE';
export type ChapterType = 'REGULAR' | 'PRO';

export interface LectureAttachment {
  fileUrl: string;
  fileKey: string;
  fileName: string;
  fileSize: number;
}

export interface Lecture {
  lectureId: number;
  chapterId: number;
  chapterType: ChapterType;
  title: string;
  trainerName: string;
  hasAttachments: boolean;
  lectureExposure: LectureExposure;
  createdAt: string;
}

export interface LecturePage {
  content: Lecture[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface LectureDetail {
  lectureId: number;
  chapterId: number;
  title: string;
  content: string;
  videoUrl: string;
  videoKey: string;
  durationSeconds: number;
  lectureExposure: LectureExposure;
  lectureOrder: number;
  trainerName: string;
  requiredTokens: number;
  watchedSeconds: number;
  thumbnailUrl: string;
  attachments: LectureAttachment[];
}

export interface Chapter {
  chapterId: number;
  title: string;
  description: string;
  chapterType: ChapterType;
  chapterOrder: number;
  createdAt: string;
  lectureCount?: number;
}

export interface LectureCreateRequest {
  chapterId: number;
  title: string;
  content: string;
  videoUrl: string;
  videoKey: string;
  durationSeconds: number;
  lectureOrder: number;
  lectureExposure: LectureExposure;
  attachments?: LectureAttachment[];
  requiredTokens: number;
  thumbnailUrl?: string;
}

export interface LectureUpdateRequest {
  chapterId: number;
  title: string;
  content: string;
  videoUrl: string;
  videoKey: string;
  durationSeconds: number;
  lectureOrder: number;
  lectureExposure: LectureExposure;
  attachments?: LectureAttachment[];
  requiredTokens: number;
  thumbnailUrl?: string;
}

export interface ChapterCreateRequest {
  title: string;
  description: string;
  chapterType: ChapterType;
  chapterOrder: number;
}

export interface S3PresignedUploadResult {
  presignedUrl: string;
  objectKey: string;
  publicUrl: string;
}

// 강의 목록 조회
export async function getLectures(params?: {
  category?: string;
  page?: number;
  size?: number;
  sort?: string;
}): Promise<ApiResponse<LecturePage>> {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append('category', params.category);
  if (params?.page !== undefined) queryParams.append('page', String(params.page));
  if (params?.size !== undefined) queryParams.append('size', String(params.size));
  if (params?.sort) queryParams.append('sort', params.sort);

  const query = queryParams.toString();
  return apiCall<LecturePage>(`/api/v1/admin/lectures${query ? `?${query}` : ''}`, {
    method: 'GET',
  });
}

// 강의 상세 조회
export async function getLectureDetail(lectureId: number): Promise<ApiResponse<LectureDetail>> {
  return apiCall<LectureDetail>(`/api/v1/admin/lectures/${lectureId}`, {
    method: 'GET',
  });
}

// 강의 생성
export async function createLecture(
  data: LectureCreateRequest
): Promise<ApiResponse<number>> {
  return apiCall<number>('/api/v1/admin/lectures', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 강의 수정
export async function updateLecture(
  lectureId: number,
  data: LectureUpdateRequest
): Promise<ApiResponse<number>> {
  return apiCall<number>(`/api/v1/admin/lectures/${lectureId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 강의 삭제
export async function deleteLecture(lectureId: number): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/lectures/${lectureId}`, {
    method: 'DELETE',
  });
}

// 특정 회원에게 강의 오픈
export async function openLectureToCustomer(
  lectureId: number,
  customerId: number
): Promise<ApiResponse<number>> {
  return apiCall<number>(`/api/v1/admin/lectures/${lectureId}/open?customerId=${customerId}`, {
    method: 'POST',
  });
}

// 동영상 업로드용 Presigned URL 발급
export async function getPresignedUploadUrl(
  filename: string,
  directory: string
): Promise<ApiResponse<S3PresignedUploadResult>> {
  const queryParams = new URLSearchParams({
    filename,
    directory,
  });
  return apiCall<S3PresignedUploadResult>(
    `/api/v1/admin/lectures/uploads/presigned?${queryParams.toString()}`,
    {
      method: 'POST',
    }
  );
}

// 챕터 생성
export async function createChapter(
  data: ChapterCreateRequest
): Promise<ApiResponse<number>> {
  return apiCall<number>('/api/v1/admin/lectures/chapters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 챕터 삭제
export async function deleteChapter(chapterId: number): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/lectures/chapters/${chapterId}`, {
    method: 'DELETE',
  });
}

// S3에 파일 업로드 (Presigned URL 사용)
export async function uploadFileToS3(
  presignedUrl: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<boolean> {
  try {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(true);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  } catch (error) {
    console.error('S3 upload error:', error);
    return false;
  }
}
