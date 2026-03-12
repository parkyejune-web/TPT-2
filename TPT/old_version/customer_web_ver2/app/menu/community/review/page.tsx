'use client';

import { useState, useEffect } from 'react';
import { Footer } from '../../../../Widget/Footer';
import { Star, ThumbsUp, User } from 'lucide-react';
import Image from 'next/image';
import { getReviewList } from '../../../../Shared/api/services/reviewService';

/**
 * TPT 후기 페이지
 * 회원들의 실제 후기와 성장 스토리
 */
export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getReviewList(0, 20);
        if (res.success && res.data) {
          // API 응답 구조 확인 및 데이터 추출
          const reviewsData = res.data.content || res.data.reviews || res.data;
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        }
      } catch (error) {
        console.error('리뷰 목록 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);


  return (
    <div className="min-h-screen bg-white">
      <main className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <section className="text-center mb-12 mt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">TPT 후기</h1>
            <p className="text-xl text-gray-600">
              TPT와 함께 성장한 트레이더들의 진솔한 이야기
            </p>
          </section>

          {/* 통계 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">4.8</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className="text-gray-600">평균 만족도</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1,234</div>
              <p className="text-gray-600">총 후기 수</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">87%</div>
              <p className="text-gray-600">재구매율</p>
            </div>
          </section>

          {/* 후기 목록 */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">로딩 중...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">아직 등록된 후기가 없습니다.</p>
            </div>
          ) : (
            <section className="space-y-6">
              {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition">
                {/* 사용자 정보 */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {review.userImage ? (
                        <Image src={review.userImage} alt={review.userName} width={48} height={48} />
                      ) : (
                        <User size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.customerName || review.userName || '익명'}</p>
                      <p className="text-sm text-gray-500">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={
                          star <= (review.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* 후기 내용 */}
                <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>

                {/* 이미지가 있으면 표시 */}
                {review.image && (
                  <div className="mb-4">
                    <Image src={review.image} alt="리뷰 이미지" width={400} height={300} className="rounded-lg" />
                  </div>
                )}

                {/* 좋아요 (API에 있으면 표시) */}
                {review.likes !== undefined && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <button className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-lg transition">
                      <ThumbsUp size={18} />
                      <span className="text-sm">{review.likes}</span>
                    </button>
                  </div>
                )}
              </div>
              ))}
            </section>
          )}

          {/* 후기 작성 CTA */}
          <section className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-center text-white mt-12">
            <h2 className="text-2xl font-bold mb-4">당신의 성장 스토리를 들려주세요</h2>
            <p className="mb-6 text-green-100">
              TPT와 함께한 경험을 공유하고 다른 트레이더들에게 도움을 주세요
            </p>
            <a
              href="/my/review"
              className="inline-block px-8 py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              후기 작성하기
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
