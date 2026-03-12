'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MenuSectionProps {
  onPasswordChange: () => void;
  onPaymentManagement: () => void;
  onUidClick: () => void;
  onTypeChange: () => void;
  onCustomerServiceClick: () => void;
  onWithdraw: () => void;
  isPremium: boolean;
  hasPaymentMethod?: boolean; // 결제수단 등록 여부
}

/**
 * 마이페이지 사이드바의 메뉴 섹션
 * "내 정보" Toggle, "고객센터", "회원탈퇴" 버튼
 */
export default function MenuSection({
  onPasswordChange,
  onPaymentManagement,
  onUidClick,
  onTypeChange,
  onCustomerServiceClick,
  onWithdraw,
  isPremium,
  hasPaymentMethod = false,
}: MenuSectionProps) {
  const [myInfoOpen, setMyInfoOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 w-full">
      <h3 className="text-sm font-semibold text-gray-700">Menu</h3>

      {/* 내 정보 Toggle */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setMyInfoOpen(!myInfoOpen)}
          className="flex items-center justify-between w-full py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          <span>내 정보</span>
          {myInfoOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {/* Toggle 내용 */}
        {myInfoOpen && (
          <div className="flex flex-col gap-2 pl-4">
            <button
              onClick={onPasswordChange}
              className="w-full py-2 px-4 text-sm text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition"
            >
              비밀번호 변경
            </button>
            {(isPremium || hasPaymentMethod) && (
              <button
                onClick={onPaymentManagement}
                className="w-full py-2 px-4 text-sm text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition"
              >
                결제수단 관리
              </button>
            )}
            <button
              onClick={onUidClick}
              className="w-full py-2 px-4 text-sm text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition"
            >
              UID 관리
            </button>
            {/* <button
              onClick={onTypeChange}
              className="w-full py-2 px-4 text-sm text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition"
            >
              투자 유형 변경
            </button> */}
          </div>
        )}
      </div>

      {/* 고객센터 */}
      <button
        onClick={onCustomerServiceClick}
        className="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition text-left"
      >
        고객센터
      </button>

      {/* 회원탈퇴 */}
      <button
        onClick={onWithdraw}
        className="w-full py-1 text-xs text-right text-gray-500 hover:text-gray-700 transition"
      >
        회원탈퇴
      </button>
    </div>
  );
}
