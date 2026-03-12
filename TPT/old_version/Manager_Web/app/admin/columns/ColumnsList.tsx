'use client';

import { useState } from 'react';
import type { Column } from '../../api/columns';
import CustomButton from '../../components/CustomButton';

interface ColumnsListProps {
  columns: Column[];
  onView: (column: Column) => void;
  onEdit: (column: Column) => void;
  onDelete: (columnId: number) => void;
  onToggleBest: (columnId: number, isBest: boolean) => void;
  loading?: boolean;
}

export default function ColumnsList({
  columns,
  onView,
  onEdit,
  onDelete,
  onToggleBest,
  loading = false,
}: ColumnsListProps) {
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

  const handleDelete = (column: Column) => {
    if (
      confirm(
        `"${column.title}" 칼럼을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      onDelete(column.columnId);
    }
  };

  const handleToggleBest = (column: Column) => {
    const message = column.isBest
      ? `"${column.title}" 칼럼의 베스트 지정을 해제하시겠습니까?`
      : `"${column.title}" 칼럼을 베스트로 지정하시겠습니까?`;

    if (confirm(message)) {
      onToggleBest(column.columnId, !column.isBest);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">칼럼 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          작성된 칼럼이 없습니다
        </h3>
        <p className="text-gray-500">새로운 칼럼을 작성해보세요.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                베스트
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                카테고리
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                작성자
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                조회수
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                좋아요
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                댓글
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                작성일
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-48">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {columns.map((column) => (
              <tr key={column.columnId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {column.isBest && (
                    <span className="text-yellow-500 text-xl" title="베스트 칼럼">
                      ⭐
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                      onClick={() => onView(column)}
                    >
                      {column.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                      {column.subtitle}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {column.categoryName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {column.writerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                  -
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                  {(column.likeCount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                  {(column.commentCount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(column.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => onView(column)}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    보기
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => onEdit(column)}
                    className="text-green-600 hover:text-green-800 font-medium transition-colors"
                  >
                    수정
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => handleToggleBest(column)}
                    className={`font-medium transition-colors ${
                      column.isBest
                        ? 'text-yellow-600 hover:text-yellow-800'
                        : 'text-purple-600 hover:text-purple-800'
                    }`}
                  >
                    {column.isBest ? '베스트 해제' : '베스트'}
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => handleDelete(column)}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
