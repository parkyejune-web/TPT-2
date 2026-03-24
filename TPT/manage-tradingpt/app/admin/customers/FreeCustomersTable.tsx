'use client';

import { useState, useEffect } from 'react';
import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';
import { getFreeCustomers, grantUserToken, deleteUserHard, updateUserUid, type FreeCustomer } from '../../api/users';
import InvestmentTypeHistoryModal from './InvestmentTypeHistoryModal';
import TradingHistoryModal from '../mypage/TradingHistoryModal';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  showDeleteButton?: boolean;
}

export default function FreeCustomersTable({ showDeleteButton = false }: Props) {
  const { isAdmin } = useAuth();
  const [customers, setCustomers] = useState<FreeCustomer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // 토큰 부여 모달
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<FreeCustomer | null>(null);
  const [tokenCount, setTokenCount] = useState('');
  const [grantingToken, setGrantingToken] = useState(false);

  // 투자유형 이력 모달
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyCustomer, setHistoryCustomer] = useState<FreeCustomer | null>(null);

  // 매매일지 내역 모달
  const [showTradingHistoryModal, setShowTradingHistoryModal] = useState(false);
  const [tradingHistoryCustomer, setTradingHistoryCustomer] = useState<FreeCustomer | null>(null);

  // 삭제 모달
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState<FreeCustomer | null>(null);
  const [deleting, setDeleting] = useState(false);

  // UID 수정 모달
  const [showUidModal, setShowUidModal] = useState(false);
  const [uidCustomer, setUidCustomer] = useState<FreeCustomer | null>(null);
  const [newUid, setNewUid] = useState('');
  const [updatingUid, setUpdatingUid] = useState(false);

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
        setTotalCount(response.data.totalCount ?? 0);
        setHasMore(response.data.sliceInfo?.hasNext ?? false);
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

  const openHistoryModal = (customer: FreeCustomer) => {
    setHistoryCustomer(customer);
    setShowHistoryModal(true);
  };

  const openTradingHistoryModal = (customer: FreeCustomer) => {
    setTradingHistoryCustomer(customer);
    setShowTradingHistoryModal(true);
  };

  const openDeleteModal = (customer: FreeCustomer) => {
    setDeleteCustomer(customer);
    setShowDeleteModal(true);
  };

  const openUidModal = (customer: FreeCustomer) => {
    setUidCustomer(customer);
    setNewUid(customer.uid || '');
    setShowUidModal(true);
  };

  const handleUpdateUid = async () => {
    if (!uidCustomer) return;

    if (!newUid.trim()) {
      alert('UID를 입력해주세요.');
      return;
    }

    setUpdatingUid(true);
    try {
      const response = await updateUserUid(uidCustomer.customerId, newUid.trim());
      if (response.success) {
        alert('UID가 성공적으로 변경되었습니다.');
        setCustomers((prev) =>
          prev.map((c) =>
            c.customerId === uidCustomer.customerId
              ? { ...c, uid: newUid.trim() }
              : c
          )
        );
        setShowUidModal(false);
      } else {
        alert(`UID 변경 실패: ${response.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setUpdatingUid(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteCustomer) return;

    setDeleting(true);
    try {
      const response = await deleteUserHard(deleteCustomer.customerId);
      if (response.success) {
        alert(`${deleteCustomer.name}님이 영구 삭제되었습니다.`);
        setCustomers((prev) => prev.filter((c) => c.customerId !== deleteCustomer.customerId));
        setShowDeleteModal(false);
      } else {
        alert(`삭제 실패: ${response.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold">비구독 고객 목록</h2>
        <span className="px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-800 rounded-full">
          총 {totalCount}명
        </span>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {['고객 ID', 'UID', 'UID 수정', '이름', '전화번호', '보유 토큰', '가입일', '토큰 부여', ...(isAdmin ? ['일지 내역'] : []), ...(showDeleteButton ? ['삭제'] : [])].map((h) => (
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
                  <td colSpan={8 + (isAdmin ? 1 : 0) + (showDeleteButton ? 1 : 0)} className="text-center py-6 text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8 + (isAdmin ? 1 : 0) + (showDeleteButton ? 1 : 0)} className="text-center py-6 text-gray-500">
                    미구독 고객이 없습니다.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{customer.customerId}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{customer.uid || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <CustomButton
                        variant="secondary"
                        onClick={() => openUidModal(customer)}
                      >
                        UID 수정
                      </CustomButton>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{customer.name}</td>
                    <td className="px-6 py-4 text-sm">{customer.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">{customer.token ?? 0}개</td>
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
                    {isAdmin && (
                      <td className="px-6 py-4 text-sm">
                        <CustomButton
                          variant="secondary"
                          onClick={() => openTradingHistoryModal(customer)}
                        >
                          매매일지 내역
                        </CustomButton>
                      </td>
                    )}
                    {showDeleteButton && (
                      <td className="px-6 py-4 text-sm">
                        <CustomButton
                          variant="danger"
                          onClick={() => openDeleteModal(customer)}
                        >
                          삭제
                        </CustomButton>
                      </td>
                    )}
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

      {/* 투자유형 이력 모달 */}
      {showHistoryModal && historyCustomer && (
        <InvestmentTypeHistoryModal
          customerId={historyCustomer.customerId}
          customerName={historyCustomer.name}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {/* 매매일지 내역 모달 */}
      {showTradingHistoryModal && tradingHistoryCustomer && (
        <TradingHistoryModal
          customerId={tradingHistoryCustomer.customerId}
          customerName={tradingHistoryCustomer.name}
          onClose={() => setShowTradingHistoryModal(false)}
        />
      )}

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
                <span className="font-medium">현재 보유 토큰:</span> {selectedCustomer.token ?? 0}개
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

      {/* 회원 삭제 확인 모달 */}
      {showDeleteModal && deleteCustomer && (
        <CustomModal
          title="회원 영구 삭제"
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-800 font-medium">경고: 이 작업은 되돌릴 수 없습니다!</p>
              <p className="text-red-700 text-sm mt-1">
                해당 회원의 모든 데이터(매매일지, 피드백, 레벨테스트 등)가 영구적으로 삭제됩니다.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">고객 ID:</span> {deleteCustomer.customerId}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">고객명:</span> {deleteCustomer.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">UID:</span> {deleteCustomer.uid || '-'}
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <CustomButton
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                취소
              </CustomButton>
              <CustomButton
                variant="danger"
                onClick={handleDeleteUser}
                disabled={deleting}
              >
                {deleting ? '삭제 중...' : '영구 삭제'}
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      )}

      {/* UID 수정 모달 */}
      {showUidModal && uidCustomer && (
        <CustomModal
          title="UID 수정"
          onClose={() => setShowUidModal(false)}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">고객명:</span> {uidCustomer.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">현재 UID:</span> {uidCustomer.uid || '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새 UID
              </label>
              <input
                type="text"
                value={newUid}
                onChange={(e) => setNewUid(e.target.value)}
                placeholder="새 UID를 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-black"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <CustomButton
                variant="secondary"
                onClick={() => setShowUidModal(false)}
                disabled={updatingUid}
              >
                취소
              </CustomButton>
              <CustomButton
                variant="primary"
                onClick={handleUpdateUid}
                disabled={updatingUid}
              >
                {updatingUid ? '변경 중...' : 'UID 변경'}
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      )}
    </section>
  );
}
