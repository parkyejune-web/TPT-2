'use client';

import { useState, useEffect } from 'react';
import CustomButton from '../../components/CustomButton';
import { getNewSubscriptionCustomers, type NewSubscriptionCustomer } from '../../api/users';

export default function NewSubscriptionCustomersTable() {
  const [customers, setCustomers] = useState<NewSubscriptionCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadCustomers(0);
  }, []);

  const loadCustomers = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await getNewSubscriptionCustomers(pageNum, 20);
      if (response.success && response.data) {
        if (pageNum === 0) {
          setCustomers(response.data.content || []);
        } else {
          setCustomers((prev) => [...prev, ...(response.data?.content || [])]);
        }
        setHasMore(!response.data.last);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('신규 구독 고객 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelTestBadge = (customer: NewSubscriptionCustomer) => {
    if (!customer.hasAttemptedLevelTest) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">미응시</span>;
    }
    const info = customer.levelTestInfo;
    if (!info) {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">응시함</span>;
    }
    const statusMap: Record<string, { text: string; color: string }> = {
      'SUBMITTED': { text: '제출됨', color: 'bg-yellow-100 text-yellow-800' },
      'GRADING': { text: '채점 중', color: 'bg-blue-100 text-blue-800' },
      'GRADED': { text: `채점 완료 (${info.grade || '-'})`, color: 'bg-green-100 text-green-800' },
    };
    const badge = statusMap[info.status || ''] || { text: info.status || '응시함', color: 'bg-gray-100 text-gray-600' };
    return <span className={`px-2 py-1 text-xs rounded-full ${badge.color}`}>{badge.text}</span>;
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">신규 PRO 고객 목록</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {['고객 ID', '이름', '전화번호', '레벨테스트', '상담 여부', '배정 트레이너'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    신규 구독 고객이 없습니다.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{customer.customerId}</td>
                    <td className="px-6 py-4 text-sm font-medium">{customer.name}</td>
                    <td className="px-6 py-4 text-sm">{customer.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm">{getLevelTestBadge(customer)}</td>
                    <td className="px-6 py-4 text-sm">
                      {customer.hasConsultation ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">완료</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">미진행</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {customer.assignedTrainerName || (
                        <span className="text-gray-400">미배정</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {hasMore && customers.length > 0 && (
          <div className="p-4 border-t flex justify-center">
            <CustomButton
              variant="secondary"
              onClick={() => loadCustomers(page + 1)}
              disabled={loading}
            >
              {loading ? '로딩 중...' : '더 보기'}
            </CustomButton>
          </div>
        )}
      </div>
    </section>
  );
}
