'use client';

import React, { useState, useEffect } from 'react';
import CustomModal from '../../components/CustomModal';
import {
  getCustomerHomeworks,
  type CustomerHomeworkSummaryResponseDTO,
  type CustomerHomeworkItemDTO,
} from '../../api/lectures';

interface CustomerHomeworkModalProps {
  customerId: number;
  customerName: string;
  onClose: () => void;
}

export default function CustomerHomeworkModal({
  customerId,
  customerName,
  onClose,
}: CustomerHomeworkModalProps) {
  const [data, setData] = useState<CustomerHomeworkSummaryResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLectureId, setExpandedLectureId] = useState<number | null>(null);

  useEffect(() => {
    loadHomeworks();
  }, [customerId]);

  const loadHomeworks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomerHomeworks(customerId);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || '과제 현황을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '제출':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">제출</span>;
      case '미제출':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">미제출</span>;
      case '수강 전':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">수강 전</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const toggleExpand = (lectureId: number) => {
    setExpandedLectureId(expandedLectureId === lectureId ? null : lectureId);
  };

  return (
    <CustomModal title={`${customerName}님의 강의 과제 현황`} onClose={onClose} size="4xl">
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : !data ? (
          <div className="text-center py-8 text-gray-500">데이터가 없습니다.</div>
        ) : (
          <>
            {/* 요약 정보 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">고객명</p>
                  <p className="text-lg font-semibold text-gray-900">{data.customerName}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">열린 강의 수</p>
                  <p className="text-lg font-semibold text-blue-600">{data.totalOpenedCount}개</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">미제출 과제</p>
                  <p className="text-lg font-semibold text-red-600">{data.notSubmittedCount}개</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">제출률</p>
                  <p className="text-lg font-semibold text-green-600">
                    {data.totalOpenedCount > 0
                      ? Math.round(((data.totalOpenedCount - data.notSubmittedCount) / data.totalOpenedCount) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* 강의별 과제 현황 목록 */}
            {data.items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">과제 현황이 없습니다.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">주차</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">강의 제목</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">상태</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">제출 이력</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.items.map((item) => (
                      <React.Fragment key={item.lectureId}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {item.order}주차
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.lectureTitle}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {item.submissions.length > 0 ? (
                              <button
                                onClick={() => toggleExpand(item.lectureId)}
                                className="px-3 py-1 text-xs rounded-md font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                              >
                                {expandedLectureId === item.lectureId ? '접기' : `${item.submissions.length}건 보기`}
                              </button>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                        {/* 제출 이력 확장 */}
                        {expandedLectureId === item.lectureId && item.submissions.length > 0 && (
                          <tr>
                            <td colSpan={4} className="px-4 py-3 bg-blue-50">
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-blue-800 mb-2">
                                  제출 이력 ({item.submissions.length}건)
                                </p>
                                {item.submissions.map((submission, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-200"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                                        {submission.attemptNo}차 제출
                                      </span>
                                      <span className="text-sm text-gray-700">{submission.fileName}</span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(submission.submittedAt)}
                                      </span>
                                    </div>
                                    <a
                                      href={submission.downloadUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1 text-xs rounded-md font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                                    >
                                      다운로드
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </CustomModal>
  );
}
