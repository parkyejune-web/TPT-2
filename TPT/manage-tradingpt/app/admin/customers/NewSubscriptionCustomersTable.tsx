'use client';

import { useState, useEffect, useRef } from 'react';
import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';
import { getNewSubscriptionCustomers, deleteUserHard, updateUserUid, type NewSubscriptionCustomer } from '../../api/users';
import { getTrainers, reassignCustomerToTrainer, type TrainerListItem } from '../../api/trainers';
import { useAuth } from '../../contexts/AuthContext';
import InvestmentTypeHistoryModal from './InvestmentTypeHistoryModal';
import TradingHistoryModal from '../mypage/TradingHistoryModal';

interface Props {
  showDeleteButton?: boolean;
}

export default function NewSubscriptionCustomersTable({ showDeleteButton = false }: Props) {
  const { isAdmin } = useAuth();
  const [customers, setCustomers] = useState<NewSubscriptionCustomer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // 트레이너 드롭다운 관련 상태
  const [trainers, setTrainers] = useState<TrainerListItem[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [changingTrainer, setChangingTrainer] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 투자유형 이력 모달
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyCustomer, setHistoryCustomer] = useState<NewSubscriptionCustomer | null>(null);

  // 매매일지 내역 모달
  const [showTradingHistoryModal, setShowTradingHistoryModal] = useState(false);
  const [tradingHistoryCustomer, setTradingHistoryCustomer] = useState<NewSubscriptionCustomer | null>(null);

  // 삭제 모달
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState<NewSubscriptionCustomer | null>(null);
  const [deleting, setDeleting] = useState(false);

  // UID 수정 모달
  const [showUidModal, setShowUidModal] = useState(false);
  const [uidCustomer, setUidCustomer] = useState<NewSubscriptionCustomer | null>(null);
  const [newUid, setNewUid] = useState('');
  const [updatingUid, setUpdatingUid] = useState(false);

  useEffect(() => {
    loadCustomers(0);
    loadTrainers();
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadTrainers = async () => {
    try {
      const response = await getTrainers();
      if (response.success && response.data) {
        const trainerList = response.data.filter((t) => t.role === 'ROLE_TRAINER');
        setTrainers(trainerList);
      }
    } catch (error) {
      console.error('트레이너 목록 조회 오류:', error);
    }
  };

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
        setTotalCount(response.data.totalCount ?? 0);
        setHasMore(response.data.sliceInfo?.hasNext ?? false);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('신규 구독 고객 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainerChange = async (customerId: number, trainerId: number) => {
    if (!isAdmin) {
      alert('관리자만 트레이너를 변경할 수 있습니다.');
      return;
    }

    setChangingTrainer(customerId);
    try {
      const response = await reassignCustomerToTrainer(trainerId, customerId);
      if (response.success) {
        const selectedTrainer = trainers.find((t) => t.trainerId === trainerId);
        setCustomers((prev) =>
          prev.map((c) =>
            c.customerId === customerId
              ? { ...c, assignedTrainerName: selectedTrainer?.name || null }
              : c
          )
        );
        alert('트레이너가 변경되었습니다.');
      } else {
        alert(`트레이너 변경 실패: ${response.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setChangingTrainer(null);
      setOpenDropdownId(null);
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

  const openHistoryModal = (customer: NewSubscriptionCustomer) => {
    setHistoryCustomer(customer);
    setShowHistoryModal(true);
  };

  const openTradingHistoryModal = (customer: NewSubscriptionCustomer) => {
    setTradingHistoryCustomer(customer);
    setShowTradingHistoryModal(true);
  };

  const openDeleteModal = (customer: NewSubscriptionCustomer) => {
    setDeleteCustomer(customer);
    setShowDeleteModal(true);
  };

  const openUidModal = (customer: NewSubscriptionCustomer) => {
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

  const handleDelete = async () => {
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
        <h2 className="text-2xl font-bold">신규 PRO 고객 목록</h2>
        <span className="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full">
          총 {totalCount}명
        </span>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {['고객 ID', 'UID', 'UID 수정', '이름', '전화번호', '레벨테스트', '상담 여부', '배정 트레이너', ...(isAdmin ? ['일지 내역'] : []), ...(showDeleteButton ? ['삭제'] : [])].map((h) => (
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
                    신규 구독 고객이 없습니다.
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
                    <td className="px-6 py-4 text-sm">{getLevelTestBadge(customer)}</td>
                    <td className="px-6 py-4 text-sm">
                      {customer.hasConsultation ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">완료</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">미진행</span>
                      )}
                    </td>
                    {/* <td className="px-6 py-4 text-sm">
                      <CustomButton
                        variant="secondary"
                        onClick={() => openHistoryModal(customer)}
                      >
                        이력 보기
                      </CustomButton>
                    </td> */}
                    <td className="px-6 py-4 text-sm">
                      <div className="relative" ref={openDropdownId === customer.customerId ? dropdownRef : null}>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isAdmin) {
                              alert('관리자만 트레이너를 변경할 수 있습니다.');
                              return;
                            }
                            setOpenDropdownId(openDropdownId === customer.customerId ? null : customer.customerId);
                          }}
                          disabled={changingTrainer === customer.customerId}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md border transition-colors ${
                            customer.assignedTrainerName
                              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                          } ${changingTrainer === customer.customerId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span>{changingTrainer === customer.customerId ? '변경 중...' : customer.assignedTrainerName || '미배정'}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openDropdownId === customer.customerId && (
                          <div className="absolute z-50 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div className="py-1 max-h-48 overflow-y-auto">
                              {trainers.length === 0 ? (
                                <div className="px-4 py-2 text-sm text-gray-500">트레이너가 없습니다</div>
                              ) : (
                                trainers.map((trainer) => (
                                  <button
                                    key={trainer.trainerId}
                                    type="button"
                                    onClick={() => handleTrainerChange(customer.customerId, trainer.trainerId)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                      customer.assignedTrainerName === trainer.name ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                    }`}
                                  >
                                    {trainer.name}
                                    {customer.assignedTrainerName === trainer.name && (
                                      <span className="ml-2 text-blue-500">✓</span>
                                    )}
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
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
                onClick={handleDelete}
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
