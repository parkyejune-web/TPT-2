'use client';

import { useState, useEffect } from 'react';
import CustomButton from '../../components/CustomButton';
import type { LectureDetail, Chapter, LectureAttachment } from '../../api/lectures';
import * as lecturesApi from '../../api/lectures';

interface LectureFormModalProps {
  lecture: LectureDetail | null;
  chapters: Chapter[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function LectureFormModal({
  lecture,
  chapters,
  onClose,
  onSubmit,
}: LectureFormModalProps) {
  const [formData, setFormData] = useState({
    chapterId: lecture?.chapterId || 0,
    title: lecture?.title || '',
    content: lecture?.content || '',
    videoUrl: lecture?.videoUrl || '',
    videoKey: lecture?.videoKey || '',
    durationSeconds: lecture?.durationSeconds || 0,
    lectureOrder: lecture?.lectureOrder || 1,
    lectureExposure: lecture?.lectureExposure || 'PUBLIC_INSTANT',
    requiredTokens: lecture?.requiredTokens || 0,
    thumbnailUrl: lecture?.thumbnailUrl || '',
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<LectureAttachment[]>(
    lecture?.attachments || []
  );

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

  const uploadFile = async (file: File, directory: string): Promise<string> => {
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

    return presignedResponse.data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    try {
      let videoUrl = formData.videoUrl;
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

        videoUrl = presignedResponse.data.publicUrl;
        videoKey = presignedResponse.data.objectKey;
      }

      // 새 썸네일 업로드
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, 'lectures/thumbnails');
      }

      await onSubmit({
        ...formData,
        videoUrl,
        videoKey,
        thumbnailUrl,
        attachments,
      });

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="강의 내용을 설명하세요"
            />
          </div>

          {/* 비디오 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              강의 비디오 {!lecture && <span className="text-red-500">*</span>}
            </label>
            {formData.videoUrl && (
              <div className="mb-2 text-sm text-gray-600">
                현재 비디오: <a href={formData.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">보기</a>
              </div>
            )}
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoFileChange}
              required={!lecture}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 강의 순서 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              강의 순서 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="lectureOrder"
              value={formData.lectureOrder}
              onChange={handleInputChange}
              required
              min={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="비디오 선택 시 자동 입력"
              readOnly
            />
            {formData.durationSeconds > 0 && (
              <p className="mt-1 text-sm text-gray-600">
                {Math.floor(formData.durationSeconds / 60)}분 {formData.durationSeconds % 60}초
              </p>
            )}
          </div>

          {/* 필요 토큰 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              필요 토큰 (0 = 무료)
            </label>
            <input
              type="number"
              name="requiredTokens"
              value={formData.requiredTokens}
              onChange={handleInputChange}
              min={0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PUBLIC_INSTANT">즉시 공개</option>
              <option value="SUBSCRIBER_WEEKLY">구독자 주간</option>
              <option value="PRIVATE">비공개</option>
            </select>
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
