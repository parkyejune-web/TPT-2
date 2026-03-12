'use client';

import { useState, useEffect } from 'react';
import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';
import { getFreeCustomers, grantUserToken, type FreeCustomer } from '../../api/users';

export default function FreeCustomersTable() {
  const [customers, setCustomers] = useState<FreeCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // 토큰 부여 모달
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<FreeCustomer | null>(null);
  const [tokenCount, setTokenCount] = useState('');
  const [grantingToken, setGrantingToken] = useState(false);

  useEffect(() => {
    loadCustomers(0);
  }, []);

  const loadCustomers = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await getFreeCustomers(pageNum, 20);
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
      console.error('미구독 고객 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const openTokenModal = (customer: FreeCustomer) => {
    setSelectedCustomer(customer);
    setTokenCount('');
    setShowTokenModal(true);
  };

  const handleGrantToken = async () => {
    if (!selectedCustomer) return;

    const tokenNum = parseInt(tokenCount);
    if (!tokenCount || isNaN(tokenNum) || tokenNum <= 0) {
      alert('올바른 토큰 개수를 입력해주세요.');
      return;
    }

    setGrantingToken(true);
    try {
      const response = await grantUserToken(selectedCustomer.customerId, tokenNum);
      if (response.success) {
        alert(`${selectedCustomer.name}님에게 토큰 ${tokenNum}개를 부여했습니다.`);
        // 목록 새로고침
        loadCustomers(0);
        setShowTokenModal(false);
      } else {
        alert(`토큰 부여 실패: ${response.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setGrantingToken(false);
    }
  };

  const getInvestmentTypeBadge = (type: string | null) => {
    if (!type) return <span className="text-gray-400">-</span>;
    const typeMap: Record<string, { text: string; color: string }> = {
      'SCALPING': { text: '스켈핑', color: 'bg-orange-100 text-orange-800' },
      'DAY': { text: '데이', color: 'bg-blue-100 text-blue-800' },
      'SWING': { text: '스윙', color: 'bg-purple-100 text-purple-800' },
    };
    const badge = typeMap[type] || { text: type, color: 'bg-gray-100 text-gray-600' };
    return <span className={`px-2 py-1 text-xs rounded-full ${badge.color}`}>{badge.text}</span>;
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">REGULAR 고객 목록</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {['고객 ID', '이름', '전화번호', '투자 유형', '보유 토큰', '가입일', '토큰 부여'].map((h) => (
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
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    미구독 고객이 없습니다.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{customer.customerId}</td>
                    <td className="px-6 py-4 text-sm font-medium">{customer.name}</td>
                    <td className="px-6 py-4 text-sm">{customer.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm">{getInvestmentTypeBadge(customer.primaryInvestmentType)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">{customer.token}개</td>
                    <td className="px-6 py-4 text-sm">
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <CustomButton
                        variant="primary"
                        onClick={() => openTokenModal(customer)}
                      >
                        토큰 부여
                      </CustomButton>
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

      {/* 토큰 부여 모달 */}
      {showTokenModal && selectedCustomer && (
        <CustomModal
          title="토큰 부여"
          onClose={() => setShowTokenModal(false)}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">고객명:</span> {selectedCustomer.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">현재 보유 토큰:</span> {selectedCustomer.token}개
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                부여할 토큰 개수
              </label>
              <input
                type="number"
                value={tokenCount}
                onChange={(e) => setTokenCount(e.target.value)}
                placeholder="토큰 개수를 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                min="1"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <CustomButton
                variant="secondary"
                onClick={() => setShowTokenModal(false)}
                disabled={grantingToken}
              >
                취소
              </CustomButton>
              <CustomButton
                variant="primary"
                onClick={handleGrantToken}
                disabled={grantingToken}
              >
                {grantingToken ? '부여 중...' : '토큰 부여'}
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      )}
    </section>
  );
}
