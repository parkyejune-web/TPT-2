'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  type EventResponse,
  type EventCreateRequest,
  type EventUpdateRequest,
} from '../../api/events';

export default function EventsPage() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  // 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    startAt: '',
    endAt: '',
    tokenAmount: '',
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEvents(0);
  }, [showOnlyActive]);

  const loadEvents = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await getEvents(pageNum, 20, showOnlyActive);
      if (response.success && response.data) {
        setEvents(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('이벤트 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTimeForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
  };

  const formatDateTimeForApi = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString();
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startAt: '',
      endAt: '',
      tokenAmount: '',
      active: true,
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (event: EventResponse) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      startAt: formatDateTimeForInput(event.startAt),
      endAt: formatDateTimeForInput(event.endAt),
      tokenAmount: event.tokenAmount.toString(),
      active: event.active,
    });
    setShowEditModal(true);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      alert('이벤트 이름을 입력해주세요.');
      return;
    }
    if (!formData.startAt || !formData.endAt) {
      alert('시작일시와 종료일시를 입력해주세요.');
      return;
    }
    const tokenNum = parseInt(formData.tokenAmount);
    if (!formData.tokenAmount || isNaN(tokenNum) || tokenNum <= 0) {
      alert('올바른 토큰 개수를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const data: EventCreateRequest = {
        name: formData.name.trim(),
        startAt: formatDateTimeForApi(formData.startAt),
        endAt: formatDateTimeForApi(formData.endAt),
        tokenAmount: tokenNum,
      };

      const response = await createEvent(data);
      if (response.success) {
        alert('이벤트가 생성되었습니다.');
        setShowCreateModal(false);
        loadEvents(0);
      } else {
        alert(`이벤트 생성 실패: ${response.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedEvent) return;

    if (!formData.name.trim()) {
      alert('이벤트 이름을 입력해주세요.');
      return;
    }
    if (!formData.startAt || !formData.endAt) {
      alert('시작일시와 종료일시를 입력해주세요.');
      return;
    }
    const tokenNum = parseInt(formData.tokenAmount);
    if (!formData.tokenAmount || isNaN(tokenNum) || tokenNum <= 0) {
      alert('올바른 토큰 개수를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const data: EventUpdateRequest = {
        name: formData.name.trim(),
        startAt: formatDateTimeForApi(formData.startAt),
        endAt: formatDateTimeForApi(formData.endAt),
        tokenAmount: tokenNum,
        active: formData.active,
      };

      const response = await updateEvent(selectedEvent.id, data);
      if (response.success) {
        alert('이벤트가 수정되었습니다.');
        setShowEditModal(false);
        loadEvents(page);
      } else {
        alert(`이벤트 수정 실패: ${response.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (event: EventResponse) => {
    if (!confirm(`"${event.name}" 이벤트를 삭제하시겠습니까?`)) return;

    try {
      const response = await deleteEvent(event.id);
      if (response.success) {
        alert('이벤트가 삭제되었습니다.');
        loadEvents(page);
      } else {
        alert(`이벤트 삭제 실패: ${response.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const isEventActive = (event: EventResponse) => {
    if (!event.active) return false;
    const now = new Date();
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);
    return now >= start && now <= end;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-[1920px] mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">이벤트 관리</h1>
            <CustomButton variant="primary" onClick={openCreateModal}>
              새 이벤트 생성
            </CustomButton>
          </div>

          {/* 필터 */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyActive}
                onChange={(e) => setShowOnlyActive(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">활성 이벤트만 보기</span>
            </label>
          </div>

          {/* 이벤트 목록 테이블 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', '이벤트 이름', '시작 일시', '종료 일시', '보상 토큰', '상태', '관리'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      로딩 중...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      등록된 이벤트가 없습니다.
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{event.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDisplayDate(event.startAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDisplayDate(event.endAt)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600">{event.tokenAmount}개</td>
                      <td className="px-6 py-4 text-sm">
                        {isEventActive(event) ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            진행 중
                          </span>
                        ) : event.active ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            예정/종료
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            비활성
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <CustomButton variant="secondary" onClick={() => openEditModal(event)}>
                            수정
                          </CustomButton>
                          <CustomButton variant="danger" onClick={() => handleDelete(event)}>
                            삭제
                          </CustomButton>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <CustomButton
                variant="secondary"
                onClick={() => loadEvents(page - 1)}
                disabled={page === 0 || loading}
              >
                이전
              </CustomButton>
              <span className="py-2 px-4 text-sm text-gray-600">
                {page + 1} / {totalPages}
              </span>
              <CustomButton
                variant="secondary"
                onClick={() => loadEvents(page + 1)}
                disabled={page >= totalPages - 1 || loading}
              >
                다음
              </CustomButton>
            </div>
          )}
        </div>
      </main>

      {/* 이벤트 생성 모달 */}
      {showCreateModal && (
        <CustomModal title="새 이벤트 생성" onClose={() => setShowCreateModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이벤트 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 10월 가입 이벤트"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작 일시 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료 일시 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보상 토큰 개수 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.tokenAmount}
                onChange={(e) => setFormData({ ...formData, tokenAmount: e.target.value })}
                placeholder="토큰 개수를 입력하세요"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <CustomButton
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
                disabled={submitting}
              >
                취소
              </CustomButton>
              <CustomButton variant="primary" onClick={handleCreate} disabled={submitting}>
                {submitting ? '생성 중...' : '이벤트 생성'}
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      )}

      {/* 이벤트 수정 모달 */}
      {showEditModal && selectedEvent && (
        <CustomModal title="이벤트 수정" onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이벤트 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 10월 가입 이벤트"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작 일시 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료 일시 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보상 토큰 개수 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.tokenAmount}
                onChange={(e) => setFormData({ ...formData, tokenAmount: e.target.value })}
                placeholder="토큰 개수를 입력하세요"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">이벤트 활성화</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <CustomButton
                variant="secondary"
                onClick={() => setShowEditModal(false)}
                disabled={submitting}
              >
                취소
              </CustomButton>
              <CustomButton variant="primary" onClick={handleUpdate} disabled={submitting}>
                {submitting ? '수정 중...' : '이벤트 수정'}
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
