'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import CustomButton from '../../components/CustomButton';
import ColumnsList from './ColumnsList';
import ColumnFormModal from './ColumnFormModal';
import ColumnDetailModal from './ColumnDetailModal';
import CategoryManagement from './CategoryManagement';
import type { Column, ColumnCategory } from '../../api/columns';
import * as columnsApi from '../../api/columns';

type ViewMode = 'columns' | 'categories';

export default function ColumnsManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('columns');
  const [columns, setColumns] = useState<Column[]>([]);
  const [categories, setCategories] = useState<ColumnCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 모달 상태
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [detailColumnId, setDetailColumnId] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
    loadColumns();
  }, [currentPage]);

  // 칼럼 목록 로드
  const loadColumns = async () => {
    setLoading(true);
    const response = await columnsApi.getColumns({
      page: currentPage,
      size: 20,
      sort: 'createdAt,desc',
    });

    if (response.success && response.data) {
      setColumns(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } else {
      console.error('칼럼 목록 로드 실패:', response.error);
    }
    setLoading(false);
  };

  // 카테고리 목록 로드
  const loadCategories = async () => {
    const response = await columnsApi.getCategories();
    if (response.success && response.data) {
      setCategories(response.data);
    } else {
      console.error('카테고리 목록 로드 실패:', response.error);
    }
  };

  // 칼럼 작성
  const handleCreateColumn = async (data: {
    title: string;
    subtitle: string;
    content: string;
    category: string;
    writerName: string;
    fontFamily: string;
    thumbnailImage?: string;
  }) => {
    const response = await columnsApi.createColumn(data);
    if (response.success) {
      alert('칼럼이 작성되었습니다.');
      loadColumns();
    } else {
      alert(`칼럼 작성 실패: ${response.error}`);
      throw new Error(response.error);
    }
  };

  // 칼럼 수정
  const handleUpdateColumn = async (data: {
    title: string;
    subtitle: string;
    content: string;
    category: string;
    writerName: string;
    fontFamily: string;
    thumbnailImage?: string;
  }) => {
    if (!selectedColumn) return;

    const response = await columnsApi.updateColumn(selectedColumn.columnId, data);
    if (response.success) {
      alert('칼럼이 수정되었습니다.');
      loadColumns();
    } else {
      alert(`칼럼 수정 실패: ${response.error}`);
      throw new Error(response.error);
    }
  };

  // 칼럼 삭제
  const handleDeleteColumn = async (columnId: number) => {
    const response = await columnsApi.deleteColumn(columnId);
    if (response.success) {
      alert('칼럼이 삭제되었습니다.');
      loadColumns();
    } else {
      alert(`칼럼 삭제 실패: ${response.error}`);
    }
  };

  // 베스트 칼럼 토글
  const handleToggleBest = async (columnId: number, isBest: boolean) => {
    const response = await columnsApi.toggleBestColumn(columnId);
    if (response.success) {
      alert(isBest ? '베스트 지정이 해제되었습니다.' : '베스트 칼럼으로 지정되었습니다.');
      loadColumns();
    } else {
      alert(`베스트 칼럼 지정 실패: ${response.error}`);
    }
  };

  // 칼럼 보기
  const handleViewColumn = (column: Column) => {
    setDetailColumnId(column.columnId);
    setShowDetailModal(true);
  };

  // 칼럼 수정 모달 열기
  const handleEditColumn = (column: Column) => {
    setSelectedColumn(column);
    setShowFormModal(true);
  };

  // 칼럼 작성 모달 열기
  const handleOpenCreateModal = () => {
    setSelectedColumn(null);
    setShowFormModal(true);
  };

  // 카테고리 생성
  const handleCreateCategory = async (name: string, color: string) => {
    const response = await columnsApi.createCategory({ name, color });
    if (response.success) {
      alert('카테고리가 생성되었습니다.');
      loadCategories();
    } else {
      alert(`카테고리 생성 실패: ${response.error}`);
      throw new Error(response.error);
    }
  };

  // 카테고리 수정
  const handleUpdateCategory = async (categoryId: number, name: string, color: string) => {
    const response = await columnsApi.updateCategory(categoryId, { name, color });
    if (response.success) {
      alert('카테고리가 수정되었습니다.');
      loadCategories();
    } else {
      alert(`카테고리 수정 실패: ${response.error}`);
      throw new Error(response.error);
    }
  };

  // 카테고리 삭제
  const handleDeleteCategory = async (categoryId: number) => {
    const response = await columnsApi.deleteCategory(categoryId);
    if (response.success) {
      alert('카테고리가 삭제되었습니다.');
      loadCategories();
    } else {
      alert(`카테고리 삭제 실패: ${response.error}`);
      throw new Error(response.error);
    }
  };

  // 상세보기에서 수정 버튼 클릭
  const handleEditFromDetail = () => {
    if (detailColumnId) {
      const column = columns.find((c) => c.columnId === detailColumnId);
      if (column) {
        setShowDetailModal(false);
        handleEditColumn(column);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">칼럼 관리</h1>
          <p className="text-gray-600">
            칼럼 작성, 수정, 삭제 및 카테고리를 관리할 수 있습니다.
          </p>
        </div>

        {/* 탭 & 작성 버튼 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('columns')}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                viewMode === 'columns'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              칼럼 목록
            </button>
            <button
              onClick={() => setViewMode('categories')}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                viewMode === 'categories'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              카테고리 관리
            </button>
          </div>

          {viewMode === 'columns' && (
            <CustomButton variant="primary" onClick={handleOpenCreateModal}>
              + 새 칼럼 작성
            </CustomButton>
          )}
        </div>

        {/* 컨텐츠 영역 */}
        {viewMode === 'columns' ? (
          <>
            <ColumnsList
              columns={columns}
              onView={handleViewColumn}
              onEdit={handleEditColumn}
              onDelete={handleDeleteColumn}
              onToggleBest={handleToggleBest}
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
          <CategoryManagement
            categories={categories}
            onRefresh={loadCategories}
            onCreate={handleCreateCategory}
            onUpdate={handleUpdateCategory}
            onDelete={handleDeleteCategory}
          />
        )}
      </main>

      {/* 칼럼 작성/수정 모달 */}
      {showFormModal && (
        <ColumnFormModal
          column={selectedColumn}
          categories={categories}
          onClose={() => {
            setShowFormModal(false);
            setSelectedColumn(null);
          }}
          onSubmit={selectedColumn ? handleUpdateColumn : handleCreateColumn}
        />
      )}

      {/* 칼럼 상세보기 모달 */}
      {showDetailModal && detailColumnId && (
        <ColumnDetailModal
          columnId={detailColumnId}
          onClose={() => {
            setShowDetailModal(false);
            setDetailColumnId(null);
          }}
          onEdit={handleEditFromDetail}
        />
      )}
    </div>
  );
}
