"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AccessControlModal from "../../Shared/ui/AccessControlModal";
import { useAccessControl, AccessDeniedReason } from "../../Shared/hooks/useAccessControl";
import type { HomeColumnData } from "./hooks/useHomeColumns";

interface MemberReviewSectionProps {
  columns: HomeColumnData[];
  loading: boolean;
  error: string | null;
}

// HTML 태그를 제거하고 순수 텍스트만 추출하는 함수
function stripHtmlTags(html: string): string {
  if (!html) return "";
  // HTML 태그 제거
  const withoutTags = html.replace(/<[^>]*>/g, "");
  // HTML 엔티티 디코딩 (&nbsp;, &amp; 등)
  const decoded = withoutTags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  // 연속된 공백 정리
  return decoded.replace(/\s+/g, " ").trim();
}

export function MemberReviewSection({ columns, loading, error }: MemberReviewSectionProps) {
  const router = useRouter();
  const { checkAccess } = useAccessControl();
  const [accessDeniedReason, setAccessDeniedReason] = useState<AccessDeniedReason>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  // 최대 3개만 표시
  const displayedColumns = columns.slice(0, 3);

  const handleCardClick = (id: number) => {
    // LOGIN_REQUIRED 권한 검사 (비로그인 시 모달 표시)
    const accessResult = checkAccess('LOGIN_REQUIRED');
    if (!accessResult.allowed) {
      setAccessDeniedReason(accessResult.reason);
      setIsAccessModalOpen(true);
      return;
    }
    router.push(`/menu/columns/${id}`);
  };

  // 로딩 상태
  if (loading) {
    return (
      <section className="mb-12">
        <div className="bg-gray-300 w-full flex h-[1px] mb-10" />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">성장일지를 불러오는 중...</span>
        </div>
      </section>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <section className="mb-12">
        <div className="bg-gray-300 w-full flex h-[1px] mb-10" />
        <div className="flex justify-center items-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  // 데이터 없음 상태
  if (displayedColumns.length === 0) {
    return (
      <section className="mb-12">
        <div className="bg-gray-300 w-full flex h-[1px] mb-10" />
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">아직 등록된 성장일지가 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="bg-gray-300 w-full flex h-[1px] mb-10" />

      <div className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-6">
        {displayedColumns.map((column) => (
          <div
            key={column.id}
            onClick={() => handleCardClick(column.id)}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                성장일지
              </h3>
              <p className="text-sm text-gray-600">
                {column.writerName || '익명'}
              </p>
              <p className="text-sm font-semibold text-blue-600 mt-1">
                {column.subtitle || column.title}
              </p>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed line-clamp-5">
              {stripHtmlTags(column.content || "")}
            </p>
          </div>
        ))}
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
