'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { reviewService } from '../../../Shared/api/services';
import { useAuthStore } from '../../../Shared/store/authStore';
import CustomButton from '../../../Shared/ui/CustomButton';
import CustomModal from '../../../Shared/ui/CustomModal';
import AccessGuard from '../../../Shared/ui/AccessGuard';
import type { ReviewResponseDTO, ReviewTagResponseDTO } from '../../../Shared/api/apiTypes';
import 'react-quill-new/dist/quill.snow.css';

// react-quill은 SSR을 지원하지 않으므로 dynamic import 사용
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

/**
 * 내 리뷰 작성 및 관리 페이지
 * UID_REVIEW_PENDING, UID_REJECTED가 아닌 로그인 사용자만 접근 가능
 */
export default function MyReviewPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'write' | 'list'>('write');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [tags, setTags] = useState<ReviewTagResponseDTO[]>([]);
  const [reviews, setReviews] = useState<ReviewResponseDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);

  useEffect(() => {
    // 태그 목록 로드
    loadTags();
  }, []);

  useEffect(() => {
    if (user && tab === 'list') {
      loadMyReviews();
    }
  }, [user, tab]);

  const loadTags = async () => {
    setTagsLoading(true);
    try {
      const response = await reviewService.getReviewTags();
      if (response.success && response.data) {
        setTags(response.data);
      }
    } catch (error) {
      console.error('태그 목록 조회 오류:', error);
    } finally {
      setTagsLoading(false);
    }
  };

  const loadMyReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getMyReviewList();
      if (response.success && response.data) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('내 리뷰 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    if (rating < 1 || rating > 5) {
      alert('별점을 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await reviewService.createReview({
        content,
        rating,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      });
      if (response.success) {
        setIsModalOpen(true);
        setContent('');
        setRating(5);
        setSelectedTagIds([]);
        setTab('list');
      } else {
        alert(response.error || '리뷰 작성 실패');
      }
    } catch (error) {
      console.error('리뷰 작성 오류:', error);
      alert('리뷰 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccessGuard level="UID_APPROVED_REQUIRED">
    <div className="max-w-3xl mx-auto p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-2">TPT를 경험하신 후기를 알려주세요</h1>
      <p className="text-gray-600 mb-6">소중한 후기를 남겨주셔서 감사합니다.</p>

      {/* 탭 */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setTab('write')}
          className={`px-4 py-2 font-medium cursor-pointer ${
            tab === 'write' ? 'border-b-2 border-black text-black' : 'text-gray-500'
          }`}
        >
          후기 작성
        </button>
        <button
          onClick={() => setTab('list')}
          className={`px-4 py-2 font-medium cursor-pointer ${
            tab === 'list' ? 'border-b-2 border-black text-black' : 'text-gray-500'
          }`}
        >
          내 후기 확인
        </button>
      </div>

      {/* 후기 작성 */}
      {tab === 'write' && (
        <div className="space-y-4">
          {/* 별점 */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">별점:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl cursor-pointer ${star <= rating ? 'text-[#B9AB70]' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* 태그 선택 */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">이런 점이 좋았어요 (선택)</span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-2 text-sm rounded-full border transition-colors cursor-pointer ${
                      selectedTagIds.includes(tag.id)
                        ? 'bg-[#B9AB70] text-white border-[#B9AB70]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#B9AB70]'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
              {tagsLoading && <p className="text-sm text-gray-400">태그 로딩 중...</p>}
            </div>
          )}

          {/* 내용 */}
          <div>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="후기 내용을 입력하세요."
              className="bg-white rounded-md"
              style={{ minHeight: '200px' }}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['clean'],
                ],
              }}
            />
          </div>
          <CustomButton variant="prettyFull" onClick={handleSubmit} disabled={loading}>
            {loading ? '작성 중...' : '후기 작성하기'}
          </CustomButton>
        </div>
      )}

      {/* 내 후기 목록 */}
      {tab === 'list' && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-8 text-gray-500">로딩 중...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center py-8 text-gray-500">등록된 후기가 없습니다.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="rounded-md p-4 bg-[#F4F4F4] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {new Date(review.submittedAt).toLocaleString('ko-KR')} 작성
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#B9AB70]">★ {review.rating?.toFixed(1) ?? '5.0'}</span>
                  </div>
                </div>
                <div
                  className="text-gray-700 review-content"
                  dangerouslySetInnerHTML={{ __html: review.content }}
                />
                {/* 트레이너 답변 */}
                {review.trainerReply && (
                  <div className="mt-2 p-3 bg-white rounded-md border border-gray-200">
                    <p className="text-xs text-[#B9AB70] font-medium mb-1">
                      {review.trainerReply.trainerName ? `${review.trainerReply.trainerName} 트레이너 답변` : '트레이너 답변'}
                    </p>
                    <p className="text-sm text-gray-600">{review.trainerReply.replyContent}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      review.isPublic
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {review.isPublic ? '공개됨' : '검토 중'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 성공 모달 */}
      <CustomModal variant={1} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} width="max-w-lg">
        <div className="text-center p-6">
          <p className="mb-4">
            후기가 성공적으로 저장되었습니다.
            <br />
            소중한 고객님께 감사드립니다.
          </p>
          <CustomButton variant="prettyFull" onClick={() => setIsModalOpen(false)}>
            확인
          </CustomButton>
        </div>
      </CustomModal>
    </div>
    </AccessGuard>
  );
}
