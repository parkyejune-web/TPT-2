'use client';

import { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';
import { searchUsersByUid, searchUsersByName, updateUserUid, grantUserToken, updateUserStatus, type SearchedUser } from '../../api/users';
import TradingHistoryModal from '../mypage/TradingHistoryModal';

interface Props {
  onUserSelect?: (user: SearchedUser) => void;
}

export default function UserSearchSection({ onUserSelect }: Props) {
  const [searchType, setSearchType] = useState<'uid' | 'name'>('uid');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // UID 수정 모달
  const [showUidModal, setShowUidModal] = useState(false);
  const [uidUser, setUidUser] = useState<SearchedUser | null>(null);
  const [newUid, setNewUid] = useState('');
  const [updatingUid, setUpdatingUid] = useState(false);

  // 토큰 부여 모달
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenUser, setTokenUser] = useState<SearchedUser | null>(null);
  const [tokenCount, setTokenCount] = useState('');
  const [grantingToken, setGrantingToken] = useState(false);

  // 매매일지 내역 모달
  const [showTradingHistoryModal, setShowTradingHistoryModal] = useState(false);
  const [tradingHistoryUser, setTradingHistoryUser] = useState<SearchedUser | null>(null);

  const handleSearch = async (pageNum: number = 0) => {
    if (!searchQuery.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setPage(pageNum);

    try {
      const response = searchType === 'uid'
        ? await searchUsersByUid(searchQuery.trim(), pageNum, 10)
        : await searchUsersByName(searchQuery.trim(), pageNum, 10);

      if (response.success && response.data) {
        setSearchResults(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
      } else {
        setSearchResults([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(0);
    }
  };

  const getStatusBadge = (status: string, trainerName: string | null) => {
    // 트레이너가 배정된 경우 트레이너 이름 표시
    if (status === 'TRAINER_ASSIGNED' && trainerName) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
          {trainerName}
        </span>
      );
    }

    const statusMap: Record<string, { text: string; color: string }> = {
      'UID_REVIEW_PENDING': { text: '승인 대기', color: 'bg-yellow-100 text-yellow-800' },
      'UID_APPROVED': { text: '승인됨', color: 'bg-green-100 text-green-800' },
      'UID_REJECTED': { text: '거절됨', color: 'bg-red-100 text-red-800' },
      'PAID_BEFORE_TEST': { text: '결제 완료', color: 'bg-blue-100 text-blue-800' },
      'PAID_AFTER_TEST_TRAINER_ASSIGNING': { text: '트레이너 배정 중', color: 'bg-purple-100 text-purple-800' },
      'PAID_BEFORE_TRAINER_ASSIGNING': { text: '트레이너 배정 전', color: 'bg-purple-100 text-purple-800' },
      'TRAINER_ASSIGNED': { text: '트레이너 배정됨', color: 'bg-indigo-100 text-indigo-800' },
    };
    const badge = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  // UID 수정 모달 열기
  const openUidModal = (user: SearchedUser) => {
    setUidUser(user);
    setNewUid(user.uid?.uid || '');
    setShowUidModal(true);
  };

  // UID 수정 처리
  const handleUpdateUid = async () => {
    if (!uidUser) return;

    if (!newUid.trim()) {
      alert('UID를 입력해주세요.');
      return;
    }

    setUpdatingUid(true);
    try {
      const response = await updateUserUid(uidUser.userId, newUid.trim());
      if (response.success) {
        alert('UID가 성공적으로 변경되었습니다.');
        setSearchResults((prev) =>
          prev.map((u) =>
            u.userId === uidUser.userId
              ? { ...u, uid: { exchangeName: u.uid?.exchangeName || '', uid: newUid.trim() } }
              : u
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

  // 토큰 부여 모달 열기
  const openTokenModal = (user: SearchedUser) => {
    setTokenUser(user);
    setTokenCount('');
    setShowTokenModal(true);
  };

  // 토큰 부여 처리
  const handleGrantToken = async () => {
    if (!tokenUser) return;

    const tokenNum = parseInt(tokenCount);
    if (!tokenCount || isNaN(tokenNum) || tokenNum <= 0) {
      alert('올바른 토큰 개수를 입력해주세요.');
      return;
    }

    setGrantingToken(true);
    try {
      const response = await grantUserToken(tokenUser.userId, tokenNum);
      if (response.success) {
        alert(`${tokenUser.name}님에게 토큰 ${tokenNum}개를 부여했습니다.`);
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

  // 매매일지 내역 모달 열기
  const openTradingHistoryModal = (user: SearchedUser) => {
    setTradingHistoryUser(user);
    setShowTradingHistoryModal(true);
  };

  // UID 승인 상태 변경 처리 (승인 대기 상태인 경우)
  const handleApprovalStatusChange = async (userId: number, newStatus: string) => {
    try {
      const apiStatus =
        newStatus === '승인' ? 'UID_APPROVED' :
        newStatus === '승인 불가' ? 'UID_REJECTED' :
        null;

      if (!apiStatus) return;

      const response = await updateUserStatus(userId, apiStatus);
      if (response.success) {
        setSearchResults((prev) =>
          prev.map((u) =>
            u.userId === userId
              ? { ...u, status: apiStatus }
              : u
          )
        );
        alert(`사용자 상태가 '${newStatus}'(으)로 변경되었습니다.`);
      } else {
        alert('상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('UID 승인 처리 중 오류:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">회원 검색</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">검색 유형:</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'uid' | 'name')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
            >
              <option value="uid">UID</option>
              <option value="name">이름</option>
            </select>
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={searchType === 'uid' ? 'UID를 입력하세요' : '이름을 입력하세요'}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
            />
            <CustomButton
              variant="primary"
              onClick={() => handleSearch(0)}
              disabled={loading}
            >
              {loading ? '검색 중...' : '검색'}
            </CustomButton>
          </div>
        </div>

        {hasSearched && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['고객 ID', '이름', '전화번호', 'UID', 'UID 수정', '토큰 부여', '보유 토큰', '일지 내역', '상태', '승인 여부', '가입일'].map((h) => (
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
                {loading ? (
                  <tr>
                    <td colSpan={11} className="text-center py-6 text-gray-500">
                      검색 중...
                    </td>
                  </tr>
                ) : searchResults.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-6 text-gray-500">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  searchResults.map((user) => (
                    <tr
                      key={user.userId}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm">{user.userId}</td>
                      <td className="px-6 py-4 text-sm">{user.name}</td>
                      <td className="px-6 py-4 text-sm">{user.phone}</td>
                      <td className="px-6 py-4 text-sm font-mono">{user.uid?.uid || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <CustomButton
                          variant="secondary"
                          onClick={() => openUidModal(user)}
                        >
                          UID 수정
                        </CustomButton>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <CustomButton
                          variant="primary"
                          onClick={() => openTokenModal(user)}
                        >
                          토큰 부여
                        </CustomButton>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">{user.token}</td>
                      <td className="px-6 py-4 text-sm">
                        <CustomButton
                          variant="secondary"
                          onClick={() => openTradingHistoryModal(user)}
                        >
                          매매일지 내역
                        </CustomButton>
                      </td>
                      <td className="px-6 py-4 text-sm">{getStatusBadge(user.status, user.trainerName)}</td>
                      <td className="px-6 py-4 text-sm">
                        {user.status === 'UID_REVIEW_PENDING' ? (
                          <select
                            value="승인 대기 중"
                            onChange={(e) => handleApprovalStatusChange(user.userId, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer text-black"
                          >
                            <option value="승인 대기 중">승인 대기 중</option>
                            <option value="승인">승인</option>
                            <option value="승인 불가">승인 불가</option>
                          </select>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {user.requestedAt ? new Date(user.requestedAt).toLocaleDateString('ko-KR') : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <CustomButton
                  variant="secondary"
                  onClick={() => handleSearch(page - 1)}
                  disabled={page === 0 || loading}
                >
                  이전
                </CustomButton>
                <span className="py-2 px-4 text-sm text-gray-600">
                  {page + 1} / {totalPages}
                </span>
                <CustomButton
                  variant="secondary"
                  onClick={() => handleSearch(page + 1)}
                  disabled={page >= totalPages - 1 || loading}
                >
                  다음
                </CustomButton>
              </div>
            )}
          </div>
        )}
      </div>

      {/* UID 수정 모달 */}
      {showUidModal && uidUser && (
        <CustomModal
          title="UID 수정"
          onClose={() => setShowUidModal(false)}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">고객명:</span> {uidUser.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">현재 UID:</span> {uidUser.uid?.uid || '-'}
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

      {/* 토큰 부여 모달 */}
      {showTokenModal && tokenUser && (
        <CustomModal
          title="토큰 부여"
          onClose={() => setShowTokenModal(false)}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">고객명:</span> {tokenUser.name}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
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

      {/* 매매일지 내역 모달 */}
      {showTradingHistoryModal && tradingHistoryUser && (
        <TradingHistoryModal
          customerId={tradingHistoryUser.userId}
          customerName={tradingHistoryUser.name}
          onClose={() => setShowTradingHistoryModal(false)}
        />
      )}
    </section>
  );
}
