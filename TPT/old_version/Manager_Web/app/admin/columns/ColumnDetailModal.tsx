'use client';

import { useState, useEffect } from 'react';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import RichTextEditor from '../../components/RichTextEditor';
import type { ColumnDetail } from '../../api/columns';
import { getColumnDetail, createComment } from '../../api/columns';

interface ColumnDetailModalProps {
  columnId: number;
  onClose: () => void;
  onEdit: () => void;
}

export default function ColumnDetailModal({
  columnId,
  onClose,
  onEdit,
}: ColumnDetailModalProps) {
  const [column, setColumn] = useState<ColumnDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    loadColumnDetail();
  }, [columnId]);

  const loadColumnDetail = async () => {
    setLoading(true);
    const response = await getColumnDetail(columnId);
    if (response.success && response.data) {
      setColumn(response.data);
    } else {
      alert('칼럼을 불러오는데 실패했습니다.');
      onClose();
    }
    setLoading(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const response = await createComment(columnId, { content: newComment });
      if (response.success) {
        alert('댓글이 작성되었습니다.');
        setNewComment('');
        loadColumnDetail(); // 댓글 목록 새로고침
      } else {
        alert(`댓글 작성 실패: ${response.error}`);
      }
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDateTime = (dateString: string) => {
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

  if (loading) {
    return (
      <CustomModal title="칼럼 상세" onClose={onClose} size="xl">
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">칼럼을 불러오는 중...</p>
        </div>
      </CustomModal>
    );
  }

  if (!column) {
    return null;
  }

  return (
    <CustomModal title={column.title} onClose={onClose} size="xl">
      {/* 헤더 정보 */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          {column.isBest && (
            <span className="text-yellow-500 text-xl" title="베스트 칼럼">
              ⭐
            </span>
          )}
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {column.categoryName}
          </span>
        </div>
        <p className="text-lg text-gray-600 mb-3">{column.subtitle}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>작성자: {column.writerName}</span>
            <span>좋아요 {(column.likeCount || 0).toLocaleString()}</span>
            <span>댓글 {(column.commentCount || 0).toLocaleString()}</span>
          </div>
          <div>
            <span>작성일: {formatDateTime(column.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* 내용 */}
      <div className="mb-8">
        <RichTextEditor
          value={column.content}
          onChange={() => {}}
          selectedFont={column.fontFamily}
          readOnly
        />
      </div>

      {/* 댓글 섹션 */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          댓글 {column.comments?.length || 0}개
        </h3>

        {/* 댓글 작성 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            관리자 댓글 작성
          </label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            placeholder="댓글을 입력하세요..."
            disabled={isSubmittingComment}
          />
          <div className="flex justify-end mt-2">
            <CustomButton
              variant="primary"
              onClick={handleAddComment}
              disabled={isSubmittingComment || !newComment.trim()}
            >
              {isSubmittingComment ? '작성 중...' : '댓글 작성'}
            </CustomButton>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {column.comments && column.comments.length > 0 ? (
            column.comments.map((comment) => (
              <div
                key={comment.commentId}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">
                    {comment.writerName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDateTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              아직 댓글이 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <CustomButton variant="secondary" onClick={onClose}>
          닫기
        </CustomButton>
        <CustomButton variant="primary" onClick={onEdit}>
          수정하기
        </CustomButton>
      </div>
    </CustomModal>
  );
}
