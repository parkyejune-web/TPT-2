'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import {
  getAdminComplaints,
  getAdminComplaint,
  createComplaintReply,
  updateComplaintReply,
  deleteComplaintReply,
} from '../../api/complaints';

interface Complaint {
  id: number;
  customerName: string;
  phone: string;
  trainer: string;
  content: string;
  images?: string[];
  reply?: string;
  replyAuthor?: string;
  replyCreatedAt?: string;
  createdAt: string;
  status: 'PENDING' | 'ANSWERED';
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditingReply, setIsEditingReply] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    const response = await getAdminComplaints();
    if (response.success && response.data) {
      const complaintList = Array.isArray(response.data) ? response.data : response.data.content || [];
      const formattedComplaints = complaintList.map((complaint: any) => ({
        id: complaint.complaintId || complaint.id,
        customerName: complaint.customerName || complaint.name || '고객',
        phone: complaint.phone || complaint.phoneNumber || '-',
        trainer: complaint.trainerName || complaint.trainer || '미배정',
        content: complaint.content || complaint.complaintContent || '',
        images: complaint.images || complaint.imageUrls || [],
        reply: complaint.reply || complaint.replyContent || '',
        replyAuthor: complaint.replyAuthor || complaint.replyWriterName || '',
        replyCreatedAt: complaint.replyCreatedAt || complaint.replyDate || '',
        createdAt: complaint.createdAt || complaint.complaintDate || new Date().toISOString(),
        status: complaint.reply ? 'ANSWERED' : 'PENDING',
      }));
      setComplaints(formattedComplaints);
    }
    setLoading(false);
  };

  const handleShowDetail = async (complaintId: number) => {
    setLoading(true);
    const response = await getAdminComplaint(complaintId);
    if (response.success && response.data) {
      const complaint = response.data;
      const formattedComplaint: Complaint = {
        id: complaint.complaintId || complaint.id,
        customerName: complaint.customerName || complaint.name || '고객',
        phone: complaint.phone || complaint.phoneNumber || '-',
        trainer: complaint.trainerName || complaint.trainer || '미배정',
        content: complaint.content || complaint.complaintContent || '',
        images: complaint.images || complaint.imageUrls || [],
        reply: complaint.reply || complaint.replyContent || '',
        replyAuthor: complaint.replyAuthor || complaint.replyWriterName || '',
        replyCreatedAt: complaint.replyCreatedAt || complaint.replyDate || '',
        createdAt: complaint.createdAt || complaint.complaintDate || new Date().toISOString(),
        status: complaint.reply ? 'ANSWERED' : 'PENDING',
      };
      setSelectedComplaint(formattedComplaint);
      setReplyText(formattedComplaint.reply || '');
      setShowDetailModal(true);
    }
    setLoading(false);
  };

  const handleSaveReply = async () => {
    if (!selectedComplaint || !replyText.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    let response;

    if (selectedComplaint.reply && !isEditingReply) {
      // 이미 답변이 있는 경우 수정
      response = await updateComplaintReply(selectedComplaint.id, replyText);
    } else {
      // 새로운 답변 작성
      response = await createComplaintReply(selectedComplaint.id, replyText);
    }

    if (response.success) {
      alert('답변이 저장되었습니다.');
      setShowDetailModal(false);
      setSelectedComplaint(null);
      setReplyText('');
      setIsEditingReply(false);
      loadComplaints();
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleDeleteReply = async () => {
    if (!selectedComplaint || !selectedComplaint.reply) return;

    if (!confirm('답변을 삭제하시겠습니까?')) return;

    setLoading(true);
    const response = await deleteComplaintReply(selectedComplaint.id);

    if (response.success) {
      alert('답변이 삭제되었습니다.');
      setShowDetailModal(false);
      setSelectedComplaint(null);
      setReplyText('');
      loadComplaints();
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedComplaint(null);
    setReplyText('');
    setIsEditingReply(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {loading && (
          // <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <p className="text-lg font-medium">로딩 중...</p>
            </div>
          // </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">민원 관리</h1>
          <p className="text-gray-600 mt-2">고객 민원을 확인하고 답변할 수 있습니다.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    성함
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    전화번호
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    담당조교
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    민원상세
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    민원답변
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    답변 작성자
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    답변 작성시각
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      등록된 민원이 없습니다.
                    </td>
                  </tr>
                ) : (
                  complaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {complaint.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {complaint.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {complaint.trainer}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="max-w-xs truncate">
                          {complaint.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="max-w-xs truncate">
                          {complaint.reply || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {complaint.replyAuthor || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(complaint.replyCreatedAt || '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            complaint.status === 'ANSWERED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {complaint.status === 'ANSWERED' ? '답변완료' : '대기중'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleShowDetail(complaint.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 민원 상세 모달 */}
      {showDetailModal && selectedComplaint && (
        <CustomModal title="민원 상세" onClose={handleCloseModal} size="xl">
            <div className="flex justify-end mb-4">
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  selectedComplaint.status === 'ANSWERED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {selectedComplaint.status === 'ANSWERED' ? '답변완료' : '대기중'}
              </span>
            </div>

            <div className="space-y-6">
              {/* 고객 정보 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">고객 정보</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">성함</p>
                    <p className="text-sm font-medium text-gray-900">{selectedComplaint.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">전화번호</p>
                    <p className="text-sm font-medium text-gray-900">{selectedComplaint.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">담당조교</p>
                    <p className="text-sm font-medium text-gray-900">{selectedComplaint.trainer}</p>
                  </div>
                </div>
              </div>

              {/* 민원 내용 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">민원 내용</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedComplaint.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    작성일: {formatDate(selectedComplaint.createdAt)}
                  </p>
                </div>
              </div>

              {/* 첨부 이미지 */}
              {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">첨부 이미지</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedComplaint.images.map((image, index) => (
                      <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`첨부 이미지 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 답변 섹션 */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">답변</h3>
                  {selectedComplaint.reply && !isEditingReply && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditingReply(true)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        수정
                      </button>
                      <button
                        onClick={handleDeleteReply}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>

                {selectedComplaint.reply && !isEditingReply ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedComplaint.reply}
                    </p>
                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span>작성자: {selectedComplaint.replyAuthor}</span>
                      <span>{formatDate(selectedComplaint.replyCreatedAt || '')}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <textarea
                      className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="답변을 작성해주세요..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* 버튼 영역 */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <CustomButton variant="secondary" onClick={handleCloseModal}>
                  닫기
                </CustomButton>
                {(!selectedComplaint.reply || isEditingReply) && (
                  <CustomButton variant="primary" onClick={handleSaveReply}>
                    답변 저장
                  </CustomButton>
                )}
              </div>
            </div>
        </CustomModal>
      )}
    </div>
  );
}
