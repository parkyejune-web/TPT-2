import { useState, useEffect } from 'react';
import { getColumnList } from '../../../Shared/api/services/columnService';

export interface ColumnData {
  id: number;
  title: string;
  subtitle?: string;
  content?: string;
  thumbnailUrl?: string | null;
  categoryName?: string;
  isBest?: boolean;
  likeCount?: number;
  viewCount?: number;
  createdAt: string;
}

/**
 * 칼럼 목록 조회 hook
 * @param size 조회할 칼럼 개수
 * @param category 카테고리명 (All, bestDiary, traiderDiary, normal 등)
 */
export function useColumns(size: number = 12, category: string = 'All') {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getColumnList(0, size, category);

        if (response.success && response.data) {
          const fetchedColumns = response.data.content || response.data;
          console.log(`[useColumns] 카테고리 "${category}"의 칼럼 ${fetchedColumns.length}개 조회 성공`);

          // API 응답의 thumbnailImage를 thumbnailUrl로 매핑
          const mappedColumns = fetchedColumns.map((column: any) => ({
            id: column.columnId,
            title: column.title,
            subtitle: column.subtitle,
            content: column.content,
            thumbnailUrl: column.thumbnailImage,
            categoryName: column.categoryName,
            isBest: column.isBest,
            likeCount: column.likeCount,
            viewCount: column.commentCount, // commentCount를 viewCount로 사용
            createdAt: column.createdAt,
          }));

          setColumns(mappedColumns);
        } else {
          console.error(`[useColumns] 칼럼 조회 실패:`, response.message);
          setError(response.message || '칼럼을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('[useColumns] 칼럼 조회 에러:', err);
        setError('칼럼을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, [size, category]);

  return { columns, loading, error };
}

/**
 * 베스트 칼럼 조회 hook (bestDiary 카테고리)
 */
export function useBestColumns(size: number = 6) {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestColumns = async () => {
      try {
        setLoading(true);
        setError(null);

        // bestDiary 카테고리로 조회
        const response = await getColumnList(0, size, 'bestDiary');

        if (response.success && response.data) {
          const fetchedColumns = response.data.content || response.data;
          console.log(`[useBestColumns] 베스트 칼럼 ${fetchedColumns.length}개 조회 성공`);

          // API 응답의 thumbnailImage를 thumbnailUrl로 매핑
          const mappedColumns = fetchedColumns.map((column: any) => ({
            id: column.columnId,
            title: column.title,
            subtitle: column.subtitle,
            content: column.content,
            thumbnailUrl: column.thumbnailImage,
            categoryName: column.categoryName,
            isBest: column.isBest,
            likeCount: column.likeCount,
            viewCount: column.commentCount, // commentCount를 viewCount로 사용
            createdAt: column.createdAt,
          }));

          setColumns(mappedColumns);
        } else {
          console.error(`[useBestColumns] 칼럼 조회 실패:`, response.message);
          setError(response.message || '칼럼을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('[useBestColumns] 베스트 칼럼 조회 에러:', err);
        setError('칼럼을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBestColumns();
  }, [size]);

  return { columns, loading, error };
}
