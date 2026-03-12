'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, ChevronDown } from 'lucide-react';
import { getColumnList } from '../../../Shared/api/services/columnService';
import AccessGuard from '../../../Shared/ui/AccessGuard';

/**
 * TPT 전문가 분석 페이지 (insight로 이동)
 * 카테고리를 All로 설정하여 모든 칼럼 목록 표시
 */
export default function InsightPage() {
  const router = useRouter();
  const [allColumns, setAllColumns] = useState<any[]>([]); // 전체 데이터
  const [filteredColumns, setFilteredColumns] = useState<any[]>([]); // 필터링된 데이터
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [selectedTrainer, setSelectedTrainer] = useState('전체 트레이너');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);

  // 카테고리와 트레이너 목록 (동적 생성)
  const [categories, setCategories] = useState<string[]>(['전체 카테고리']);
  const [trainers, setTrainers] = useState<string[]>(['전체 트레이너']);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        // 전체 칼럼 조회
        const res = await getColumnList(0, 100);
        if (res.success && res.data) {
          const fetchedColumns = res.data.content || res.data;
          console.log('[InsightPage] 칼럼 데이터:', fetchedColumns);

          setAllColumns(fetchedColumns);
          setFilteredColumns(fetchedColumns);

          // 카테고리 목록 추출 (중복 제거)
          const categorySet = new Set<string>(
            fetchedColumns
              .map((col: any) => col.categoryName)
              .filter((cat: string) => cat)
          );
          const uniqueCategories: string[] = ['전체 카테고리', ...Array.from(categorySet)];
          setCategories(uniqueCategories);

          // 트레이너 목록 추출 (중복 제거)
          const trainerSet = new Set<string>(
            fetchedColumns
              .map((col: any) => col.writerName)
              .filter((trainer: string) => trainer)
          );
          const uniqueTrainers: string[] = ['전체 트레이너', ...Array.from(trainerSet)];
          setTrainers(uniqueTrainers);
        }
      } catch (error) {
        console.error('칼럼 목록 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, []);

  // 필터링 로직
  useEffect(() => {
    let filtered = [...allColumns];

    // 카테고리 필터링
    if (selectedCategory !== '전체 카테고리') {
      filtered = filtered.filter((col) => col.categoryName === selectedCategory);
    }

    // 트레이너 필터링
    if (selectedTrainer !== '전체 트레이너') {
      filtered = filtered.filter((col) => col.writerName === selectedTrainer);
    }

    console.log('[InsightPage] 필터링 결과:', {
      selectedCategory,
      selectedTrainer,
      filteredCount: filtered.length,
    });

    setFilteredColumns(filtered);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  }, [selectedCategory, selectedTrainer, allColumns]);

  const handleColumnClick = (columnId: number) => {
    router.push(`/menu/columns/${columnId}`);
  };

  // 페이지네이션 계산 (필터링된 데이터 기준)
  const totalPages = Math.ceil(filteredColumns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentColumns = filteredColumns.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AccessGuard level="UID_APPROVED_REQUIRED">
    <div className="min-h-screen bg-white">
      <main className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 섹션 */}
          <section className="text-center mb-8 md:mb-12 mt-8 md:mt-12">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              트레이딩 전문가의 칼럼을 읽어보세요.
            </h3>
          </section>

          {/* 필터 영역 */}
          <div className="flex gap-3 mb-8">
            {/* 카테고리 필터 */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowTrainerDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>{selectedCategory}</span>
                <ChevronDown size={16} />
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        selectedCategory === cat ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 트레이너 필터 */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTrainerDropdown(!showTrainerDropdown);
                  setShowCategoryDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>{selectedTrainer}</span>
                <ChevronDown size={16} />
              </button>
              {showTrainerDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                  {trainers.map((trainer) => (
                    <button
                      key={trainer}
                      onClick={() => {
                        setSelectedTrainer(trainer);
                        setShowTrainerDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        selectedTrainer === trainer ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {trainer}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 칼럼 목록 */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">로딩 중...</p>
            </div>
          ) : filteredColumns.length === 0 ? (
            <div className="text-center py-20">
              <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">
                {allColumns.length === 0
                  ? '아직 등록된 분석 칼럼이 없습니다.'
                  : '선택한 필터에 해당하는 칼럼이 없습니다.'}
              </p>
            </div>
          ) : (
            <>
              {/* 1컬럼 리스트 형태 */}
              <div className="space-y-8 mb-12">
                {currentColumns.map((column) => (
                  <div
                    key={column.columnId}
                    onClick={() => handleColumnClick(column.columnId)}
                    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200 flex gap-6 p-4"
                  >
                    {/* 썸네일 이미지 (좌측) */}
                    <div className="flex-shrink-0 w-1/2 md:w-2/5">
                      <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                        <img
                          src={column.thumbnailImage || '/images/column_default_thumbnail.svg'}
                          alt={column.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* 텍스트 정보 (우측) */}
                    <div className="flex-1 flex flex-col justify-between py-2">
                      {/* 카테고리 뱃지 */}
                      {column.categoryName && (
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-2 w-fit">
                          {column.categoryName}
                        </span>
                      )}

                      {/* 제목 */}
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {column.title}
                      </h3>

                      {/* 요약 */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                        {column.subtitle || '칼럼 내용'}
                      </p>

                      {/* 좋아요/댓글 수 */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>좋아요 {column.likeCount || 0}</span>
                        <span>댓글 {column.commentCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-8">
                  {/* 이전 버튼 */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    &lt;
                  </button>

                  {/* 페이지 번호 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* 다음 버튼 */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

    </div>
    </AccessGuard>
  );
}
