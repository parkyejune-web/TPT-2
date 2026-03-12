'use client';

import { useState, useEffect } from 'react';
import CustomButton from '../../components/CustomButton';
import * as lecturesApi from '../../api/lectures';
import type { LectureDetail } from '../../api/lectures';

interface LectureDetailModalProps {
  lectureId: number;
  onClose: () => void;
  onEdit: () => void;
}

export default function LectureDetailModal({
  lectureId,
  onClose,
  onEdit,
}: LectureDetailModalProps) {
  const [lecture, setLecture] = useState<LectureDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLectureDetail();
  }, [lectureId]);

  const loadLectureDetail = async () => {
    setLoading(true);
    const response = await lecturesApi.getLectureDetail(lectureId);
    if (response.success && response.data) {
      setLecture(response.data);
    } else {
      alert('강의 상세 정보를 불러오는데 실패했습니다.');
      onClose();
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!lecture) {
    return null;
  }

  const getExposureLabel = (exposure: string) => {
    switch (exposure) {
      case 'SUBSCRIBER_WEEKLY':
        return '구독자 주간';
      case 'PUBLIC_INSTANT':
        return '즉시 공개';
      case 'PRIVATE':
        return '비공개';
      default:
        return exposure;
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${secs}초`;
    }
    return `${minutes}분 ${secs}초`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">강의 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-6">
          {/* 썸네일 */}
          {lecture.thumbnailUrl && (
            <div>
              <img
                src={lecture.thumbnailUrl}
                alt={lecture.title}
                className="w-full max-h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                강의 ID
              </label>
              <p className="text-gray-900">{lecture.lectureId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                챕터 ID
              </label>
              <p className="text-gray-900">{lecture.chapterId}</p>
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              강의 제목
            </label>
            <h3 className="text-xl font-bold text-gray-900">{lecture.title}</h3>
          </div>

          {/* 강사 */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              강사명
            </label>
            <p className="text-gray-900">{lecture.trainerName}</p>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              강의 설명
            </label>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{lecture.content}</p>
            </div>
          </div>

          {/* 비디오 */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              강의 비디오
            </label>
            {lecture.videoUrl && (
              <video
                controls
                className="w-full rounded-lg"
                src={lecture.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                재생 시간
              </label>
              <p className="text-gray-900">{formatDuration(lecture.durationSeconds)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                강의 순서
              </label>
              <p className="text-gray-900">{lecture.lectureOrder}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                필요 토큰
              </label>
              <p className="text-gray-900">
                {lecture.requiredTokens === 0 ? '무료' : `${lecture.requiredTokens} 토큰`}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                공개 범위
              </label>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  lecture.lectureExposure === 'PUBLIC_INSTANT'
                    ? 'bg-blue-100 text-blue-800'
                    : lecture.lectureExposure === 'SUBSCRIBER_WEEKLY'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {getExposureLabel(lecture.lectureExposure)}
              </span>
            </div>
            {lecture.watchedSeconds > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  누적 시청 시간
                </label>
                <p className="text-gray-900">{formatDuration(lecture.watchedSeconds)}</p>
              </div>
            )}
          </div>

          {/* 첨부파일 */}
          {lecture.attachments && lecture.attachments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                첨부파일
              </label>
              <div className="space-y-2">
                {lecture.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{attachment.fileName}</p>
                      <p className="text-sm text-gray-500">
                        {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      다운로드
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <CustomButton variant="secondary" onClick={onClose}>
            닫기
          </CustomButton>
          <CustomButton variant="primary" onClick={onEdit}>
            수정하기
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
