'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { columnService } from '../../../Shared/api/services';

interface Column {
  id: number;
  title: string;
  content: string;
  category: string;
  trainerId: number;
  trainerName: string;
  thumbnailUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

/**
 * 칼럼 목록 페이지
 */
export default function ColumnsPage() {
  const router = useRouter();
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTrainer, setSelectedTrainer] = useState('전체');

  const categories = ['전체', '주식', '채권', 'ETF', '선물', '옵션'];
  const trainers = ['전체', '트레이너 A', '트레이너 B', '트레이너 C'];

  useEffect(() => {
    loadColumns();
  }, []);

  const loadColumns = async () => {
    setLoading(true);
    try {
      const response = await columnService.getColumnList(0, 20);
      if (response.success && response.data) {
        setColumns(response.data);
      }
    } catch (error) {
      console.error('칼럼 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredColumns = columns.filter((col) => {
    const categoryMatch = selectedCategory === '전체' || col.category === selectedCategory;
    const trainerMatch = selectedTrainer === '전체' || col.trainerName === selectedTrainer;
    return categoryMatch && trainerMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">트레이딩 전문가의 칼럼을 읽어보세요</h1>

      {/* 필터 영역 */}
      <div className="flex gap-3 mb-8 w-full max-w-2xl">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === '전체' ? '전체 카테고리' : cat}
            </option>
          ))}
        </select>
        <select
          value={selectedTrainer}
          onChange={(e) => setSelectedTrainer(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          {trainers.map((trainer) => (
            <option key={trainer} value={trainer}>
              {trainer === '전체' ? '전체 트레이너' : trainer}
            </option>
          ))}
        </select>
      </div>

      {/* 칼럼 목록 */}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {filteredColumns.length === 0 ? (
          <div className="text-center py-12 text-gray-500">등록된 칼럼이 없습니다.</div>
        ) : (
          filteredColumns.map((column) => (
            <div
              key={column.id}
              onClick={() => router.push(`/columns/${column.id}`)}
              className="cursor-pointer border border-gray-200 rounded-md shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {/* 카테고리 뱃지 */}
              <div className="px-4 py-2">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    column.category === '주식'
                      ? 'bg-blue-100 text-blue-700'
                      : column.category === '채권'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {column.category}
                </span>
              </div>

              {/* 썸네일 */}
              <div className="bg-gray-100 flex items-center justify-center h-32">
                {column.thumbnailUrl ? (
                  <img
                    src={column.thumbnailUrl}
                    alt={column.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">{column.title}</span>
                )}
              </div>

              {/* 제목 및 정보 */}
              <div className="px-4 py-3">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{column.title}</h3>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{column.trainerName}</span>
                  <div className="flex gap-4">
                    <span>좋아요 {column.likesCount}</span>
                    <span>댓글 {column.commentsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
