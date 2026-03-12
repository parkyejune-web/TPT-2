'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { reviewService } from '../../../Shared/api/services';
import { useAuthStore } from '../../../Shared/store/authStore';
import CustomButton from '../../../Shared/ui/CustomButton';
import CustomModal from '../../../Shared/ui/CustomModal';

interface Review {
  id: number;
  content: string;
  rating: number;
  imageUrl?: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

/**
 * 내 리뷰 작성 및 관리 페이지
 */
export default function MyReviewPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'write' | 'list'>('write');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (tab === 'list') {
      loadMyReviews();
    }
  }, [user, tab, router]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('rating', rating.toString());
      if (image) {
        formData.append('image', image);
      }

      const response = await reviewService.createReview(formData);
      if (response.success) {
        setIsModalOpen(true);
        setContent('');
        setRating(5);
        setImage(null);
        setImagePreview('');
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

  // Delete functionality not supported by backend API

  return (
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
                  className={`text-2xl ${star <= rating ? 'text-[#B9AB70]' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* 내용 */}
          <div>
            <div className="flex justify-end mb-2">
              <label className="text-sm text-indigo-600 cursor-pointer">
                이미지 추가
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="후기 내용을 입력하세요."
              className="w-full bg-[#F4F4F4] rounded-md px-3 py-2 text-sm h-40"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="첨부 이미지"
                  className="w-40 h-40 object-cover border rounded-md"
                />
              </div>
            )}
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
                    {new Date(review.createdAt).toLocaleString('ko-KR')} 작성
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#B9AB70]">★ {review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{review.content}</p>
                {review.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={review.imageUrl}
                      alt="리뷰 이미지"
                      className="w-40 h-40 object-cover border rounded-md"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      review.status === 'APPROVED'
                        ? 'bg-green-100 text-green-700'
                        : review.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {review.status === 'APPROVED'
                      ? '승인됨'
                      : review.status === 'REJECTED'
                        ? '거부됨'
                        : '검토 중'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 성공 모달 */}
      <CustomModal variant={1} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center p-6">
          <p className="mb-4">
            후기가 성공적으로 저장되었습니다.
            <br />
            관리자 검토 후 공개됩니다.
            <br />
            소중한 고객님께 감사드립니다.
          </p>
          <CustomButton variant="prettyFull" onClick={() => setIsModalOpen(false)}>
            확인
          </CustomButton>
        </div>
      </CustomModal>
    </div>
  );
}
