'use client';

import { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';
import { updateUserUid } from '../../api/users';

interface Props {
  newUsers: any[];
  onStatusChange: (id: number, newStatus: string) => void;
  onRefresh?: () => void;
}

export default function PendingUsersTable({ newUsers, onStatusChange, onRefresh }: Props) {
  const [showUidModal, setShowUidModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUid, setNewUid] = useState('');
  const [updatingUid, setUpdatingUid] = useState(false);

  const openUidModal = (user: any) => {
    setSelectedUser(user);
    const currentUid = typeof user.uid === 'object' ? user.uid?.uid || '' : user.uid || '';
    setNewUid(currentUid);
    setShowUidModal(true);
  };

  const handleUpdateUid = async () => {
    if (!selectedUser) return;

    if (!newUid.trim()) {
      alert('UID를 입력해주세요.');
      return;
    }

    setUpdatingUid(true);
    try {
      const response = await updateUserUid(selectedUser.id, newUid.trim());
      if (response.success) {
        alert('UID가 성공적으로 변경되었습니다.');
        setShowUidModal(false);
        onRefresh?.();
      } else {
        alert(`UID 변경 실패: ${response.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setUpdatingUid(false);
    }
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">신규 가입자 UID 승인 처리</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['성함', '전화번호', '승인 신청 일시', 'UID', 'UID 수정', '승인 여부'].map((h) => (
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
              {newUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    신규 가입자가 없습니다.
                  </td>
                </tr>
              ) : (
                newUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{u.name}</td>
                    <td className="px-6 py-4 text-sm">{u.phone}</td>
                    <td className="px-6 py-4 text-sm">{u.registeredAt}</td>

                    {/* uid가 객체일 수도 있으므로 안전하게 처리 */}
                    <td className="px-6 py-4 text-sm font-mono">
                      {typeof u.uid === 'object'
                        ? u.uid?.uid || '-'
                        : u.uid || '-'}
                    </td>

                    <td className="px-6 py-4">
                      <CustomButton
                        variant="secondary"
                        onClick={() => openUidModal(u)}
                      >
                        UID 수정
                      </CustomButton>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={u.approvalStatus}
                        onChange={(e) => onStatusChange(u.id, e.target.value)}
                        className="text-sm border-none outline-none bg-transparent cursor-pointer"
                      >
                        <option value="승인 대기 중">승인 대기 중</option>
                        <option value="승인">승인</option>
                        <option value="승인 불가">승인 불가</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UID 수정 모달 */}
      {showUidModal && selectedUser && (
        <CustomModal
          title="UID 수정"
          onClose={() => setShowUidModal(false)}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">고객명:</span> {selectedUser.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">현재 UID:</span>{' '}
                {typeof selectedUser.uid === 'object'
                  ? selectedUser.uid?.uid || '-'
                  : selectedUser.uid || '-'}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
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
