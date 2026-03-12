"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "../../../Shared/store/authStore";
import AccessGuard from "../../../Shared/ui/AccessGuard";
import ThumbnailPlaceholder from "../../../Shared/ui/ThumbnailPlaceholder";

// 피드백 카드 타입
type FeedbackCard = {
  feedbackRequestId: number;
  title: string;
  contentPreview: string;
  createdAt: string;
  isBestFeedback: boolean;
  imageUrls?: string[];
  customerName?: string;
};

export default function AllFeedback() {
  const [crownFeedbacks, setCrownFeedbacks] = useState<FeedbackCard[]>([]);
  const [otherFeedbacks, setOtherFeedbacks] = useState<FeedbackCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const { user } = useAuthStore();

  const handleNavigate = (fb: FeedbackCard) => {
    // feedbackRequestId를 사용하여 상세 페이지로 이동
    router.push(`/my/feedback-detail?id=${fb.feedbackRequestId}`);
  };

  const loadFeedbacks = async (page: number = 0) => {
    try {
      setLoading(true);

      // API 호출 - feedbackService import 필요
      const { getFeedbackList } = await import("../../../Shared/api/services/feedbackService");
      const response = await getFeedbackList(page, 20);

      if (response.success && response.data) {
        // API 응답 구조: { feedbacks: [...], sliceInfo: {...} }
        const feedbacksArray = response.data.feedbacks || [];
        const sliceInfo = response.data.sliceInfo || {};

        // API 데이터를 FeedbackCard 형식으로 변환
        const transformedFeedbacks: FeedbackCard[] = feedbacksArray.map((item: any) => ({
          feedbackRequestId: item.feedbackRequestId,
          title: item.title || '매매일지',
          contentPreview: item.contentPreview || '피드백 내용',
          createdAt: item.createdAt || new Date().toISOString(),
          isBestFeedback: item.isBestFeedback || false,
          imageUrls: item.imageUrls || [],
          customerName: item.customerName || '',
        }));

        const crowns = transformedFeedbacks.filter((f) => f.isBestFeedback);
        const others = transformedFeedbacks.filter((f) => !f.isBestFeedback);

        if (page === 0) {
          // 첫 페이지는 덮어쓰기
          setCrownFeedbacks(crowns);
          setOtherFeedbacks(others);
        } else {
          // 다음 페이지는 추가
          setCrownFeedbacks((prev) => [...prev, ...crowns]);
          setOtherFeedbacks((prev) => [...prev, ...others]);
        }

        // 다음 페이지 존재 여부 확인 (sliceInfo.hasNext)
        setHasMore(sliceInfo.hasNext || false);
      } else {
        setError(response.message || '피드백 목록을 불러올 수 없습니다.');
      }

      setCurrentPage(page);
    } catch (err) {
      console.error("피드백 목록 조회 오류:", err);
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks(0);
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // title에서 PNL 부분을 추출하여 색상 처리하는 함수
  const renderTitleWithPnl = (title: string) => {
    if (!title) return <span>매매일지</span>;

    // +로 시작하고 %로 끝나는 패턴 또는 -로 시작하고 %로 끝나는 패턴 매칭
    const pnlRegex = /([+-]\d+(?:\.\d+)?%)/g;
    const parts = title.split(pnlRegex);

    return parts.map((part, index) => {
      if (part.match(/^\+\d+(?:\.\d+)?%$/)) {
        // +로 시작하는 PNL -> 초록색
        return <span key={index} className="text-green-600 font-semibold">{part}</span>;
      } else if (part.match(/^-\d+(?:\.\d+)?%$/)) {
        // -로 시작하는 PNL -> 빨간색
        return <span key={index} className="text-red-600 font-semibold">{part}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <AccessGuard level="UID_APPROVED_REQUIRED">
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl mb-20 text-center">
        TPT의 실시간 트레이딩 피드백을 둘러보세요.
      </h1>

      {loading && currentPage === 0 ? (
        <div className="text-center py-10">로딩 중...</div>
      ) : (
        <>
          {/* 상단 베스트 피드백 */}
          {crownFeedbacks.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">BEST 매매일지</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {crownFeedbacks.map((fb) => (
                  <div
                    key={fb.feedbackRequestId}
                    onClick={() => handleNavigate(fb)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                  >
                    {/* 차트 이미지 영역 */}
                    <div className="relative h-48">
                      {fb.imageUrls && fb.imageUrls.length > 0 ? (
                        <Image
                          src={fb.imageUrls[0]}
                          alt={fb.title || '매매일지 썸네일'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <ThumbnailPlaceholder className="h-full" />
                      )}
                      {/* 왕관 아이콘 (좌측 상단) */}
                      <div className="absolute top-2 left-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id={`crownGradient-${fb.feedbackRequestId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#D2C693" />
                              <stop offset="100%" stopColor="#928346" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 14h14v2H5v-2z"
                            fill={`url(#crownGradient-${fb.feedbackRequestId})`}
                          />
                        </svg>
                      </div>
                    </div>

                    {/* 내용 */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{renderTitleWithPnl(fb.title)}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {fb.contentPreview?.substring(0, 50) || '매매일지 내용'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{fb.customerName}</span>
                        <span>{formatDate(fb.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 일반 피드백 - BASIC 사용자는 blur 처리 */}
          <div className="relative">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">전체 매매일지</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {otherFeedbacks.map((fb) => (
                <div
                  key={fb.feedbackRequestId}
                  onClick={() => handleNavigate(fb)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                >
                  {/* 차트 이미지 영역 */}
                  <div className="relative h-48">
                    {fb.imageUrls && fb.imageUrls.length > 0 ? (
                      <Image
                        src={fb.imageUrls[0]}
                        alt={fb.title || '매매일지 썸네일'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ThumbnailPlaceholder className="h-full" />
                    )}
                  </div>

                  {/* 내용 */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{renderTitleWithPnl(fb.title)}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {fb.contentPreview?.substring(0, 50) || '매매일지 내용'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{fb.customerName}</span>
                      <span>{formatDate(fb.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 비로그인 사용자용 블러 오버레이 */}
            {!user && otherFeedbacks.length > 0 && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center rounded-lg">
                <p className="text-center text-lg font-semibold text-gray-800 px-6">
                  로그인 후 이용하실 수 있는 기능입니다.
                </p>
              </div>
            )}

            {/* UID_REVIEW_PENDING 또는 UID_REJECTED 사용자용 블러 오버레이 */}
            {user && (user.userStatus === 'UID_REVIEW_PENDING' || user.userStatus === 'UID_REJECTED') && otherFeedbacks.length > 0 && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center rounded-lg">
                <p className="text-center text-lg font-semibold text-gray-800 px-6">
                  UID 승인 후 이용하실 수 있는 기능입니다.
                </p>
              </div>
            )}
          </div>

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => loadFeedbacks(currentPage + 1)}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "로딩 중..." : "더보기"}
              </button>
            </div>
          )}

          {/* 피드백 없음 */}
          {!loading && crownFeedbacks.length === 0 && otherFeedbacks.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              등록된 피드백이 없습니다.
            </div>
          )}
        </>
      )}
    </div>
    </AccessGuard>
  );
}
