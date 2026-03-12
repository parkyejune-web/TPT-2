"use client";

import { useRouter } from "next/navigation";
import { X, Lock, ArrowRight } from "lucide-react";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 로그인 필수 안내 모달
 * 고급스러운 디자인으로 비로그인 사용자에게 로그인을 유도
 */
export default function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLoginClick = () => {
    onClose();
    router.push("/login");
  };

  const handleSignupClick = () => {
    onClose();
    router.push("/signup");
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
          <div className="w-16 h-16 bg-gradient-to-br from-[#B9AB70] to-[#8B7E4A] rounded-full flex items-center justify-center shadow-lg">
            <Lock size={32} className="text-white" />
          </div>
        </div>

        {/* 제목 */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
          로그인이 필요한 서비스입니다
        </h2>

        {/* 설명 */}
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          TPT의 전문적인 칼럼과 인사이트를 확인하려면<br />
          로그인이 필요합니다.
        </p>

        {/* 버튼 그룹 */}
        <div className="space-y-3">
          {/* 로그인 버튼 */}
          <button
            onClick={handleLoginClick}
            className="w-full bg-gradient-to-r from-[#B9AB70] to-[#8B7E4A] text-white py-3.5 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
          >
            로그인하기
            <ArrowRight size={20} />
          </button>

          {/* 회원가입 버튼 */}
          <button
            onClick={handleSignupClick}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3.5 rounded-lg font-semibold hover:border-[#B9AB70] hover:text-[#B9AB70] hover:shadow-md transition-all duration-200"
          >
            회원가입하기
          </button>
        </div>

        {/* 부가 안내 */}
        <p className="text-xs text-gray-400 text-center mt-6">
          TPT와 함께 전문적인 트레이딩을 시작하세요
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
