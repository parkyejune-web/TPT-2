'use client';

import CustomButton from '../../components/CustomButton';
import type { Lecture } from '../../api/lectures';

interface LecturesListProps {
  lectures: Lecture[];
  onView: (lecture: Lecture) => void;
  onEdit: (lecture: Lecture) => void;
  onDelete: (lectureId: number) => void;
  loading: boolean;
}

export default function LecturesList({
  lectures,
  onView,
  onEdit,
  onDelete,
  loading,
}: LecturesListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">강의 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (lectures.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">등록된 강의가 없습니다.</p>
      </div>
    );
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

  const getChapterTypeLabel = (type: string) => {
    switch (type) {
      case 'REGULAR':
        return '무료';
      case 'PRO':
        return '유료';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              강의명
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              강사명
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              챕터 타입
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              공개 범위
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              첨부파일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              생성일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              관리
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lectures.map((lecture) => (
            <tr key={lecture.lectureId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lecture.lectureId}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="max-w-xs">
                  <p className="font-medium truncate">{lecture.title}</p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lecture.trainerName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    lecture.chapterType === 'PRO'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {getChapterTypeLabel(lecture.chapterType)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    lecture.lectureExposure === 'PUBLIC_INSTANT'
                      ? 'bg-blue-100 text-blue-800'
                      : lecture.lectureExposure === 'SUBSCRIBER_WEEKLY'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {getExposureLabel(lecture.lectureExposure)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lecture.hasAttachments ? '있음' : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(lecture.createdAt).toLocaleDateString('ko-KR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex gap-2">
                  <CustomButton
                    variant="secondary"
                    onClick={() => onView(lecture)}
                    className="text-xs"
                  >
                    보기
                  </CustomButton>
                  <CustomButton
                    variant="secondary"
                    onClick={() => onEdit(lecture)}
                    className="text-xs"
                  >
                    수정
                  </CustomButton>
                  <CustomButton
                    variant="danger"
                    onClick={() => {
                      if (confirm('정말 이 강의를 삭제하시겠습니까?')) {
                        onDelete(lecture.lectureId);
                      }
                    }}
                    className="text-xs"
                  >
                    삭제
                  </CustomButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
