import { apiCall } from './base';
import type { ApiResponse } from './base';

// S3 업로드 응답 타입
export interface S3UploadResponse {
  key: string;
  url: string;
  originalFilename: string;
  contentType: string;
}

/**
 * S3에 이미지를 업로드합니다 (어드민 전용)
 * @param file - 업로드할 파일
 * @param directory - 업로드할 디렉토리 (선택사항)
 * @returns 업로드된 파일의 URL 및 키 정보
 */
export async function uploadImage(
  file: File,
  directory?: string
): Promise<ApiResponse<S3UploadResponse>> {
  const formData = new FormData();
  formData.append('file', file);

  const queryParams = directory ? `?directory=${encodeURIComponent(directory)}` : '';

  return apiCall<S3UploadResponse>(`/api/v1/admin/s3/uploads${queryParams}`, {
    method: 'POST',
    body: formData,
    isMultipart: true, // FormData 플래그
  });
}
