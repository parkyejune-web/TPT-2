"use client";

import { useRouter } from "next/navigation";
import { X, ShieldAlert, ArrowRight } from "lucide-react";

interface UidApprovalRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * UID 승인 필요 안내 모달
 * UID 승인이 되지 않은 사용자에게 표시
 */
export default function UidApprovalRequiredModal({ isOpen, onClose }: UidApprovalRequiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleMyPageClick = () => {
    onClose();
    router.push("/my");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
            <ShieldAlert size={32} className="text-white" />
          </div>
        </div>

        {/* 제목 */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
          Regular 상태로 전환 후 열람하실 수 있습니다
        </h2>

        {/* 설명 */}
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          해당 콘텐츠는 Regular 상태로 전환 후<br />
          열람하실 수 있습니다.
        </p>

        {/* 버튼 그룹 */}
        <div className="space-y-3">
          {/* 마이페이지 버튼 */}
          <button
            onClick={handleMyPageClick}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3.5 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
          >
            마이페이지에서 확인하기
            <ArrowRight size={20} />
          </button>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3.5 rounded-lg font-semibold hover:border-amber-500 hover:text-amber-600 hover:shadow-md transition-all duration-200"
          >
            닫기
          </button>
        </div>

        {/* 부가 안내 */}
        <p className="text-xs text-gray-400 text-center mt-6">
          UID 승인은 마이페이지에서 확인하실 수 있습니다
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
