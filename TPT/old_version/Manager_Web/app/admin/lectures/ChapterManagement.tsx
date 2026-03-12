'use client';

import { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import type { Chapter, ChapterType } from '../../api/lectures';

interface ChapterManagementProps {
  chapters: Chapter[];
  onRefresh: () => void;
  onCreate: (data: {
    title: string;
    description: string;
    chapterType: ChapterType;
    chapterOrder: number;
  }) => Promise<void>;
  onDelete: (chapterId: number) => Promise<void>;
}

export default function ChapterManagement({
  chapters,
  onRefresh,
  onCreate,
  onDelete,
}: ChapterManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    chapterType: 'REGULAR' as ChapterType,
    chapterOrder: chapters.length + 1,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'chapterOrder' ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreate(formData);
      setFormData({
        title: '',
        description: '',
        chapterType: 'REGULAR',
        chapterOrder: chapters.length + 2,
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create chapter:', error);
    }
  };

  const handleDelete = async (chapterId: number, title: string) => {
    if (confirm(`"${title}" 챕터를 삭제하시겠습니까?\n챕터 내 모든 강의도 함께 삭제됩니다.`)) {
      await onDelete(chapterId);
    }
  };

  const getChapterTypeLabel = (type: ChapterType) => {
    return type === 'PRO' ? '유료' : '무료';
  };

  return (
    <div className="space-y-6">
      {/* 챕터 생성 버튼 */}
      <div className="flex justify-end">
        <CustomButton
          variant="primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '취소' : '+ 새 챕터 추가'}
        </CustomButton>
      </div>

      {/* 챕터 생성 폼 */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">새 챕터 추가</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                챕터 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 기본 개념"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                챕터 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="챕터에 대한 설명을 입력하세요"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  챕터 유형 <span className="text-red-500">*</span>
                </label>
                <select
                  name="chapterType"
                  value={formData.chapterType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="REGULAR">무료 (REGULAR)</option>
                  <option value="PRO">유료 (PRO)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  챕터 순서 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="chapterOrder"
                  value={formData.chapterOrder}
                  onChange={handleInputChange}
                  required
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <CustomButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({
                    title: '',
                    description: '',
                    chapterType: 'REGULAR',
                    chapterOrder: chapters.length + 1,
                  });
                }}
              >
                취소
              </CustomButton>
              <CustomButton type="submit" variant="primary">
                추가하기
              </CustomButton>
            </div>
          </form>
        </div>
      )}

      {/* 챕터 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {chapters.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            등록된 챕터가 없습니다.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  순서
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  챕터명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  설명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  강의 수
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
              {chapters
                .sort((a, b) => a.chapterOrder - b.chapterOrder)
                .map((chapter) => (
                  <tr key={chapter.chapterId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {chapter.chapterOrder}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <p className="font-medium">{chapter.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p className="max-w-xs truncate">{chapter.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          chapter.chapterType === 'PRO'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {getChapterTypeLabel(chapter.chapterType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {chapter.lectureCount || 0}개
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(chapter.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <CustomButton
                        variant="danger"
                        onClick={() => handleDelete(chapter.chapterId, chapter.title)}
                        className="text-xs"
                      >
                        삭제
                      </CustomButton>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
