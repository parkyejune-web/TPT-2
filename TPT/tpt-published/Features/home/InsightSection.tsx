"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

// HTML 태그를 제거하고 순수 텍스트만 추출하는 함수
const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};
import ThumbnailPlaceholder from "../../Shared/ui/ThumbnailPlaceholder";
import AccessControlModal from "../../Shared/ui/AccessControlModal";
import { useAccessControl, AccessDeniedReason } from "../../Shared/hooks/useAccessControl";
import type { HomeColumnData } from "./hooks/useHomeColumns";

interface InsightSectionProps {
  columns: HomeColumnData[];
  loading: boolean;
  error: string | null;
}

export function InsightSection({ columns, loading, error }: InsightSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accessDeniedReason, setAccessDeniedReason] = useState<AccessDeniedReason>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const router = useRouter();
  const { checkAccess } = useAccessControl();

  const handleNext = () => {
    if (currentIndex + 4 < columns.length) {
      setCurrentIndex(currentIndex + 4);
    }
  };

  const handlePrev = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex(currentIndex - 4);
    }
  };

  const handleCardClick = (id: number) => {
    // UID_APPROVED_REQUIRED 권한 검사
    const accessResult = checkAccess('UID_APPROVED_REQUIRED');
    if (!accessResult.allowed) {
      setAccessDeniedReason(accessResult.reason);
      setIsAccessModalOpen(true);
      return;
    }
    router.push(`/menu/columns/${id}`);
  };

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">10억 매매일지</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">10억 인사이트</h2>
        </div>
        <div className="text-center py-12 text-gray-500">{error}</div>
      </section>
    );
  }

  const displayedColumns = columns.slice(currentIndex, currentIndex + 4);

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">10억 인사이트</h2>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {displayedColumns.length > 0 ? displayedColumns.map((insight, index) => (
            <div
              key={`insight-${insight.id}-${index}`}
              onClick={() => handleCardClick(insight.id)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all overflow-hidden cursor-pointer"
            >
              {/* 이미지 영역 */}
              <div className="relative h-48">
                {insight.thumbnailUrl ? (
                  <Image
                    src={insight.thumbnailUrl}
                    alt={insight.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ThumbnailPlaceholder className="h-full" />
                )}
              </div>

              {/* 제목 및 부제목 */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                  {insight.title}
                </h3>
                {insight.content && (
                  <p className="text-gray-500 text-xs mt-1 line-clamp-3" title={stripHtmlTags(insight.content)}>
                    {stripHtmlTags(insight.content)}
                  </p>
                )}
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              아직 등록된 10억 인사이트가 없습니다.
            </div>
          )}
        </div>

        {/* 이전 버튼 - 첫 번째 카드와 겹치게 배치 */}
        {columns.length > 4 && currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 z-10 border border-gray-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* 다음 버튼 - 마지막 카드와 겹치게 배치 */}
        {columns.length > 4 && currentIndex + 4 < columns.length && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 z-10 border border-gray-200"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      {/* 접근 권한 검사 모달 */}
      <AccessControlModal
        isOpen={isAccessModalOpen}
        reason={accessDeniedReason}
        onClose={() => {
          setIsAccessModalOpen(false);
          setAccessDeniedReason(null);
        }}
      />
    </section>
  );
}
