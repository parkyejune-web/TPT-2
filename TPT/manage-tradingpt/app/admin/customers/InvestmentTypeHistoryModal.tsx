'use client';

import { useState, useEffect } from 'react';
import CustomModal from '../../components/CustomModal';
import { getCustomerInvestmentTypeHistories, type InvestmentTypeHistory } from '../../api/users';

interface InvestmentTypeHistoryModalProps {
  customerId: number;
  customerName: string;
  onClose: () => void;
}

export default function InvestmentTypeHistoryModal({
  customerId,
  customerName,
  onClose,
}: InvestmentTypeHistoryModalProps) {
  const [histories, setHistories] = useState<InvestmentTypeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistories();
  }, [customerId]);

  const loadHistories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomerInvestmentTypeHistories(customerId);
      if (response.success && response.data) {
        setHistories(response.data);
      } else {
        setError(response.error || '투자유형 이력을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getInvestmentTypeBadge = (type: string) => {
    const typeMap: Record<string, { text: string; color: string }> = {
      'SWING': { text: '스윙', color: 'bg-purple-100 text-purple-800' },
      'DAY': { text: '데이', color: 'bg-blue-100 text-blue-800' },
    };
    const badge = typeMap[type] || { text: type, color: 'bg-gray-100 text-gray-600' };
    return <span className={`px-2 py-1 text-xs rounded-full ${badge.color}`}>{badge.text}</span>;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '현재';
    try {
      return new Date(dateStr).toLocaleDateString('ko-KR');
    } catch {
      return dateStr;
    }
  };

  return (
    <CustomModal title={`${customerName}님의 투자유형 변경 이력`} onClose={onClose}>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : histories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">투자유형 변경 이력이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">투자유형</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">시작일</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">종료일</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">상태</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {histories.map((history) => (
                  <tr key={history.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {getInvestmentTypeBadge(history.investmentType)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(history.startDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(history.endDate)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {history.ongoing ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          진행중
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          종료
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CustomModal>
  );
}
