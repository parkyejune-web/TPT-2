'use client';

import { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';
import type { ColumnCategory } from '../../api/columns';

interface CategoryManagementProps {
  categories: ColumnCategory[];
  onRefresh: () => void;
  onCreate: (name: string, color: string) => Promise<void>;
  onUpdate: (categoryId: number, name: string, color: string) => Promise<void>;
  onDelete: (categoryId: number) => Promise<void>;
}

export default function CategoryManagement({
  categories,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete,
}: CategoryManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ColumnCategory | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { value: '빨강', label: '빨강', class: 'bg-red-500' },
    { value: '주황', label: '주황', class: 'bg-orange-500' },
    { value: '노랑', label: '노랑', class: 'bg-yellow-500' },
    { value: '초록', label: '초록', class: 'bg-green-500' },
    { value: '파랑', label: '파랑', class: 'bg-blue-500' },
    { value: '남색', label: '남색', class: 'bg-indigo-500' },
    { value: '보라', label: '보라', class: 'bg-purple-500' },
    { value: '분홍', label: '분홍', class: 'bg-pink-500' },
    { value: '회색', label: '회색', class: 'bg-gray-500' },
  ];

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setColor('');
    setShowModal(true);
  };

  const handleOpenEditModal = (category: ColumnCategory) => {
    setEditingCategory(category);
    setName(category.name);
    setColor(category.color);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setName('');
    setColor('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }
    if (!color) {
      alert('카테고리 색상을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await onUpdate(editingCategory.id, name, color);
      } else {
        await onCreate(name, color);
      }
      handleCloseModal();
      onRefresh();
    } catch (error) {
      console.error('카테고리 저장 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: ColumnCategory) => {
    if (
      confirm(
        `"${category.name}" 카테고리를 삭제하시겠습니까?\n이 카테고리를 사용하는 칼럼이 있을 경우 삭제할 수 없습니다.`
      )
    ) {
      try {
        await onDelete(category.id);
        onRefresh();
      } catch (error) {
        console.error('카테고리 삭제 실패:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">카테고리 관리</h3>
        <CustomButton variant="primary" onClick={handleOpenCreateModal}>
          + 카테고리 추가
        </CustomButton>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>등록된 카테고리가 없습니다.</p>
          <p className="text-sm mt-2">새 카테고리를 추가해보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full ${
                      colorOptions.find((c) => c.value === category.color)?.class ||
                      'bg-gray-500'
                    }`}
                  ></span>
                  <span className="font-semibold text-gray-900">{category.name}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                생성일: {formatDate(category.createdAt)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEditModal(category)}
                  className="flex-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="flex-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 카테고리 생성/수정 모달 */}
      {showModal && (
        <CustomModal
          title={editingCategory ? '카테고리 수정' : '새 카테고리 추가'}
          onClose={handleCloseModal}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                카테고리 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: ETF, 주식, 투자 전략"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                카테고리 색상 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    type="button"
                    onClick={() => setColor(colorOption.value)}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all ${
                      color === colorOption.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${colorOption.class}`}></span>
                    <span className="text-sm">{colorOption.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <CustomButton
                variant="secondary"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                취소
              </CustomButton>
              <CustomButton variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? '저장 중...' : editingCategory ? '수정' : '추가'}
              </CustomButton>
            </div>
          </form>
        </CustomModal>
      )}
    </div>
  );
}
