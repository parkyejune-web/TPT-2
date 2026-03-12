'use client';

import { useState, useEffect } from 'react';
import CustomModal from '../../components/CustomModal';
import { getCustomerLevelTestScoreTrend, type LevelTestScoreTrendItem } from '../../api/users';

interface LevelTestScoreTrendModalProps {
  customerId: number;
  customerName: string;
  onClose: () => void;
}

export default function LevelTestScoreTrendModal({
  customerId,
  customerName,
  onClose,
}: LevelTestScoreTrendModalProps) {
  const [scoreTrends, setScoreTrends] = useState<LevelTestScoreTrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScoreTrends();
  }, [customerId]);

  const loadScoreTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomerLevelTestScoreTrend(customerId);
      if (response.success && response.data) {
        setScoreTrends(response.data);
      } else {
        setError(response.error || '레벨테스트 성적 추이를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getGradeBadge = (grade: string) => {
    const gradeMap: Record<string, string> = {
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${gradeMap[grade] || 'bg-gray-100 text-gray-600'}`}>
        {grade}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // 성적 변화 표시 (이전 대비)
  const getScoreChange = (currentIndex: number) => {
    if (currentIndex >= scoreTrends.length - 1) return null;
    const current = scoreTrends[currentIndex].totalScore;
    const previous = scoreTrends[currentIndex + 1].totalScore;
    const diff = current - previous;

    if (diff > 0) {
      return <span className="text-green-600 text-xs ml-2">+{diff}</span>;
    } else if (diff < 0) {
      return <span className="text-red-600 text-xs ml-2">{diff}</span>;
    }
    return <span className="text-gray-400 text-xs ml-2">-</span>;
  };

  return (
    <CustomModal title={`${customerName}님의 레벨테스트 성적 추이`} onClose={onClose}>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : scoreTrends.length === 0 ? (
          <div className="text-center py-8 text-gray-500">레벨테스트 응시 이력이 없습니다.</div>
        ) : (
          <>
            {/* 요약 정보 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">총 응시 횟수</p>
                  <p className="text-2xl font-bold text-gray-900">{scoreTrends.length}회</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">최근 점수</p>
                  <p className="text-2xl font-bold text-blue-600">{scoreTrends[0]?.totalScore ?? '-'}점</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">최근 등급</p>
                  <p className="text-2xl font-bold">{scoreTrends[0] ? getGradeBadge(scoreTrends[0].grade) : '-'}</p>
                </div>
              </div>
            </div>

            {/* 성적 추이 테이블 */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">회차</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">응시일</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">점수</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">등급</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">채점 트레이너</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scoreTrends.map((trend, index) => (
                    <tr key={trend.attemptId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {trend.attemptOrder}회차
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(trend.testDate)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-medium text-gray-900">{trend.totalScore}점</span>
                        {getScoreChange(index)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getGradeBadge(trend.grade)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {trend.gradingTrainerName || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </CustomModal>
  );
}
