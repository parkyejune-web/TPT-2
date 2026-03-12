import { useState, useEffect, useMemo } from 'react';
import { getColumnList } from '../../../Shared/api/services/columnService';
import type { ColumnListResponseDTO } from '../../../Shared/api/apiTypes';

export interface HomeColumnData {
  id: number;
  title: string;
  subtitle?: string;
  content?: string;
  thumbnailUrl?: string | null;
  categoryName?: string;
  isBest?: boolean;
  likeCount?: number;
  commentCount?: number;
  writerName?: string;
  createdAt: string;
}

/**
 * 홈페이지용 칼럼 조회 hook
 * 전체 칼럼을 한 번만 호출하고, 카테고리별로 필터링하여 반환
 */
export function useHomeColumns() {
  const [allColumns, setAllColumns] = useState<HomeColumnData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllColumns = async () => {
      try {
        setLoading(true);
        setError(null);

        // 전체 칼럼 조회 (충분한 수량)
        const response = await getColumnList(0, 50, 'All');

        if (response.success && response.data) {
          const fetchedColumns = response.data.content;
          console.log(`📰 [홈 칼럼] 전체 칼럼 ${fetchedColumns.length}개 조회 성공`);

          // API 응답을 HomeColumnData로 매핑
          const mappedColumns: HomeColumnData[] = fetchedColumns.map((column: ColumnListResponseDTO) => ({
            id: column.columnId,
            title: column.title,
            subtitle: column.subtitle,
            content: column.content,
            thumbnailUrl: column.thumbnailImage,
            categoryName: column.categoryName,
            isBest: column.isBest,
            likeCount: column.likeCount,
            commentCount: column.commentCount,
            writerName: column.writerName,
            createdAt: column.createdAt,
          }));

          setAllColumns(mappedColumns);
        } else {
          console.error(`❌ [홈 칼럼] 조회 실패:`, response.message);
          setError(response.message || '칼럼을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('❌ [홈 칼럼] 조회 에러:', err);
        setError('칼럼을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllColumns();
  }, []);

  // 10억인사이트 카테고리 필터링
  const billionJournalColumns = useMemo(() => {
    return allColumns.filter(col => col.categoryName === '10억인사이트');
  }, [allColumns]);

  // 성장일지 카테고리 필터링
  const growthDiaryColumns = useMemo(() => {
    return allColumns.filter(col => col.categoryName === '성장일지');
  }, [allColumns]);

  return {
    allColumns,
    billionJournalColumns,
    growthDiaryColumns,
    loading,
    error,
  };
}
