'use client';

import { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import { searchUsersByUid, searchUsersByName, type SearchedUser } from '../../api/users';

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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      'UID_REVIEW_PENDING': { text: '승인 대기', color: 'bg-yellow-100 text-yellow-800' },
      'UID_APPROVED': { text: '승인됨', color: 'bg-green-100 text-green-800' },
      'UID_REJECTED': { text: '거절됨', color: 'bg-red-100 text-red-800' },
      'PAID_BEFORE_TEST': { text: '결제 완료', color: 'bg-blue-100 text-blue-800' },
      'PAID_AFTER_TEST_TRAINER_ASSIGNING': { text: '트레이너 배정 중', color: 'bg-purple-100 text-purple-800' },
      'TRAINER_ASSIGNED': { text: '트레이너 배정됨', color: 'bg-indigo-100 text-indigo-800' },
    };
    const badge = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
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
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                  {['고객 ID', '이름', '전화번호', 'UID', '상태', '가입일'].map((h) => (
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
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      검색 중...
                    </td>
                  </tr>
                ) : searchResults.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  searchResults.map((user) => (
                    <tr
                      key={user.userId}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => onUserSelect?.(user)}
                    >
                      <td className="px-6 py-4 text-sm">{user.userId}</td>
                      <td className="px-6 py-4 text-sm">{user.name}</td>
                      <td className="px-6 py-4 text-sm">{user.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm font-mono">{user.uid || '-'}</td>
                      <td className="px-6 py-4 text-sm">{getStatusBadge(user.status)}</td>
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
    </section>
  );
}
