'use client';

import { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import type {
  LectureDetail,
  Chapter,
  LectureRequestDTO,
  LectureAttachmentDTO,
  AttachmentType,
} from '../../api/lectures';
import * as lecturesApi from '../../api/lectures';

interface LectureFormModalProps {
  lecture: LectureDetail | null;
  chapters: Chapter[];
  onClose: () => void;
  onSubmit: (data: LectureRequestDTO) => Promise<void>;
}

// 첨부파일 업로드 상태 관리용 인터페이스
interface AttachmentUploadItem {
  file?: File;
  fileKey: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  attachmentType: AttachmentType;
  isExisting: boolean; // 기존 첨부파일 여부
}

export default function LectureFormModal({
  lecture,
  chapters,
  onClose,
  onSubmit,
}: LectureFormModalProps) {
  // 기존 강의의 경우: requiredTokens가 있으면(> 0) 무료 강의, 없으면(undefined/0) 유료 강의
  const isExistingFreeLecture = lecture ? (lecture.requiredTokens && lecture.requiredTokens > 0) : false;

  const [lectureType, setLectureType] = useState<'paid' | 'free'>(
    isExistingFreeLecture ? 'free' : 'paid'
  );

  const [formData, setFormData] = useState({
    chapterId: lecture?.chapterId || 0,
    title: lecture?.title || '',
    content: lecture?.content || '',
    videoKey: lecture?.videoKey || '',
    durationSeconds: lecture?.durationSeconds || 0,
    lectureOrder: lecture?.lectureOrder || 1,
    lectureExposure: lecture?.lectureExposure || 'PUBLIC_INSTANT',
    requiredTokens: lecture?.requiredTokens || 1,
    thumbnailUrl: lecture?.thumbnailUrl || '',
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // 첨부파일 상태 (기존 첨부파일 변환)
  const [attachments, setAttachments] = useState<AttachmentUploadItem[]>(
    lecture?.attachments?.map((att) => ({
      fileKey: att.fileKey,
      fileUrl: att.fileUrl,
      fileName: att.fileKey.split('/').pop() || 'file',
      fileSize: 0,
      attachmentType: 'GENERAL' as AttachmentType, // 기본값
      isExisting: true,
    })) || []
  );

  // 새로 추가할 첨부파일 목록
  const [newAttachmentFiles, setNewAttachmentFiles] = useState<
    { file: File; attachmentType: AttachmentType }[]
  >([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'chapterId' || name === 'durationSeconds' || name === 'lectureOrder' || name === 'requiredTokens'
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);

      // 비디오 길이 가져오기
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        setFormData((prev) => ({
          ...prev,
          durationSeconds: Math.floor(video.duration),
        }));
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  // 파일 업로드 함수 (presigned URL 방식)
  const uploadFile = async (
    file: File,
    directory: string
  ): Promise<{ publicUrl: string; objectKey: string }> => {
    const presignedResponse = await lecturesApi.getPresignedUploadUrl(file.name, directory);
    if (!presignedResponse.success || !presignedResponse.data) {
      throw new Error('Failed to get presigned URL');
    }

    const success = await lecturesApi.uploadFileToS3(
      presignedResponse.data.presignedUrl,
      file,
      setUploadProgress
    );

    if (!success) {
      throw new Error('File upload failed');
    }

    return {
      publicUrl: presignedResponse.data.publicUrl,
      objectKey: presignedResponse.data.objectKey,
    };
  };

  // 새 첨부파일 추가 핸들러
  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewAttachmentFiles((prev) => [
        ...prev,
        { file, attachmentType: 'GENERAL' as AttachmentType },
      ]);
      e.target.value = ''; // 입력 초기화
    }
  };

  // 첨부파일 타입 변경
  const handleAttachmentTypeChange = (index: number, type: AttachmentType) => {
    setNewAttachmentFiles((prev) =>
      prev.map((item, i) => (i === index ? { ...item, attachmentType: type } : item))
    );
  };

  // 새 첨부파일 삭제
  const handleRemoveNewAttachment = (index: number) => {
    setNewAttachmentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 기존 첨부파일 삭제
  const handleRemoveExistingAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    try {
      let videoKey = formData.videoKey;
      let thumbnailUrl = formData.thumbnailUrl;

      // 새 비디오 업로드
      if (videoFile) {
        const presignedResponse = await lecturesApi.getPresignedUploadUrl(
          videoFile.name,
          'lectures/videos'
        );
        if (!presignedResponse.success || !presignedResponse.data) {
          throw new Error('Failed to get presigned URL for video');
        }

        const success = await lecturesApi.uploadFileToS3(
          presignedResponse.data.presignedUrl,
          videoFile,
          setUploadProgress
        );

        if (!success) {
          throw new Error('Video upload failed');
        }

        videoKey = presignedResponse.data.objectKey;
      }

      // 새 썸네일 업로드 (S3 이미지 업로드 API 사용)
      if (thumbnailFile) {
        const thumbnailResponse = await lecturesApi.uploadImageToS3(
          thumbnailFile,
          'lectures/thumbnails'
        );
        if (!thumbnailResponse.success || !thumbnailResponse.data) {
          throw new Error('썸네일 이미지 업로드에 실패했습니다.');
        }
        thumbnailUrl = thumbnailResponse.data.url;
      }

      // 새 첨부파일 업로드
      const uploadedAttachments: LectureAttachmentDTO[] = [];

      // 기존 첨부파일 유지 (fileKey만 사용)
      for (const att of attachments) {
        uploadedAttachments.push({
          fileKey: att.fileKey,
          attachmentType: att.attachmentType,
        });
      }

      // 새 첨부파일 업로드
      for (const item of newAttachmentFiles) {
        const result = await uploadFile(item.file, 'lectures/attachments');
        uploadedAttachments.push({
          fileKey: result.objectKey,
          attachmentType: item.attachmentType,
        });
      }

      // API 요청 데이터 생성
      const requestData: LectureRequestDTO = {
        chapterId: formData.chapterId,
        title: formData.title,
        content: formData.content,
        videoKey: videoKey || undefined,
        durationSeconds: formData.durationSeconds || undefined,
        lectureOrder: formData.lectureOrder,
        lectureExposure: formData.lectureExposure as 'SUBSCRIBER_WEEKLY' | 'PUBLIC_INSTANT' | 'PRIVATE',
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
        // 무료 강의일 때만 requiredTokens 전송, 유료 강의는 전송하지 않음
        requiredTokens: lectureType === 'free' ? formData.requiredTokens : undefined,
        thumbnailUrl: thumbnailUrl || undefined,
      };

      await onSubmit(requestData);

      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : '업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {lecture ? '강의 수정' : '강의 생성'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={isUploading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 챕터 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              챕터 <span className="text-red-500">*</span>
            </label>
            <select
              name="chapterId"
              value={formData.chapterId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value={0}>챕터를 선택하세요</option>
              {chapters.map((chapter) => (
                <option key={chapter.chapterId} value={chapter.chapterId}>
                  {chapter.title} ({chapter.chapterType === 'PRO' ? '유료' : '무료'})
                </option>
              ))}
            </select>
          </div>

          {/* 강의 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              강의 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="강의 제목을 입력하세요"
            />
          </div>

          {/* 강의 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              강의 설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="강의 내용을 설명하세요"
            />
          </div>

          {/* 비디오 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              강의 비디오 {!lecture && <span className="text-red-500">*</span>}
            </label>
            {formData.videoKey && (
              <div className="mb-2 text-sm text-gray-600">
                현재 비디오 Key: <span className="text-blue-600">{formData.videoKey}</span>
              </div>
            )}
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoFileChange}
              required={!lecture}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
            {videoFile && (
              <p className="mt-2 text-sm text-gray-600">
                선택된 파일: {videoFile.name}
              </p>
            )}
          </div>

          {/* 썸네일 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              썸네일 이미지
            </label>
            {formData.thumbnailUrl && (
              <div className="mb-2">
                <img src={formData.thumbnailUrl} alt="Thumbnail" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          {/* 강의 순서 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              강의 순서 (현재 강의 개수 +1 한 숫자를 적으세요!) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="lectureOrder"
              value={formData.lectureOrder}
              onChange={handleInputChange}
              required
              min={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          {/* 재생 시간 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              재생 시간 (초)
            </label>
            <input
              type="number"
              name="durationSeconds"
              value={formData.durationSeconds}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="비디오 선택 시 자동 입력"
              readOnly
            />
            {formData.durationSeconds > 0 && (
              <p className="mt-1 text-sm text-gray-600">
                {Math.floor(formData.durationSeconds / 60)}분 {formData.durationSeconds % 60}초
              </p>
            )}
          </div>

          {/* 강의 유형 (유료/무료) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              강의 유형 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setLectureType('paid')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  lectureType === 'paid'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">유료 강의</div>
                <div className="text-xs mt-1 text-gray-500">유료 구독자 대상</div>
              </button>
              <button
                type="button"
                onClick={() => setLectureType('free')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  lectureType === 'free'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">무료 강의</div>
                <div className="text-xs mt-1 text-gray-500">무료 고객 대상 (토큰 결제)</div>
              </button>
            </div>
          </div>

          {/* 필요 토큰 (무료 강의일 때만 표시) */}
          {lectureType === 'free' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                필요 토큰 수 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="requiredTokens"
                value={formData.requiredTokens}
                onChange={handleInputChange}
                min={0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
              <p className="mt-1 text-sm text-gray-500">
                무료 고객이 이 강의를 수강하기 위해 지불해야 하는 토큰 수 (0 = 완전 무료)
              </p>
            </div>
          )}

          {/* 공개 범위 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              공개 범위 <span className="text-red-500">*</span>
            </label>
            <select
              name="lectureExposure"
              value={formData.lectureExposure}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="PUBLIC_INSTANT">즉시 공개</option>
              <option value="SUBSCRIBER_WEEKLY">구독자 주간</option>
              <option value="PRIVATE">비공개</option>
            </select>
          </div>

          {/* 첨부파일 (과제 포함) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              첨부파일 (과제)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              일반 첨부파일 또는 과제(ASSIGNMENT)를 업로드할 수 있습니다.
            </p>

            {/* 기존 첨부파일 목록 */}
            {attachments.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-sm font-medium text-gray-600">기존 첨부파일:</p>
                {attachments.map((att, index) => (
                  <div
                    key={`existing-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700">{att.fileName}</span>
                      <select
                        value={att.attachmentType}
                        onChange={(e) => {
                          setAttachments((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? { ...item, attachmentType: e.target.value as AttachmentType }
                                : item
                            )
                          );
                        }}
                        className="text-xs px-2 py-1 border rounded text-black"
                      >
                        <option value="GENERAL">일반</option>
                        <option value="ASSIGNMENT">과제</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingAttachment(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 새 첨부파일 목록 */}
            {newAttachmentFiles.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-sm font-medium text-gray-600">새 첨부파일:</p>
                {newAttachmentFiles.map((item, index) => (
                  <div
                    key={`new-${index}`}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700">{item.file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(item.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <select
                        value={item.attachmentType}
                        onChange={(e) =>
                          handleAttachmentTypeChange(index, e.target.value as AttachmentType)
                        }
                        className="text-xs px-2 py-1 border rounded text-black"
                      >
                        <option value="GENERAL">일반</option>
                        <option value="ASSIGNMENT">과제</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewAttachment(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 첨부파일 추가 버튼 */}
            <input
              type="file"
              id="attachment-input"
              onChange={handleAddAttachment}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.hwp"
            />
            <label
              htmlFor="attachment-input"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-700"
            >
              + 첨부파일 추가
            </label>
          </div>

          {/* 업로드 진행 상태 */}
          {isUploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">업로드 중...</p>
              <div className="w-full bg-blue-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600 mt-1 text-right">{Math.round(uploadProgress)}%</p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <CustomButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isUploading}
            >
              취소
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              disabled={isUploading || formData.chapterId === 0}
            >
              {isUploading ? '업로드 중...' : lecture ? '수정하기' : '생성하기'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}
