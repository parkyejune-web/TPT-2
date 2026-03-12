'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from '../../../Widget/Footer';
import { BarChart3, Calendar, User, Eye } from 'lucide-react';
import { getColumnList } from '../../../Shared/api/services/columnService';

/**
 * TPT 전문가 분석 페이지
 * 카테고리를 All로 설정하여 모든 칼럼 목록 표시
 */
export default function AnalysisPage() {
  const router = useRouter();
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        // 카테고리 ID 없이 호출하면 전체 칼럼 조회
        const res = await getColumnList(0, 20);
        if (res.success && res.data) {
          setColumns(res.data.content || res.data);
        }
      } catch (error) {
        console.error('칼럼 목록 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, []);

  const handleColumnClick = (columnId: number) => {
    router.push(`/menu/columns/${columnId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 섹션 */}
          <section className="text-center mb-16 mt-12">
            <div className="flex justify-center mb-4">
              <BarChart3 size={48} className="text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              TPT 전문가 분석
            </h1>
            <p className="text-xl text-gray-600">
              전문 트레이더의 시장 분석과 매매 전략
            </p>
          </section>

          {/* 칼럼 목록 */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">로딩 중...</p>
            </div>
          ) : columns.length === 0 ? (
            <div className="text-center py-20">
              <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">
                아직 등록된 분석 칼럼이 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {columns.map((column) => (
                <div
                  key={column.columnId}
                  onClick={() => handleColumnClick(column.columnId)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                >
                  {/* 썸네일 이미지 */}
                  {column.thumbnailImage && (
                    <div className="w-full h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={column.thumbnailImage}
                        alt={column.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* 콘텐츠 */}
                  <div className="p-6">
                    {/* 카테고리 배지 */}
                    {column.categoryName && (
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full mb-3">
                        {column.categoryName}
                      </span>
                    )}

                    {/* 제목 */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {column.title}
                    </h3>

                    {/* 요약 */}
                    {column.summary && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {column.summary}
                      </p>
                    )}

                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        {column.createdAt && (
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(column.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        {column.viewCount !== undefined && (
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>{column.viewCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA 섹션 */}
          {/* <section className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              전문가의 시장 분석을 실시간으로 받아보세요
            </h2>
            <p className="text-lg mb-6 text-purple-100">
              프리미엄 회원이 되어 전문 트레이더의 심층 분석을 받아보세요
            </p>
            <a
              href="/signup"
              className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              프리미엄 시작하기
            </a>
          </section> */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
