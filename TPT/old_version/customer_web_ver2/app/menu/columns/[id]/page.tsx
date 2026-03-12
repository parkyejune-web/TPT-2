'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ThumbsUp, MessageCircle, User } from 'lucide-react';
import { columnService } from '../../../../Shared/api/services';
import CustomButton from '../../../../Shared/ui/CustomButton';
import CustomModal from '../../../../Shared/ui/CustomModal';

interface Comment {
  commentId: number;
  writerName: string;
  content: string;
  createdAt: string;
}

interface ColumnDetail {
  columnId: number;
  title: string;
  subtitle: string;
  content: string;
  categoryName: string;
  writerName: string;
  profileImageUrl?: string;
  likeCount: number;
  commentCount: number;
  isBest: boolean;
  createdAt: string;
  comments: Comment[];
  fontFamily?: string;
}

/**
 * 칼럼 상세 페이지
 */
export default function ColumnDetailPage() {
  const params = useParams();
  const columnId = params?.id as string;

  const [column, setColumn] = useState<ColumnDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (columnId) {
      loadColumnDetail();
    }
  }, [columnId]);

  const loadColumnDetail = async () => {
    setLoading(true);
    try {
      const response = await columnService.getColumnDetail(Number(columnId));
      if (response.success && response.data) {
        setColumn(response.data);
      }
    } catch (error) {
      console.error('칼럼 상세 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!column) return;
    try {
      await columnService.likeColumn(column.columnId);
      setLiked(!liked);
    } catch (error) {
      console.error('좋아요 오류:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !column) return;

    try {
      const response = await columnService.createColumnComment(column.columnId, { content: newComment });
      if (response.success) {
        setNewComment('');
        loadColumnDetail(); // 댓글 목록 새로고침
      }
    } catch (error) {
      console.error('댓글 작성 오류:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!column) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">칼럼을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20 flex flex-col md:flex-row gap-10 mt-20">
      {/* 좌측: 트레이너 프로필 */}
      <div className="w-full md:w-1/4 flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          {column.profileImageUrl && column.profileImageUrl.trim() !== '' ? (
            <img
              src={column.profileImageUrl}
              alt={column.writerName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={48} className="text-gray-400" />
          )}
        </div>
        <span className="font-medium mb-2">{column.writerName}</span>
        <button
          className="text-xs text-gray-400 border border-gray-300 rounded-md p-2"
          onClick={() => setIsModalOpen(true)}
        >
          트레이너 프로필 보기
        </button>
      </div>

      {/* 우측: 본문 및 댓글 */}
      <div className="w-full md:w-3/4 flex flex-col">
        {/* 제목 + 날짜 + 통계 */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold mb-2">{column.title}</h1>
          {column.subtitle && (
            <p className="text-lg text-gray-600 mb-3">{column.subtitle}</p>
          )}
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              {new Date(column.createdAt).toLocaleDateString('ko-KR')}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <ThumbsUp size={16} />
                <span>{(column.likeCount || 0) + (liked ? 1 : 0)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{column.commentCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div
          className="prose max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: column.content }}
        />

        {/* 좋아요 버튼 */}
        <div className="flex justify-between items-center mt-8 mb-8">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              liked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <ThumbsUp size={18} className={liked ? 'fill-blue-600' : ''} />
            <span>좋아요 {(column.likeCount || 0) + (liked ? 1 : 0)}</span>
          </button>
        </div>

        {/* 댓글 입력 */}
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성해보세요."
            className="w-full border border-gray-300 rounded-md p-3 mb-2"
            rows={3}
          />
          <button
            onClick={handleCommentSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            댓글 작성
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">댓글 {column.comments?.length || 0}</h3>
          {!column.comments || column.comments.length === 0 ? (
            <p className="text-gray-500 text-sm">첫 댓글을 작성해보세요.</p>
          ) : (
            column.comments.map((comment) => (
              <div key={comment.commentId} className="border-b border-gray-200 pb-3">
                <p className="text-sm font-medium text-gray-800">{comment.writerName}</p>
                <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(comment.createdAt).toLocaleString('ko-KR')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 트레이너 프로필 모달 */}
      <CustomModal variant={1} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex gap-6 p-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            {column.profileImageUrl ? (
              <img
                src={column.profileImageUrl}
                alt={column.writerName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={64} className="text-gray-400" />
            )}
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold">
              {column.writerName}{' '}
              <span className="text-gray-600">트레이너</span>
            </h2>
            <p className="text-gray-700">전문 트레이더입니다.</p>
            <CustomButton variant="prettyFull" onClick={() => setIsModalOpen(false)}>
              닫기
            </CustomButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
