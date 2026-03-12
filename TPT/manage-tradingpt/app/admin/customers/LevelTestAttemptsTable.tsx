'use client';

import { useState, useEffect } from 'react';
import { getAttempts, type AttemptStatus, type AdminLeveltestAttemptListItem } from '../../api/leveltest';

const STATUS_OPTIONS: { value: AttemptStatus; label: string; description: string }[] = [
  { value: 'SUBMITTED', label: '제출됨 (채점 전)', description: '제출은 됐지만 채점 전' },
  { value: 'GRADING', label: '채점 진행 중', description: '채점이 진행 중인 상태' },
  { value: 'GRADED', label: '채점 완료', description: '채점이 완료된 상태' },
];

export default function LevelTestAttemptsTable() {
  const [attempts, setAttempts] = useState<AdminLeveltestAttemptListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<AttemptStatus>('SUBMITTED');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadAttempts(0, selectedStatus);
  }, [selectedStatus]);

  const loadAttempts = async (pageNum: number, status: AttemptStatus) => {
    setLoading(true);
    try {
      const response = await getAttempts({ status, page: pageNum, size: 20 });
      if (response.success && response.data) {
        if (pageNum === 0) {
          setAttempts(response.data.content || []);
        } else {
          setAttempts((prev) => [...prev, ...(response.data?.content || [])]);
        }
        setHasMore(response.data.number < response.data.totalPages - 1);
        setTotalElements(response.data.totalElements);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('레벨테스트 시도 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status: AttemptStatus) => {
    setSelectedStatus(status);
    setPage(0);
    setAttempts([]);
  };

  const getStatusBadge = (status: AttemptStatus) => {
    const statusMap: Record<AttemptStatus, { text: string; color: string }> = {
      SUBMITTED: { text: '제출됨', color: 'bg-yellow-100 text-yellow-800' },
      GRADING: { text: '채점 중', color: 'bg-blue-100 text-blue-800' },
      GRADED: { text: '채점 완료', color: 'bg-green-100 text-green-800' },
    };
    const badge = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-600' };
    return <span className={`px-2 py-1 text-xs rounded-full ${badge.color}`}>{badge.text}</span>;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">레벨테스트 고객 현황 (상태별)</h2>

      {/* 상태 드롭다운 */}
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">상태 선택:</label>
        <select
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value as AttemptStatus)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">
          총 {totalElements}건
        </span>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {['시도 ID', '고객명', 'UID', '총점', '상태', '제출일시'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && attempts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : attempts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    해당 상태의 레벨테스트 시도가 없습니다.
                  </td>
                </tr>
              ) : (
                attempts.map((attempt) => (
                  <tr key={attempt.attemptId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{attempt.attemptId}</td>
                    <td className="px-6 py-4 text-sm font-medium">{attempt.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{attempt.uid || '-'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {attempt.status === 'SUBMITTED' ? '-' : attempt.totalScore}
                    </td>
                    <td className="px-6 py-4 text-sm">{getStatusBadge(attempt.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(attempt.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {hasMore && attempts.length > 0 && (
          <div className="p-4 border-t flex justify-center">
            <button
              onClick={() => loadAttempts(page + 1, selectedStatus)}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? '로딩 중...' : '더 보기'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
