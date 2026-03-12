'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import CustomButton from '../../components/CustomButton';
import LecturesList from './LecturesList';
import LectureFormModal from './LectureFormModal';
import LectureDetailModal from './LectureDetailModal';
import ChapterManagement from './ChapterManagement';
import type { Lecture, LectureDetail, Chapter } from '../../api/lectures';
import * as lecturesApi from '../../api/lectures';

type ViewMode = 'lectures' | 'chapters';

export default function LecturesManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('lectures');
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 모달 상태
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<LectureDetail | null>(null);
  const [detailLectureId, setDetailLectureId] = useState<number | null>(null);

  useEffect(() => {
    loadLectures();
    loadChapters();
  }, [currentPage]);

  // 강의 목록 로드
  const loadLectures = async () => {
    setLoading(true);
    const response = await lecturesApi.getLectures({
      page: currentPage,
      size: 20,
      sort: 'createdAt,desc',
    });

    if (response.success && response.data) {
      setLectures(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } else {
      console.error('강의 목록 로드 실패:', response.error);
    }
    setLoading(false);
  };

  // 챕터 목록 로드 (실제로는 강의 목록에서 챕터 정보를 추출하거나, 별도 API가 필요)
  // 현재 API 명세에는 챕터 목록 조회 API가 없으므로, 강의 목록에서 추출
  const loadChapters = async () => {
    // Note: 실제로는 챕터 목록 조회 API가 필요합니다.
    // 임시로 빈 배열로 설정하거나, 강의 목록에서 추출할 수 있습니다.
    // 여기서는 챕터 생성 후 관리를 위해 빈 배열로 시작합니다.
    setChapters([]);
  };

  // 강의 생성
  const handleCreateLecture = async (data: any) => {
    const response = await lecturesApi.createLecture(data);
    if (response.success) {
      alert('강의가 생성되었습니다.');
      loadLectures();
    } else {
      alert(`강의 생성 실패: ${response.error}`);
      throw new Error(response.error);
    }
  };

  // 강의 수정
  const handleUpdateLecture = async (data: any) => {
    if (!selectedLecture) return;

    const response = await lecturesApi.updateLecture(selectedLecture.lectureId, data);
    if (response.success) {
      alert('강의가 수정되었습니다.');
      loadLectures();
    } else {
      alert(`강의 수정 실패: ${response.error}`);
      throw new Error(response.error);
    }
  };

  // 강의 삭제
  const handleDeleteLecture = async (lectureId: number) => {
    const response = await lecturesApi.deleteLecture(lectureId);
    if (response.success) {
      alert('강의가 삭제되었습니다.');
      loadLectures();
    } else {
      alert(`강의 삭제 실패: ${response.error}`);
    }
  };

  // 강의 보기
  const handleViewLecture = (lecture: Lecture) => {
    setDetailLectureId(lecture.lectureId);
    setShowDetailModal(true);
  };

  // 강의 수정 모달 열기
  const handleEditLecture = async (lecture: Lecture) => {
    // 강의 상세 정보를 먼저 가져옴
    const response = await lecturesApi.getLectureDetail(lecture.lectureId);
    if (response.success && response.data) {
      setSelectedLecture(response.data);
      setShowFormModal(true);
    } else {
      alert('강의 정보를 불러오는데 실패했습니다.');
    }
  };

  // 강의 작성 모달 열기
  const handleOpenCreateModal = () => {
    setSelectedLecture(null);
    setShowFormModal(true);
  };

  // 챕터 생성
  const handleCreateChapter = async (data: {
    title: string;
    description: string;
    chapterType: 'REGULAR' | 'PRO';
    chapterOrder: number;
  }) => {
    const response = await lecturesApi.createChapter(data);
    if (response.success) {
      alert('챕터가 생성되었습니다.');
      loadChapters();
      // 챕터 생성 후 강의 목록도 새로고침 (챕터 정보 업데이트)
      loadLectures();
    } else {
      alert(`챕터 생성 실패: ${response.error}`);
      throw new Error(response.error);
    }
  };

  // 챕터 삭제
  const handleDeleteChapter = async (chapterId: number) => {
    const response = await lecturesApi.deleteChapter(chapterId);
    if (response.success) {
      alert('챕터가 삭제되었습니다.');
      loadChapters();
      loadLectures();
    } else {
      alert(`챕터 삭제 실패: ${response.error}`);
      throw new Error(response.error);
    }
  };

  // 상세보기에서 수정 버튼 클릭
  const handleEditFromDetail = async () => {
    if (detailLectureId) {
      const response = await lecturesApi.getLectureDetail(detailLectureId);
      if (response.success && response.data) {
        setShowDetailModal(false);
        setSelectedLecture(response.data);
        setShowFormModal(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">강의 관리</h1>
          <p className="text-gray-600">
            강의 생성, 수정, 삭제 및 챕터를 관리할 수 있습니다.
          </p>
        </div>

        {/* 탭 & 작성 버튼 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('lectures')}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                viewMode === 'lectures'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              강의 목록
            </button>
            <button
              onClick={() => setViewMode('chapters')}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                viewMode === 'chapters'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              챕터 관리
            </button>
          </div>

          {viewMode === 'lectures' && (
            <CustomButton variant="primary" onClick={handleOpenCreateModal}>
              + 새 강의 추가
            </CustomButton>
          )}
        </div>

        {/* 컨텐츠 영역 */}
        {viewMode === 'lectures' ? (
          <>
            <LecturesList
              lectures={lectures}
              onView={handleViewLecture}
              onEdit={handleEditLecture}
              onDelete={handleDeleteLecture}
              loading={loading}
            />

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <CustomButton
                  variant="secondary"
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  이전
                </CustomButton>
                <span className="px-4 py-2 text-gray-700">
                  {currentPage + 1} / {totalPages}
                </span>
                <CustomButton
                  variant="secondary"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  다음
                </CustomButton>
              </div>
            )}
          </>
        ) : (
          <ChapterManagement
            chapters={chapters}
            onRefresh={loadChapters}
            onCreate={handleCreateChapter}
            onDelete={handleDeleteChapter}
          />
        )}
      </main>

      {/* 강의 작성/수정 모달 */}
      {showFormModal && (
        <LectureFormModal
          lecture={selectedLecture}
          chapters={chapters}
          onClose={() => {
            setShowFormModal(false);
            setSelectedLecture(null);
          }}
          onSubmit={selectedLecture ? handleUpdateLecture : handleCreateLecture}
        />
      )}

      {/* 강의 상세보기 모달 */}
      {showDetailModal && detailLectureId && (
        <LectureDetailModal
          lectureId={detailLectureId}
          onClose={() => {
            setShowDetailModal(false);
            setDetailLectureId(null);
          }}
          onEdit={handleEditFromDetail}
        />
      )}
    </div>
  );
}
