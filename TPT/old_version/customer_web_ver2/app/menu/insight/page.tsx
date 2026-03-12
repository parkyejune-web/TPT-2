'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from '../../../Widget/Footer';
import { TrendingUp, Calendar, User, Eye } from 'lucide-react';
import { getColumnList, getColumnCategories } from '../../../Shared/api/services/columnService';

/**
 * 10억 인사이트 페이지
 * 카테고리가 'insight'인 칼럼 목록 표시
 */
export default function InsightPage() {
  const router = useRouter();
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightCategoryId, setInsightCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 카테고리 목록 조회하여 'insight' 카테고리 ID 찾기
        const categoriesRes = await getColumnCategories();
        if (categoriesRes.success && categoriesRes.data) {
          const insightCategory = categoriesRes.data.find(
            (cat: any) => cat.name?.toLowerCase() === 'insight'
          );
          if (insightCategory) {
            setInsightCategoryId(insightCategory.id);

            // 2. insight 카테고리의 칼럼 목록 조회
            const columnsRes = await getColumnList(0, 20, insightCategory.id);
            if (columnsRes.success && columnsRes.data) {
              setColumns(columnsRes.data.content || columnsRes.data);
            }
          }
        }
      } catch (error) {
        console.error('칼럼 목록 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
              <TrendingUp size={48} className="text-yellow-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              10억 인사이트
            </h1>
            <p className="text-xl text-gray-600">
              10억 수익을 달성한 트레이더의 실전 인사이트와 전략
            </p>
          </section>

          {/* 칼럼 목록 */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
              <p className="mt-4 text-gray-600">로딩 중...</p>
            </div>
          ) : columns.length === 0 ? (
            <div className="text-center py-20">
              <TrendingUp size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">
                아직 등록된 인사이트가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {columns.map((column) => (
                <div
                  key={column.id}
                  onClick={() => handleColumnClick(column.id)}
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
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full mb-3">
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
          {/* <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              더 많은 인사이트를 받아보고 싶으신가요?
            </h2>
            <p className="text-lg mb-6 text-yellow-100">
              프리미엄 회원이 되어 전문 트레이더의 실시간 인사이트를 받아보세요
            </p>
            <a
              href="/signup"
              className="inline-block px-8 py-3 bg-white text-yellow-600 rounded-lg font-bold hover:bg-gray-100 transition"
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
