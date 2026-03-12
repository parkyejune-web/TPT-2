'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BookOpen, ChevronDown, ThumbsUp, MessageCircle } from 'lucide-react';
import { getColumnList } from '../../../Shared/api/services/columnService';
import { useWindowWidth } from '../../../Shared/hooks/useWindowWidth';

/**
 * TPT 성장일지 페이지
 * 카테고리가 "성장일지"인 칼럼만 표시
 */
export default function GrowthPage() {
  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 860;
  const [allColumns, setAllColumns] = useState<any[]>([]); // 전체 데이터
  const [filteredColumns, setFilteredColumns] = useState<any[]>([]); // 필터링된 데이터 (성장일지만)
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrainer, setSelectedTrainer] = useState('전체 트레이너');
  const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);
  const [isBannerLoaded, setIsBannerLoaded] = useState(false);

  // 트레이너 목록 (동적 생성)
  const [trainers, setTrainers] = useState<string[]>(['전체 트레이너']);

  const itemsPerPage = 10;
  const GROWTH_CATEGORY = '성장일지'; // 성장일지 카테고리명

  // HTML 태그 제거 유틸리티 함수
  const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        // 전체 칼럼 조회
        const res = await getColumnList(0, 100);
        if (res.success && res.data) {
          const fetchedColumns = res.data.content || res.data;
          console.log('[GrowthPage] 전체 칼럼 데이터:', fetchedColumns);

          // "성장일지" 카테고리만 필터링
          const growthColumns = fetchedColumns.filter(
            (col: any) => col.categoryName === GROWTH_CATEGORY
          );
          console.log('[GrowthPage] 성장일지 필터링 결과:', growthColumns);

          setAllColumns(growthColumns);
          setFilteredColumns(growthColumns);

          // 트레이너 목록 추출 (중복 제거)
          const trainerSet = new Set<string>(
            growthColumns.map((col: any) => col.writerName).filter((trainer: string) => trainer)
          );
          const uniqueTrainers: string[] = ['전체 트레이너', ...Array.from(trainerSet)];
          setTrainers(uniqueTrainers);
        }
      } catch (error) {
        console.error('[GrowthPage] 칼럼 목록 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, []);

  // 트레이너 필터링
  useEffect(() => {
    let filtered = [...allColumns];

    if (selectedTrainer !== '전체 트레이너') {
      filtered = filtered.filter((col) => col.writerName === selectedTrainer);
    }

    console.log('[GrowthPage] 트레이너 필터링 결과:', {
      selectedTrainer,
      filteredCount: filtered.length,
    });

    setFilteredColumns(filtered);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  }, [selectedTrainer, allColumns]);

  const handleColumnClick = (columnId: number) => {
    router.push(`/menu/columns/${columnId}`);
  };

  // 페이지네이션 계산 (필터링된 데이터 기준)
  const totalPages = Math.ceil(filteredColumns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentColumns = filteredColumns.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* 배너 이미지 - 반응형 */}
      <section className="relative w-full">
        <div className="relative w-full" style={{ minHeight: isMobile ? '200px' : '400px' }}>
          {!isBannerLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="text-gray-600 font-medium">로딩 중...</p>
              </div>
            </div>
          )}
          <Image
            src={isMobile ? '/images/banners/final_growth_banner_mobile_3.png' : '/images/banners/final_growth_banner_desk_3.png'}
            alt="TPT 성장일지"
            width={1920}
            height={1080}
            className={`w-full h-auto object-contain transition-opacity duration-300 ${isBannerLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsBannerLoaded(true)}
            priority
            // unoptimized
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="text-lg font-semibold text-gray-700">
            전체 {filteredColumns.length}개의 성장일지
          </div>

          {/* 트레이너 필터 드롭다운 */}
          {trainers.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setShowTrainerDropdown(!showTrainerDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <span className="text-sm font-medium text-gray-700">{selectedTrainer}</span>
                <ChevronDown size={18} className="text-gray-500" />
              </button>

              {showTrainerDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {trainers.map((trainer) => (
                    <button
                      key={trainer}
                      onClick={() => {
                        setSelectedTrainer(trainer);
                        setShowTrainerDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                        selectedTrainer === trainer ? 'bg-green-50 text-green-700 font-medium' : ''
                      }`}
                    >
                      {trainer}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredColumns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <BookOpen size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              아직 작성된 성장일지가 없습니다.
            </h3>
            <p className="text-gray-600">곧 새로운 성장일지가 업데이트될 예정입니다.</p>
          </div>
        )}

        {/* Columns List */}
        {filteredColumns.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6">
              {currentColumns.map((column) => (
                <div
                  key={column.columnId}
                  onClick={() => handleColumnClick(column.columnId)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-gray-100 hover:border-green-300"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-green-600 transition">
                          {column.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="font-medium text-green-600">{column.writerName}</span>
                          <span>•</span>
                          <span>{new Date(column.createdAt).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Preview Text */}
                    {column.content && (
                      <p className="text-gray-600 line-clamp-2 mb-4">{stripHtmlTags(column.content)}</p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ThumbsUp size={16} />
                        <span>{column.likeCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        <span>{column.commentCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  이전
                </button>
                <span className="text-gray-700 font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </section>

    </div>
  );
}
