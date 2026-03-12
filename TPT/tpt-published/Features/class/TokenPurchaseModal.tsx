'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Coins, AlertTriangle, CheckCircle2, XCircle, Infinity } from 'lucide-react';
import CustomModal from '../../Shared/ui/CustomModal';

// ==================== 토큰 사용 안내 Modal ====================

interface TokenConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lectureTitle: string;
  requiredTokens: number;
  userTokens: number;
  isLoading?: boolean;
  isPremium?: boolean;
}

/**
 * 토큰 사용 안내 Modal
 * BASIC 회원이 Regular 강의를 토큰으로 구매할 때 확인 요청
 */
export function TokenConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  lectureTitle,
  requiredTokens,
  userTokens,
  isLoading = false,
  isPremium = false,
}: TokenConfirmModalProps) {
  // isPremium 사용자는 항상 토큰이 충분한 것으로 처리
  const hasEnoughTokens = isPremium || userTokens >= requiredTokens;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      variant={0}
      width="w-full max-w-md"
      padding="p-0"
      borderRadius="rounded-2xl"
    >
      <div className="p-6">
        {/* 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <Image
              src="/images/icon_coin_token.svg"
              alt="token"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        {/* 타이틀 */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          토큰을 사용하여 강의를 시청하시겠습니까?
        </h2>

        {/* 강의 정보 */}
        <p className="text-gray-600 text-center mb-6 line-clamp-2">
          {lectureTitle}
        </p>

        {/* 토큰 정보 박스 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">필요 토큰</span>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-gray-900">{requiredTokens}개</span>
            </div>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <span className="text-sm text-gray-600">보유 토큰</span>
            <div className="flex items-center gap-1.5">
              {isPremium ? (
                <span className="flex items-center gap-1.5 font-bold bg-gradient-to-r from-[#B9AB70] to-[#8B7E4A] bg-clip-text text-transparent">
                  <Infinity className="w-5 h-5 text-[#B9AB70]" />
                  무한
                </span>
              ) : (
                <>
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className={`font-bold ${hasEnoughTokens ? 'text-gray-900' : 'text-red-500'}`}>
                    {userTokens}개
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-sm text-gray-600">사용 후 잔여</span>
            <div className="flex items-center gap-1.5">
              {isPremium ? (
                <span className="flex items-center gap-1.5 font-bold bg-gradient-to-r from-[#B9AB70] to-[#8B7E4A] bg-clip-text text-transparent">
                  <Infinity className="w-5 h-5 text-[#B9AB70]" />
                  무한
                </span>
              ) : (
                <>
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className={`font-bold ${hasEnoughTokens ? 'text-green-600' : 'text-red-500'}`}>
                    {hasEnoughTokens ? `${userTokens - requiredTokens}개` : '부족'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="flex items-start gap-2 mb-6 p-3 bg-blue-50 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            토큰을 사용하여 강의를 이용하실 경우, 해당 강의는 7일 간 시청하실 수 있으며,
            사용이 완료된 토큰은 환불이 불가합니다.
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || !hasEnoughTokens}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#B9AB70] to-[#8B7E4A] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Coins className="w-4 h-4" />
                토큰 사용
              </>
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  );
}

// ==================== 토큰 결제 성공 Modal ====================

interface TokenSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  lectureTitle: string;
  usedTokens: number;
  remainingTokens: number;
}

/**
 * 토큰으로 강의 결제 성공 Modal
 */
export function TokenSuccessModal({
  isOpen,
  onClose,
  lectureTitle,
  usedTokens,
  remainingTokens,
}: TokenSuccessModalProps) {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      variant={0}
      width="w-full max-w-md"
      padding="p-0"
      borderRadius="rounded-2xl"
    >
      <div className="p-6">
        {/* 성공 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        {/* 타이틀 */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          강의 구매가 완료되었습니다!
        </h2>

        {/* 강의 정보 */}
        <p className="text-gray-600 text-center mb-6 line-clamp-2">
          {lectureTitle}
        </p>

        {/* 토큰 사용 내역 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
            <span className="text-sm text-gray-600">사용된 토큰</span>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-gray-900">-{usedTokens}개</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">남은 토큰</span>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-green-600">{remainingTokens}개</span>
            </div>
          </div>
        </div>

        {/* 안내 문구 */}
        <p className="text-sm text-gray-500 text-center mb-6">
          이제 해당 강의를 무제한으로 시청할 수 있습니다.
        </p>

        {/* 확인 버튼 */}
        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-gradient-to-r from-[#B9AB70] to-[#8B7E4A] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          강의 시청하기
        </button>
      </div>
    </CustomModal>
  );
}

// ==================== 토큰 부족 Modal ====================

interface TokenInsufficientModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredTokens: number;
  userTokens: number;
}

/**
 * 토큰 부족 (결제 불가) Modal
 */
export function TokenInsufficientModal({
  isOpen,
  onClose,
  requiredTokens,
  userTokens,
}: TokenInsufficientModalProps) {
  const shortage = requiredTokens - userTokens;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      variant={0}
      width="w-full max-w-md"
      padding="p-0"
      borderRadius="rounded-2xl"
    >
      <div className="p-6">
        {/* 실패 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* 타이틀 */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          토큰이 부족합니다
        </h2>

        {/* 설명 */}
        <p className="text-gray-600 text-center mb-6">
          이 강의를 시청하려면 토큰이 더 필요합니다.
        </p>

        {/* 토큰 정보 박스 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">필요 토큰</span>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-gray-900">{requiredTokens}개</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
            <span className="text-sm text-gray-600">보유 토큰</span>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-red-500">{userTokens}개</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">부족한 토큰</span>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-red-500" />
              <span className="font-bold text-red-500">{shortage}개</span>
            </div>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="flex items-start gap-2 mb-6 p-3 bg-amber-50 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            매매일지를 5회 작성하면 3개의 토큰이 자동으로 지급됩니다.
            꾸준히 기록하고 데이터를 쌓으며 성장하세요.
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
          {/* <a
            href="/my/support"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#B9AB70] to-[#8B7E4A] text-white rounded-xl font-medium hover:opacity-90 transition-opacity text-center"
          >
            문의하기
          </a> */}
        </div>
      </div>
    </CustomModal>
  );
}

// ==================== 통합 훅 ====================

export type TokenModalType = 'confirm' | 'success' | 'insufficient' | null;

interface UseTokenPurchaseModalOptions {
  onPurchaseSuccess?: () => void;
}

/**
 * 토큰 구매 모달 관리 훅
 */
export function useTokenPurchaseModal(options: UseTokenPurchaseModalOptions = {}) {
  const [modalType, setModalType] = useState<TokenModalType>(null);
  const [lectureInfo, setLectureInfo] = useState<{
    lectureId: number;
    lectureTitle: string;
    requiredTokens: number;
  } | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<{
    usedTokens: number;
    remainingTokens: number;
  } | null>(null);

  const openConfirmModal = (
    lectureId: number,
    lectureTitle: string,
    requiredTokens: number
  ) => {
    setLectureInfo({ lectureId, lectureTitle, requiredTokens });
    setModalType('confirm');
  };

  const openSuccessModal = (usedTokens: number, remainingTokens: number) => {
    setPurchaseResult({ usedTokens, remainingTokens });
    setModalType('success');
  };

  const openInsufficientModal = () => {
    setModalType('insufficient');
  };

  const closeModal = () => {
    if (modalType === 'success' && options.onPurchaseSuccess) {
      options.onPurchaseSuccess();
    }
    setModalType(null);
  };

  return {
    modalType,
    lectureInfo,
    purchaseResult,
    openConfirmModal,
    openSuccessModal,
    openInsufficientModal,
    closeModal,
  };
}
