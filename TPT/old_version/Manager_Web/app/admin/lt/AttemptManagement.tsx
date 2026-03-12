'use client';

import { useState, useEffect } from 'react';
import {
  getAttempts,
  getAttemptStatusLabel,
  getAttemptStatusColor,
  type AdminLeveltestAttemptListItem,
  type AttemptStatus,
} from '../../api/leveltest';
import GradingModal from './GradingModal';

export default function AttemptManagement() {
  const [attempts, setAttempts] = useState<AdminLeveltestAttemptListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AttemptStatus | 'ALL'>('ALL');
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null);

  useEffect(() => {
    loadAttempts();
  }, [statusFilter]);

  const loadAttempts = async () => {
    setLoading(true);
    const response = await getAttempts({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      page: 0,
      size: 100,
    });

    if (response.success && response.data) {
      setAttempts(response.data.content || []);
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleGrade = (attemptId: number) => {
    setSelectedAttemptId(attemptId);
  };

  const handleGradingClose = (reload?: boolean) => {
    setSelectedAttemptId(null);
    if (reload) loadAttempts();
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">시도 목록</h2>

        <div className="flex gap-2">
          {(['ALL', 'SUBMITTED', 'GRADING', 'GRADED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'ALL' ? '전체' : getAttemptStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-center py-4 text-gray-500">로딩 중...</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                시도 ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                응시자
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                점수
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                상태
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                제출 일시
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attempts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  레벨테스트 시도가 없습니다.
                </td>
              </tr>
            ) : (
              attempts.map((attempt) => (
                <tr key={attempt.attemptId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    #{attempt.attemptId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{attempt.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {attempt.totalScore}점
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getAttemptStatusColor(
                        attempt.status
                      )}`}
                    >
                      {getAttemptStatusLabel(attempt.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDateTime(attempt.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleGrade(attempt.attemptId)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {attempt.status === 'GRADED' ? '확인' : '채점'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedAttemptId && (
        <GradingModal attemptId={selectedAttemptId} onClose={handleGradingClose} />
      )}
    </div>
  );
}
