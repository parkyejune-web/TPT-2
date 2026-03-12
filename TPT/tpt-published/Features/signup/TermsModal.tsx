'use client';

import ReactDOM from 'react-dom';
import TermsContent from './contents/TermsContent';
import PrivacyContent from './contents/PrivacyContent';
import MarketingContent from './contents/MarketingContent';

export type TermsType = 'terms' | 'privacy' | 'marketing';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TermsType;
}

const MODAL_CONFIG: Record<TermsType, { title: string; subtitle: string }> = {
  terms: {
    title: '이용약관',
    subtitle: '최종 수정일: 2025년 12월 9일',
  },
  privacy: {
    title: '개인정보 처리방침',
    subtitle: '최종 수정일: 2025년 11월 30일',
  },
  marketing: {
    title: '마케팅 정보 수신 동의 (선택)',
    subtitle: '',
  },
};

/**
 * 약관 모달 컴포넌트
 * 서비스 이용약관, 개인정보 처리방침, 마케팅 정보 수신 동의 내용을 모달로 표시
 */
export default function TermsModal({ isOpen, onClose, type }: TermsModalProps) {
  if (!isOpen) return null;

  const config = MODAL_CONFIG[type];

  const renderContent = () => {
    switch (type) {
      case 'terms':
        return <TermsContent />;
      case 'privacy':
        return <PrivacyContent />;
      case 'marketing':
        return <MarketingContent />;
      default:
        return null;
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
          {config.subtitle && (
            <p className="text-gray-500 mt-1">{config.subtitle}</p>
          )}
        </div>

        {/* 본문 (스크롤 가능) */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {renderContent()}
        </div>

        {/* 푸터 (확인 버튼) */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
